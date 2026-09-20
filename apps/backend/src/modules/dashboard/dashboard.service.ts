import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { DashboardFilterDto } from './dto/dashboard.dto';
import { OrderStatus, PaymentStatus, TableServiceStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(dto: DashboardFilterDto) {
    const whereCondition = {
      branchId: dto.branchId,
      ...(dto.startDate && dto.endDate ? {
        createdAt: { gte: new Date(dto.startDate), lte: new Date(dto.endDate) }
      } : {})
    };

    const totalOrders = await this.prisma.order.count({ where: whereCondition });
    
    const revenue = await this.prisma.payment.aggregate({
      where: {
        order: { branchId: dto.branchId },
        status: PaymentStatus.PAID,
        ...(dto.startDate && dto.endDate ? { paidAt: { gte: new Date(dto.startDate), lte: new Date(dto.endDate) } } : {})
      },
      _sum: { amount: true }
    });

    const activeTables = await this.prisma.table.count({
      where: { branchId: dto.branchId, serviceStatus: { not: TableServiceStatus.AVAILABLE } }
    });

    const totalRevenue = revenue._sum.amount || 0;

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      activeTables
    };
  }

  async getOrdersByStatus(dto: DashboardFilterDto) {
    const whereCondition = {
      branchId: dto.branchId,
      ...(dto.startDate && dto.endDate ? {
        createdAt: { gte: new Date(dto.startDate), lte: new Date(dto.endDate) }
      } : {})
    };

    const group = await (this.prisma.order as any).groupBy({
      by: ['status'],
      where: whereCondition as any,
      _count: { _all: true }
    });

    return group.map(g => ({ status: g.status, count: g._count._all }));
  }

  async getRevenueByDay(dto: DashboardFilterDto) {
    // In MongoDB Prisma, grouping by formatted date is not natively supported in groupBy without raw queries or aggregation pipeline
    // For MVP, we will fetch and map in memory if dataset is small, or use raw mongo.
    // For simplicity, we just return a placeholder or do an approximation if we had a raw query.
    // Given the constraints, let's fetch paid orders within range and group in memory.
    const payments = await this.prisma.payment.findMany({
      where: {
        order: { branchId: dto.branchId },
        status: PaymentStatus.PAID,
        ...(dto.startDate && dto.endDate ? { paidAt: { gte: new Date(dto.startDate), lte: new Date(dto.endDate) } } : {})
      },
      select: { amount: true, paidAt: true }
    });

    const dailyRevenue: Record<string, number> = {};
    payments.forEach(p => {
      if (!p.paidAt) return;
      const date = p.paidAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + p.amount;
    });

    return Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getTopItems(dto: DashboardFilterDto) {
    const whereCondition = {
      order: {
        branchId: dto.branchId,
        ...(dto.startDate && dto.endDate ? {
          createdAt: { gte: new Date(dto.startDate), lte: new Date(dto.endDate) }
        } : {})
      }
    };

    const group = await (this.prisma.orderItem as any).groupBy({
      by: ['productNameSnapshot'],
      where: whereCondition as any,
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    });

    return group.map(g => ({ name: g.productNameSnapshot, quantity: g._sum.quantity || 0 }));
  }

  async getStaffPerformance(dto: DashboardFilterDto) {
    const group = await (this.prisma.order as any).groupBy({
      by: ['placedByStaffId'],
      where: {
        branchId: dto.branchId,
        placedByStaffId: { not: null },
        ...(dto.startDate && dto.endDate ? {
          createdAt: { gte: new Date(dto.startDate), lte: new Date(dto.endDate) }
        } : {})
      } as any,
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } },
      take: 10
    });

    return group.map(g => ({ staffId: g.placedByStaffId, ordersCount: g._count._all }));
  }

  async getTableUtilization(branchId: string) {
    const totalTables = await this.prisma.table.count({ where: { branchId } });
    const activeTables = await this.prisma.table.count({ where: { branchId, serviceStatus: { not: TableServiceStatus.AVAILABLE } } });

    return {
      totalTables,
      activeTables,
      occupancyRate: totalTables > 0 ? (activeTables / totalTables) * 100 : 0
    };
  }
}
