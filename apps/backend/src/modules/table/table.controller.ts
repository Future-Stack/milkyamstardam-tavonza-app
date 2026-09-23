import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, Query } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto, TableResponseDto, UpdateTableDto } from './dto/table.dto';
import { CreateReservationDto, ReservationResponseDto, UpdateReservationDto } from './dto/reservation.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole, PermissionAction, ReservationStatus } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import { Permissions } from '../permissions/permissions.decorator';

@ApiTags('Tables & Reservations')
@ApiBearerAuth('JWT-auth')
@Controller()
export class TableController {
  constructor(private readonly tableService: TableService) {}

  // --- TABLES ---

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Permissions(PermissionAction.MANAGE_TABLES)
  @Post('branches/:branchId/tables')
  @ApiOperation({ summary: 'Create table' })
  @ApiStandardResponse({ type: TableResponseDto })
  async createTable(@Param('branchId') branchId: string, @Body() dto: CreateTableDto, @Request() req: any) {
    const result = await this.tableService.createTable(branchId, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Table created', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Permissions(PermissionAction.MANAGE_TABLES)
  @Get('branches/:branchId/tables')
  @ApiOperation({ summary: 'List tables for a branch' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by label' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: 'floor,label' })
  @ApiQuery({ name: 'floor', required: false, type: Number })
  @ApiQuery({ name: 'serviceStatus', required: false })
  @ApiStandardResponse({ type: TableResponseDto, isArray: true, isPaginated: true })
  async findAllTables(@Param('branchId') branchId: string, @Query() query: Record<string, any> = {}) {
    const result = await this.tableService.findAllTables(branchId, query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Tables retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Permissions(PermissionAction.MANAGE_TABLES)
  @Patch('tables/:id')
  @ApiOperation({ summary: 'Update table' })
  @ApiStandardResponse({ type: TableResponseDto })
  async updateTable(@Param('id') id: string, @Body() dto: UpdateTableDto, @Request() req: any) {
    const result = await this.tableService.updateTable(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Table updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Delete('tables/:id')
  @ApiOperation({ summary: 'Delete table' })
  async deleteTable(@Param('id') id: string, @Request() req: any) {
    const result = await this.tableService.deleteTable(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: result.message });
  }

  // --- RESERVATIONS ---

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Post('branches/:branchId/reservations')
  @ApiOperation({ summary: 'Create reservation' })
  @ApiStandardResponse({ type: ReservationResponseDto })
  async createReservation(@Param('branchId') branchId: string, @Body() dto: CreateReservationDto, @Request() req: any) {
    const result = await this.tableService.createReservation(branchId, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Reservation created', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Get('branches/:branchId/reservations')
  @ApiOperation({ summary: 'List reservations for a branch' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by guest name or phone' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: 'reservedFor' })
  @ApiQuery({ name: 'status', required: false, enum: ReservationStatus })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  @ApiStandardResponse({ type: ReservationResponseDto, isArray: true, isPaginated: true })
  async findAllReservations(@Param('branchId') branchId: string, @Query() query: Record<string, any> = {}) {
    const result = await this.tableService.findAllReservations(branchId, query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Reservations retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch('reservations/:id')
  @ApiOperation({ summary: 'Update reservation' })
  @ApiStandardResponse({ type: ReservationResponseDto })
  async updateReservation(@Param('id') id: string, @Body() dto: UpdateReservationDto, @Request() req: any) {
    const result = await this.tableService.updateReservation(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Reservation updated', data: result });
  }
}
