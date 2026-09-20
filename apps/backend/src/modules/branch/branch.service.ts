import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import { Branch } from '@prisma/client';
import {
  branchFilterFields,
  branchSearchFields,
  branchNestedFilters,
  branchRangeFilter,
  branchInclude,
} from './branch.constant';

@Injectable()
export class BranchService {
  private readonly logger = new Logger(BranchService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async create(restaurantId: string, data: CreateBranchDto, actorId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) throw new ApiError(HttpStatus.NOT_FOUND, 'Restaurant not found');

    const branch = await this.prisma.branch.create({
      data: {
        restaurantId,
        name: data.name.trim(),
        address: {
          line1: data.address.line1,
          line2: data.address.line2,
          city: data.address.city,
          state: data.address.state,
          postalCode: data.address.postalCode,
          country: data.address.country,
          lat: data.address.lat,
          lng: data.address.lng,
        },
        phone: data.phone,
        timezone: data.timezone ?? 'UTC',
        isActive: data.isActive ?? true,
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: branch.id,
      action: 'BRANCH_CREATED',
      entityType: 'Branch',
      entityId: branch.id,
      metadata: { name: branch.name, restaurantId },
    });

    return branch;
  }

  async findAll(query: Record<string, any>): Promise<IGenericResponse<Branch[]>> {
    const queryBuilder = new QueryBuilder<Branch>(query, this.prisma.branch);
    const result = (await queryBuilder
      .filter(branchFilterFields as string[])
      .search(branchSearchFields as string[])
      .nestedFilter(branchNestedFilters)
      .sort()
      .paginate()
      .include(branchInclude)
      .fields()
      .filterByRange(branchRangeFilter)
      .execute()) as Branch[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });
    if (!branch) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch not found');
    return branch;
  }

  async update(id: string, data: UpdateBranchDto, actorId: string) {
    const branch = await this.findOne(id);
    
    let updatedAddress = branch.address;
    if (data.address) {
      updatedAddress = { ...branch.address, ...data.address };
    }

    const updated = await this.prisma.branch.update({
      where: { id: branch.id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.address && { address: updatedAddress }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.timezone && { timezone: data.timezone }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: branch.id,
      action: 'BRANCH_UPDATED',
      entityType: 'Branch',
      entityId: branch.id,
      metadata: data,
    });

    return updated;
  }

  async remove(id: string, actorId: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tables: true, orders: true },
        },
      },
    });

    if (!branch) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch not found');

    if (branch._count.tables > 0 || branch._count.orders > 0) {
      throw new ApiError(HttpStatus.CONFLICT, 'Cannot delete branch with existing tables or orders.');
    }

    await this.prisma.branch.delete({
      where: { id: branch.id },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: branch.id,
      action: 'BRANCH_DELETED',
      entityType: 'Branch',
      entityId: branch.id,
    });

    return { message: 'Branch deleted successfully' };
  }
}
