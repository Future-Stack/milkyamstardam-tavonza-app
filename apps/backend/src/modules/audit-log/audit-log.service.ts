import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/helper/prisma.service';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import { AuditLog } from '@prisma/client';
import {
  auditLogFilterFields,
  auditLogSearchFields,
  auditLogNestedFilters,
  auditLogRangeFilter,
  auditLogInclude,
} from './audit-log.constant';

export interface AuditLogEventParams {
  actorId: string;
  branchId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: any;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('audit.log', { async: true })
  async handleAuditLogEvent(payload: AuditLogEventParams) {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: payload.actorId,
          branchId: payload.branchId,
          action: payload.action,
          entityType: payload.entityType,
          entityId: payload.entityId,
          metadata: payload.metadata ?? null,
        }
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to save audit log for action ${payload.action} on ${payload.entityType}:${payload.entityId}`,
        error.stack
      );
    }
  }

  async findAll(query: Record<string, any>): Promise<IGenericResponse<AuditLog[]>> {
    const queryBuilder = new QueryBuilder<AuditLog>(query, this.prisma.auditLog);
    const result = (await queryBuilder
      .filter(auditLogFilterFields as string[])
      .search(auditLogSearchFields as string[])
      .nestedFilter(auditLogNestedFilters)
      .sort()
      .paginate()
      .include(auditLogInclude)
      .fields()
      .filterByRange(auditLogRangeFilter)
      .execute()) as AuditLog[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async findOne(id: string) {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: { actor: { select: { id: true, name: true, role: true } } }
    });
    if (!log) throw new Error('Audit log not found');
    return log;
  }
}
