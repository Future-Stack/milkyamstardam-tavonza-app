import { Controller, Get, Post, Body, Param, Request, HttpStatus } from '@nestjs/common';
import { PosService } from './pos.service';
import { PosSettleDto, PosShiftSummaryDto } from './dto/pos.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('POS')
@ApiBearerAuth('JWT-auth')
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('branches/:branchId/active-orders')
  @ApiOperation({ summary: 'Get active orders for POS' })
  @ApiStandardResponse({ isArray: true })
  async getActiveOrders(@Param('branchId') branchId: string) {
    const result = await this.posService.getActiveOrders(branchId);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Active orders retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Post('settle')
  @ApiOperation({ summary: 'Quick-settle from POS' })
  @ApiStandardResponse({})
  async settleOrder(@Body() dto: PosSettleDto, @Request() req: any) {
    const result = await this.posService.settleOrder(dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Order settled via POS', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('branches/:branchId/shift-summary')
  @ApiOperation({ summary: 'Current shift revenue/transaction summary' })
  @ApiStandardResponse({ type: PosShiftSummaryDto })
  async getShiftSummary(@Param('branchId') branchId: string, @Request() req: any) {
    const result = await this.posService.getShiftSummary(branchId, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Shift summary retrieved', data: result });
  }
}
