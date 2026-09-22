import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateStaffAssignmentDto, CreateUserDto, UpdateStaffAssignmentDto } from './dto/staff.dto';
import { GlobalRole, StaffAssignment, User } from '@prisma/client';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import {
  staffUserFilterFields,
  staffUserSearchFields,
  staffUserNestedFilters,
  staffUserRangeFilter,
  staffUserInclude,
  staffAssignmentFilterFields,
  staffAssignmentSearchFields,
  staffAssignmentNestedFilters,
  staffAssignmentRangeFilter,
  staffAssignmentInclude,
} from './staff.constant';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  /**
   * The caller's own branch assignments — how a manager discovers which
   * branches they cover and what they are allowed to do there.
   *
   * Returns an empty list for users who are not branch staff (owners, admins,
   * customers), which is a normal answer rather than an error.
   */
  async findMyAssignments(userId: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { userId },
      select: {
        id: true,
        staffAssignments: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            role: true,
            permissions: true,
            isActive: true,
            createdAt: true,
            branch: {
              select: {
                id: true,
                name: true,
                timezone: true,
                isActive: true,
                restaurantId: true,
                restaurant: {
                  select: { id: true, name: true, organizationId: true },
                },
              },
            },
          },
        },
      },
    });

    return {
      staffId: staff?.id ?? null,
      assignments: (staff?.staffAssignments ?? []).map((assignment) => ({
        id: assignment.id,
        role: assignment.role,
        permissions: assignment.permissions,
        since: assignment.createdAt,
        branch: {
          id: assignment.branch.id,
          name: assignment.branch.name,
          timezone: assignment.branch.timezone,
          isActive: assignment.branch.isActive,
          restaurant: {
            id: assignment.branch.restaurant.id,
            name: assignment.branch.restaurant.name,
            organizationId: assignment.branch.restaurant.organizationId,
          },
        },
      })),
    };
  }

  async createUser(data: CreateUserDto, actorId: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError(HttpStatus.CONFLICT, 'User with this email already exists');

    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        contactNo: data.contactNo,
        name: data.name.trim(),
        role: data.role ?? GlobalRole.STAFF,
        staff: (data.role === GlobalRole.STAFF || data.role === GlobalRole.RESTAURANT_OWNER) ? {
          create: {}
        } : undefined,
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return user;
  }

  async findAllUsers(query: Record<string, any>): Promise<IGenericResponse<User[]>> {
    const queryBuilder = new QueryBuilder<User>(query, this.prisma.user);
    const result = (await queryBuilder
      .filter(staffUserFilterFields as string[])
      .search(staffUserSearchFields as string[])
      .nestedFilter(staffUserNestedFilters)
      .sort()
      .paginate()
      .include(staffUserInclude)
      .fields()
      .filterByRange(staffUserRangeFilter)
      .execute()) as User[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async assignStaff(branchId: string, data: CreateStaffAssignmentDto, actorId: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch not found');

    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      include: { staff: true },
    });
    if (!user) throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');

    // Ensure staff profile exists
    let staffId = user.staff?.id;
    if (!staffId) {
      const newStaff = await this.prisma.staff.create({ data: { userId: user.id } });
      staffId = newStaff.id;
    }

    const existingAssignment = await this.prisma.staffAssignment.findUnique({
      where: { staffId_branchId: { staffId, branchId } }
    });
    if (existingAssignment) throw new ApiError(HttpStatus.CONFLICT, 'Staff is already assigned to this branch');

    const assignment = await this.prisma.staffAssignment.create({
      data: {
        staffId,
        branchId,
        role: data.role,
        permissions: data.permissions ?? [],
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId,
      action: 'STAFF_ASSIGNED',
      entityType: 'StaffAssignment',
      entityId: assignment.id,
      metadata: { userId: user.id, role: assignment.role },
    });

    return assignment;
  }

  async updateStaffAssignment(id: string, data: UpdateStaffAssignmentDto, actorId: string) {
    const assignment = await this.prisma.staffAssignment.findUnique({ where: { id } });
    if (!assignment) throw new ApiError(HttpStatus.NOT_FOUND, 'Staff assignment not found');

    const updated = await this.prisma.staffAssignment.update({
      where: { id },
      data: {
        ...(data.role && { role: data.role }),
        ...(data.permissions && { permissions: data.permissions }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: assignment.branchId,
      action: 'STAFF_ASSIGNMENT_UPDATED',
      entityType: 'StaffAssignment',
      entityId: assignment.id,
    });

    return updated;
  }

  async removeStaffAssignment(id: string, actorId: string) {
    const assignment = await this.prisma.staffAssignment.findUnique({ where: { id } });
    if (!assignment) throw new ApiError(HttpStatus.NOT_FOUND, 'Staff assignment not found');

    await this.prisma.staffAssignment.delete({ where: { id } });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: assignment.branchId,
      action: 'STAFF_ASSIGNMENT_REMOVED',
      entityType: 'StaffAssignment',
      entityId: assignment.id,
    });

    return { message: 'Staff assignment removed successfully' };
  }

  async findStaffByBranch(branchId: string, query: Record<string, any> = {}): Promise<IGenericResponse<StaffAssignment[]>> {
    const queryBuilder = new QueryBuilder<StaffAssignment>(query, this.prisma.staffAssignment);
    const result = (await queryBuilder
      .filter(staffAssignmentFilterFields as string[])
      .search(staffAssignmentSearchFields as string[])
      .nestedFilter(staffAssignmentNestedFilters)
      .sort()
      .paginate()
      .include(staffAssignmentInclude)
      .fields()
      .filterByRange(staffAssignmentRangeFilter)
      .rawFilter({ branchId })
      .execute()) as StaffAssignment[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }
}
