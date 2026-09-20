import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import { Table, Reservation } from '@prisma/client';
import {
  tableFilterFields,
  tableSearchFields,
  tableNestedFilters,
  tableRangeFilter,
  tableInclude,
  reservationFilterFields,
  reservationSearchFields,
  reservationNestedFilters,
  reservationRangeFilter,
  reservationInclude,
} from './table.constant';

@Injectable()
export class TableService {
  private readonly logger = new Logger(TableService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  // --- TABLES ---

  async createTable(branchId: string, data: CreateTableDto, actorId: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch not found');

    const table = await this.prisma.table.create({
      data: {
        branchId,
        label: data.label.trim(),
        capacity: data.capacity,
        shape: data.shape,
        floor: data.floor ?? 1,
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId,
      action: 'TABLE_CREATED',
      entityType: 'Table',
      entityId: table.id,
      metadata: { label: table.label },
    });

    return table;
  }

  async findAllTables(branchId: string, query: Record<string, any> = {}): Promise<IGenericResponse<Table[]>> {
    const queryBuilder = new QueryBuilder<Table>(query, this.prisma.table);
    const result = (await queryBuilder
      .filter(tableFilterFields as string[])
      .search(tableSearchFields as string[])
      .nestedFilter(tableNestedFilters)
      .sort()
      .paginate()
      .include(tableInclude)
      .fields()
      .filterByRange(tableRangeFilter)
      .rawFilter({ branchId })
      .execute()) as Table[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async updateTable(id: string, data: UpdateTableDto, actorId: string) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new ApiError(HttpStatus.NOT_FOUND, 'Table not found');

    const updated = await this.prisma.table.update({
      where: { id },
      data: {
        ...(data.label && { label: data.label.trim() }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.shape && { shape: data.shape }),
        ...(data.floor !== undefined && { floor: data.floor }),
        ...(data.serviceStatus && { serviceStatus: data.serviceStatus }),
        ...(data.operationalFlag && { operationalFlag: data.operationalFlag }),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: table.branchId,
      action: 'TABLE_UPDATED',
      entityType: 'Table',
      entityId: table.id,
    });

    return updated;
  }

  async deleteTable(id: string, actorId: string) {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: { _count: { select: { tableSessions: true, orders: true } } },
    });
    if (!table) throw new ApiError(HttpStatus.NOT_FOUND, 'Table not found');

    if (table._count.tableSessions > 0 || table._count.orders > 0) {
      throw new ApiError(HttpStatus.CONFLICT, 'Cannot delete table with existing sessions or orders');
    }

    await this.prisma.table.delete({ where: { id } });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: table.branchId,
      action: 'TABLE_DELETED',
      entityType: 'Table',
      entityId: table.id,
    });

    return { message: 'Table deleted successfully' };
  }

  // --- RESERVATIONS ---

  async createReservation(branchId: string, data: CreateReservationDto, actorId: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch not found');

    if (data.tableId) {
      const table = await this.prisma.table.findUnique({ where: { id: data.tableId } });
      if (!table || table.branchId !== branchId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid table ID');
      }
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        branchId,
        tableId: data.tableId,
        guestName: data.guestName.trim(),
        guestPhone: data.guestPhone.trim(),
        partySize: data.partySize,
        reservedFor: new Date(data.reservedFor),
        durationMins: data.durationMins ?? 90,
        specialRequest: data.specialRequest,
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId,
      action: 'RESERVATION_CREATED',
      entityType: 'Reservation',
      entityId: reservation.id,
    });

    return reservation;
  }

  async findAllReservations(branchId: string, query: Record<string, any> = {}): Promise<IGenericResponse<Reservation[]>> {
    const formattedQuery = { ...query };
    if (formattedQuery.date && !formattedQuery.startDate && !formattedQuery.endDate) {
      const date = new Date(formattedQuery.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      formattedQuery.startDate = date.toISOString();
      formattedQuery.endDate = nextDay.toISOString();
      delete formattedQuery.date;
    }

    const queryBuilder = new QueryBuilder<Reservation>(formattedQuery, this.prisma.reservation);
    const result = (await queryBuilder
      .filter(reservationFilterFields as string[])
      .search(reservationSearchFields as string[])
      .nestedFilter(reservationNestedFilters)
      .sort()
      .paginate()
      .include(reservationInclude)
      .fields()
      .filterByRange(reservationRangeFilter)
      .rawFilter({ branchId })
      .execute()) as Reservation[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async updateReservation(id: string, data: UpdateReservationDto, actorId: string) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) throw new ApiError(HttpStatus.NOT_FOUND, 'Reservation not found');

    if (data.tableId) {
      const table = await this.prisma.table.findUnique({ where: { id: data.tableId } });
      if (!table || table.branchId !== reservation.branchId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid table ID');
      }
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: {
        ...(data.tableId && { tableId: data.tableId }),
        ...(data.guestName && { guestName: data.guestName.trim() }),
        ...(data.guestPhone && { guestPhone: data.guestPhone.trim() }),
        ...(data.partySize !== undefined && { partySize: data.partySize }),
        ...(data.reservedFor && { reservedFor: new Date(data.reservedFor) }),
        ...(data.durationMins !== undefined && { durationMins: data.durationMins }),
        ...(data.status && { status: data.status }),
        ...(data.specialRequest !== undefined && { specialRequest: data.specialRequest }),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: reservation.branchId,
      action: 'RESERVATION_UPDATED',
      entityType: 'Reservation',
      entityId: reservation.id,
      metadata: { status: updated.status },
    });

    return updated;
  }
}
