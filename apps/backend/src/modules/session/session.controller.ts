import { Controller, Get, Post, Body, Patch, Param, Request, HttpStatus, Query } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateTableSessionDto, GuestSessionResponseDto, JoinTableSessionDto, TableSessionResponseDto, UpdateGuestSessionDto, UpdateTableSessionDto } from './dto/session.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole, TableSessionStatus } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import { Permissions } from '../permissions/permissions.decorator';
import { PermissionAction } from '@prisma/client';

@ApiTags('Table & Guest Sessions')
@ApiBearerAuth('JWT-auth')
@Controller()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('branches/:branchId/sessions')
  @ApiOperation({ summary: 'List active table sessions for a branch' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search join code' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-startedAt' })
  @ApiQuery({ name: 'status', required: false, enum: TableSessionStatus })
  @ApiStandardResponse({ type: TableSessionResponseDto, isArray: true, isPaginated: true })
  async findAllTableSessions(@Param('branchId') branchId: string, @Query() query: Record<string, any> = {}) {
    const result = await this.sessionService.findAllTableSessions(branchId, query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Sessions retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Post('tables/:tableId/sessions')
  @ApiOperation({ summary: 'Open a new table session (Host/Waiter)' })
  @ApiStandardResponse({ type: TableSessionResponseDto })
  async createTableSession(@Param('tableId') tableId: string, @Body() dto: CreateTableSessionDto, @Request() req: any) {
    const result = await this.sessionService.createTableSession(tableId, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Table session created', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF, GlobalRole.CUSTOMER)
  @Post('tables/:tableId/sessions/join')
  @ApiOperation({ summary: 'Join an active table session (Guest)' })
  @ApiStandardResponse({ type: GuestSessionResponseDto })
  async joinTableSession(@Param('tableId') tableId: string, @Body() dto: JoinTableSessionDto) {
    const result = await this.sessionService.joinTableSession(tableId, dto);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Joined table session', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Patch('table-sessions/:id')
  @ApiOperation({ summary: 'Update table session status' })
  @ApiStandardResponse({ type: TableSessionResponseDto })
  async updateTableSession(@Param('id') id: string, @Body() dto: UpdateTableSessionDto, @Request() req: any) {
    const result = await this.sessionService.updateTableSession(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Table session updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Patch('guest-sessions/:id')
  @ApiOperation({ summary: 'Update guest session status' })
  @ApiStandardResponse({ type: GuestSessionResponseDto })
  async updateGuestSession(@Param('id') id: string, @Body() dto: UpdateGuestSessionDto, @Request() req: any) {
    const result = await this.sessionService.updateGuestSession(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Guest session updated', data: result });
  }
}
