import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateTableSessionDto, JoinTableSessionDto, UpdateGuestSessionDto, UpdateTableSessionDto } from './dto/session.dto';
import { GuestSessionStatus, TableSession, TableSessionStatus } from '@prisma/client';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import {
  sessionFilterFields,
  sessionSearchFields,
  sessionNestedFilters,
  sessionRangeFilter,
  sessionInclude,
} from './session.constant';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  // --- TABLE SESSIONS ---

  async createTableSession(tableId: string, data: CreateTableSessionDto, actorId: string) {
    const table = await this.prisma.table.findUnique({ where: { id: tableId } });
    if (!table) throw new ApiError(HttpStatus.NOT_FOUND, 'Table not found');

    const activeSession = await this.prisma.tableSession.findFirst({
      where: { tableId, status: { in: [TableSessionStatus.ACTIVE, TableSessionStatus.BILL_REQUESTED] } }
    });
    if (activeSession) throw new ApiError(HttpStatus.CONFLICT, 'Table already has an active session');

    // Generate a simple 6-character join code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const session = await this.prisma.tableSession.create({
      data: {
        tableId,
        branchId: table.branchId,
        joinCode,
        partySize: data.partySize,
        openedByStaffId: actorId, // assumes actor is staff
      },
    });

    if (data.reservationId) {
      await this.prisma.reservation.update({
        where: { id: data.reservationId },
        data: { tableSessionId: session.id, status: 'SEATED' }
      });
    }

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: table.branchId,
      action: 'TABLE_SESSION_CREATED',
      entityType: 'TableSession',
      entityId: session.id,
      metadata: { tableId, joinCode },
    });

    return session;
  }

  async findAllTableSessions(branchId: string, query: Record<string, any> = {}): Promise<IGenericResponse<TableSession[]>> {
    const queryBuilder = new QueryBuilder<TableSession>(query, this.prisma.tableSession);
    const result = (await queryBuilder
      .filter(sessionFilterFields as string[])
      .search(sessionSearchFields as string[])
      .nestedFilter(sessionNestedFilters)
      .sort()
      .paginate()
      .include(sessionInclude)
      .fields()
      .filterByRange(sessionRangeFilter)
      .rawFilter({ branchId })
      .execute()) as TableSession[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async updateTableSession(id: string, data: UpdateTableSessionDto, actorId: string) {
    const session = await this.prisma.tableSession.findUnique({ where: { id } });
    if (!session) throw new ApiError(HttpStatus.NOT_FOUND, 'Table session not found');

    const updated = await this.prisma.tableSession.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.partySize !== undefined && { partySize: data.partySize }),
        ...(data.status === TableSessionStatus.COMPLETED || data.status === TableSessionStatus.ABANDONED ? {
          endedAt: new Date(),
          closedByStaffId: actorId,
        } : {}),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: session.branchId,
      action: 'TABLE_SESSION_UPDATED',
      entityType: 'TableSession',
      entityId: session.id,
      metadata: { status: updated.status },
    });

    return updated;
  }

  // --- GUEST SESSIONS ---

  async joinTableSession(tableId: string, data: JoinTableSessionDto) {
    const session = await this.prisma.tableSession.findFirst({
      where: { tableId, status: TableSessionStatus.ACTIVE },
    });
    if (!session) throw new ApiError(HttpStatus.NOT_FOUND, 'No active session for this table');

    const isHostGuest = (await this.prisma.guestSession.count({ where: { tableSessionId: session.id } })) === 0;

    const guestSession = await this.prisma.guestSession.create({
      data: {
        tableSessionId: session.id,
        customerId: data.customerId,
        displayName: data.displayName || (isHostGuest ? 'Host' : `Guest ${Math.floor(Math.random() * 1000)}`),
        contact: data.contact,
        isHostGuest,
      },
    });

    return guestSession;
  }

  async updateGuestSession(id: string, data: UpdateGuestSessionDto, actorId: string) {
    const session = await this.prisma.guestSession.findUnique({
      where: { id },
      include: { tableSession: true }
    });
    if (!session) throw new ApiError(HttpStatus.NOT_FOUND, 'Guest session not found');

    const updated = await this.prisma.guestSession.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.displayName && { displayName: data.displayName.trim() }),
        ...(data.status === GuestSessionStatus.LEFT || data.status === GuestSessionStatus.CLOSED ? {
          leftAt: new Date(),
        } : {}),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: session.tableSession.branchId,
      action: 'GUEST_SESSION_UPDATED',
      entityType: 'GuestSession',
      entityId: session.id,
      metadata: { status: updated.status },
    });

    return updated;
  }
}
