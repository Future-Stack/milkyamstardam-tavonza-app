import { ConfigService } from '@/config/config.service';
import { PrismaService } from '@/helper/prisma.service';
import { IGenericResponse } from '@/interface/common';
import { ApiError } from '@/utils/api_error';
import { BcryptService } from '@/utils/bcrypt.service';
import QueryBuilder from '@/utils/query_builder';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GlobalRole, Prisma, UserStatus } from '@prisma/client';
import {
  adminFilterFields,
  adminInclude,
  adminNestedFilters,
  adminRangeFilter,
  adminSearchFields,
  adminSelect,
} from './admin.constant';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

/**
 * Admin lifecycle management. Every method here is reached only by a
 * SUPER_ADMIN (enforced by @Roles on AdminController).
 */
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Creates an ADMIN user and, in the same transaction, exactly ONE
   * organization owned by them and named after them.
   *
   * An admin may own several organizations later on; this only guarantees the
   * single one that exists from creation time.
   */
  async create(data: CreateAdminDto) {
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();
    const organizationName = data.organizationName?.trim() || name;

    const plainPassword =
      data.password || this.configService.get('DEFAULT_ADMIN_PASSWORD') || 'admin123456';
    const password = await this.bcryptService.hash(plainPassword);

    const created = await this.prisma.$transaction(
      async (tx) => {
        const emailTaken = await tx.user.findUnique({ where: { email }, select: { id: true } });
        if (emailTaken) {
          throw new ApiError(HttpStatus.CONFLICT, 'A user with this email already exists');
        }

        if (data.contactNo) {
          const contactTaken = await tx.user.findUnique({
            where: { contactNo: data.contactNo },
            select: { id: true },
          });
          if (contactTaken) {
            throw new ApiError(HttpStatus.CONFLICT, 'A user with this contact number already exists');
          }
        }

        const user = await tx.user.create({
          data: {
            email,
            name,
            contactNo: data.contactNo?.trim() || undefined,
            avatar: data.avatar,
            password,
            role: GlobalRole.ADMIN,
            status: UserStatus.ACTIVE,
          },
        });

        // Admin profile row (1:1 with the user).
        await tx.admin.create({ data: { userId: user.id } });

        // 🏢 Exactly one organization, owned by and named after the new admin.
        await tx.organization.create({
          data: { name: organizationName, ownerId: user.id },
        });

        return user;
      },
      { maxWait: 10000, timeout: 20000 },
    );

    this.logger.log(`Admin created: ${created.email} (organization: "${organizationName}")`);

    return this.prisma.user.findUnique({
      where: { id: created.id },
      select: adminSelect,
    });
  }

  async findAll(query: Record<string, any>): Promise<IGenericResponse<unknown[]>> {
    const queryBuilder = new QueryBuilder(query, this.prisma.user);
    const result = await queryBuilder
      .filter(adminFilterFields)
      .search(adminSearchFields)
      .nestedFilter(adminNestedFilters)
      .sort()
      .paginate()
      .include(adminInclude)
      .fields()
      .filterByRange(adminRangeFilter)
      .rawFilter({ role: GlobalRole.ADMIN })
      .execute();

    const meta = await queryBuilder.countTotal();

    const data = (result as any[]).map((user) => {
      delete user.password;
      return user;
    });

    return { meta, data };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: adminSelect,
    });

    if (!user || user.role !== GlobalRole.ADMIN) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Admin Not Found');
    }

    return user;
  }

  async update(id: string, data: UpdateAdminDto, avatar?: string) {
    const adminUser = await this.findOne(id);

    // Profile fields live on the underlying User row; `intro` lives on the 1:1 Admin row.
    const userPayload: Prisma.UserUpdateInput = {};
    if (data.name !== undefined) userPayload.name = data.name.trim();
    if (data.contactNo !== undefined) userPayload.contactNo = data.contactNo.trim() || null;
    if (avatar) userPayload.avatar = avatar;

    const adminPayload: Prisma.AdminUpdateInput = {};
    if (data.intro !== undefined) adminPayload.intro = data.intro.trim();

    if (Object.keys(userPayload).length === 0 && Object.keys(adminPayload).length === 0) {
      return adminUser;
    }

    return this.prisma.$transaction(
      async (tx) => {
        if (Object.keys(userPayload).length > 0) {
          await tx.user.update({
            where: { id: adminUser.id },
            data: userPayload,
            select: { id: true },
          });
        }

        if (Object.keys(adminPayload).length > 0) {
          await tx.admin.update({
            where: { userId: adminUser.id },
            data: adminPayload,
          });
        }

        return tx.user.findUnique({
          where: { id: adminUser.id },
          select: adminSelect,
        });
      },
      { maxWait: 10000, timeout: 20000 },
    );
  }

  /** Flips an admin between ACTIVE and INACTIVE — how a super admin suspends access. */
  async changeStatus(id: string) {
    const admin = await this.findOne(id);

    return this.prisma.user.update({
      where: { id: admin.id },
      data: {
        status: admin.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE,
      },
      select: adminSelect,
    });
  }

  /**
   * Removes an admin together with their profile row and owned organizations.
   *
   * Refuses if any owned organization already has restaurants — those carry
   * branches, menus and orders, so ownership must be reassigned first rather
   * than silently destroyed.
   */
  async remove(id: string) {
    const admin = await this.findOne(id);

    const organizations = await this.prisma.organization.findMany({
      where: { ownerId: admin.id },
      select: { id: true, name: true, _count: { select: { restaurants: true } } },
    });

    const withRestaurants = organizations.filter((org) => org._count.restaurants > 0);
    if (withRestaurants.length > 0) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        `Cannot delete this admin: organization(s) ${withRestaurants
          .map((org) => `"${org.name}"`)
          .join(', ')} still have restaurants. Reassign or remove them first.`,
      );
    }

    await this.prisma.$transaction(
      async (tx) => {
        await tx.organization.deleteMany({ where: { ownerId: admin.id } });
        await tx.admin.deleteMany({ where: { userId: admin.id } });
        await tx.user.delete({ where: { id: admin.id } });
      },
      { maxWait: 10000, timeout: 20000 },
    );

    this.logger.log(`Admin deleted: ${admin.email}`);

    return {
      id: admin.id,
      email: admin.email,
      deletedOrganizations: organizations.length,
    };
  }
}
