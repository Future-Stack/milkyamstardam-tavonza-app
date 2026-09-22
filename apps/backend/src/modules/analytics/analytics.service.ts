import { Injectable } from '@nestjs/common';
import { GlobalRole, UserStatus } from '@prisma/client';

import { PrismaService } from '@/helper/prisma.service';
import type { AnalyticsOverviewDto, GrowthResponseDto } from './dto/analytics.dto';

const DAY_MS = 24 * 60 * 60 * 1000;

/** `YYYY-MM-DD` in UTC — the bucket key for the growth series. */
function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function tally(dates: Date[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const date of dates) {
    const key = dayKey(date);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/**
 * Platform-wide analytics for the super admin console.
 *
 * This deliberately reports on the *platform*, not on any tenant's trading:
 * `/dashboard/*` already serves per-branch orders and revenue to restaurant
 * roles. What a super admin needs is who is onboarded, how far along they are,
 * and whether the platform is being used.
 */
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private since(days: number): Date {
    return new Date(Date.now() - days * DAY_MS);
  }

  async getOverview(): Promise<AnalyticsOverviewDto> {
    const last30 = this.since(30);
    const last24h = this.since(1);

    const [
      organizationTotal,
      organizationNewLast30Days,
      organizationsWithoutRestaurant,
      restaurantTotal,
      restaurantActive,
      branchTotal,
      branchActive,
      adminTotal,
      adminActive,
      adminNewLast30Days,
      userTotal,
      userNewLast30Days,
      usersByRole,
      auditEventsLast24h,
      recentActors,
      admins,
    ] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.organization.count({ where: { createdAt: { gte: last30 } } }),
      this.prisma.organization.count({ where: { restaurants: { none: {} } } }),
      this.prisma.restaurant.count(),
      this.prisma.restaurant.count({ where: { isActive: true } }),
      this.prisma.branch.count(),
      this.prisma.branch.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: GlobalRole.ADMIN } }),
      this.prisma.user.count({ where: { role: GlobalRole.ADMIN, status: UserStatus.ACTIVE } }),
      this.prisma.user.count({ where: { role: GlobalRole.ADMIN, createdAt: { gte: last30 } } }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: last30 } } }),
      this.countUsersByRole(),
      this.prisma.auditLog.count({ where: { createdAt: { gte: last24h } } }),
      this.prisma.auditLog.findMany({
        where: { createdAt: { gte: last24h } },
        select: { actorId: true },
        take: 5000,
      }),
      // Bounded by the number of admins, so walking the relation tree is cheap.
      this.prisma.user.findMany({
        where: { role: GlobalRole.ADMIN },
        select: {
          id: true,
          ownedOrganizations: {
            select: { restaurants: { select: { branches: { select: { id: true } } } } },
          },
        },
      }),
    ]);

    const withoutRestaurant = admins.filter((admin) =>
      admin.ownedOrganizations.every((org) => org.restaurants.length === 0),
    ).length;

    const withoutBranch = admins.filter((admin) =>
      admin.ownedOrganizations.every((org) =>
        org.restaurants.every((restaurant) => restaurant.branches.length === 0),
      ),
    ).length;

    const liveAdmins = adminTotal - withoutBranch;
    const completionRate = adminTotal > 0 ? Math.round((liveAdmins / adminTotal) * 1000) / 10 : 100;

    return {
      organizations: { total: organizationTotal, newLast30Days: organizationNewLast30Days },
      restaurants: {
        total: restaurantTotal,
        active: restaurantActive,
        organizationsWithoutRestaurant,
      },
      branches: { total: branchTotal, active: branchActive },
      admins: {
        total: adminTotal,
        active: adminActive,
        inactive: adminTotal - adminActive,
        newLast30Days: adminNewLast30Days,
      },
      users: {
        total: userTotal,
        newLast30Days: userNewLast30Days,
        byRole: usersByRole,
      },
      onboarding: {
        adminsWithoutRestaurant: withoutRestaurant,
        adminsWithoutBranch: withoutBranch,
        completionRate,
      },
      activity: {
        auditEventsLast24h: auditEventsLast24h,
        activeActorsLast24h: new Set(recentActors.map((row) => row.actorId)).size,
      },
    };
  }

  /**
   * Daily counts of new organizations and admins.
   *
   * Only these two entities are tallied per day: both are bounded by the number
   * of client tenants, so the window is scanned in memory without risk. Customer
   * volume is returned as a window total instead of a series, since counting it
   * per day would mean loading every customer document created in the window.
   *
   * Days with no activity are included as zeroes so the series charts directly.
   */
  async getGrowth(days = 30): Promise<GrowthResponseDto> {
    const from = this.since(days - 1);
    from.setUTCHours(0, 0, 0, 0);

    const [organizations, admins, customers] = await Promise.all([
      this.prisma.organization.findMany({
        where: { createdAt: { gte: from } },
        select: { createdAt: true },
      }),
      this.prisma.user.findMany({
        where: { role: GlobalRole.ADMIN, createdAt: { gte: from } },
        select: { createdAt: true },
      }),
      this.prisma.user.count({
        where: { role: GlobalRole.CUSTOMER, createdAt: { gte: from } },
      }),
    ]);

    const organizationsByDay = tally(organizations.map((row) => row.createdAt));
    const adminsByDay = tally(admins.map((row) => row.createdAt));

    // Derived from a single fixed point so a run straddling UTC midnight cannot
    // skip or repeat a day.
    const today = Date.now();
    const series = [];
    for (let offset = days - 1; offset >= 0; offset--) {
      const date = dayKey(new Date(today - offset * DAY_MS));
      series.push({
        date,
        organizations: organizationsByDay[date] ?? 0,
        admins: adminsByDay[date] ?? 0,
      });
    }

    return {
      days,
      series,
      totals: {
        organizations: organizations.length,
        admins: admins.length,
        customers,
      },
    };
  }

  private async countUsersByRole(): Promise<{ role: string; count: number }[]> {
    // Cast matches the existing DashboardService pattern: Prisma's groupBy
    // overloads do not narrow cleanly on the MongoDB connector.
    const grouped = await (this.prisma.user as any).groupBy({
      by: ['role'],
      _count: { _all: true },
    });

    return (grouped as { role: string; _count: { _all: number } }[])
      .map((row) => ({ role: row.role, count: row._count._all }))
      .sort((a, b) => b.count - a.count);
  }
}
