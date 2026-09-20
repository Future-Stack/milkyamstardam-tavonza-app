import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto, DashboardOverviewDto } from './dto/dashboard.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('overview')
  @ApiOperation({ summary: 'Get KPI overview' })
  @ApiStandardResponse({ type: DashboardOverviewDto })
  async getOverview(@Query() dto: DashboardFilterDto) {
    const result = await this.dashboardService.getOverview(dto);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Overview retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('orders-by-status')
  @ApiOperation({ summary: 'Order count grouped by status' })
  @ApiStandardResponse({ isArray: true })
  async getOrdersByStatus(@Query() dto: DashboardFilterDto) {
    const result = await this.dashboardService.getOrdersByStatus(dto);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Orders by status retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('revenue-by-day')
  @ApiOperation({ summary: 'Daily revenue for date range' })
  @ApiStandardResponse({ isArray: true })
  async getRevenueByDay(@Query() dto: DashboardFilterDto) {
    const result = await this.dashboardService.getRevenueByDay(dto);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Revenue by day retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('top-items')
  @ApiOperation({ summary: 'Most ordered menu items' })
  @ApiStandardResponse({ isArray: true })
  async getTopItems(@Query() dto: DashboardFilterDto) {
    const result = await this.dashboardService.getTopItems(dto);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Top items retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('staff-performance')
  @ApiOperation({ summary: 'Orders served per waiter' })
  @ApiStandardResponse({ isArray: true })
  async getStaffPerformance(@Query() dto: DashboardFilterDto) {
    const result = await this.dashboardService.getStaffPerformance(dto);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Staff performance retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('table-utilization')
  @ApiOperation({ summary: 'Table occupancy rates' })
  @ApiStandardResponse({})
  async getTableUtilization(@Query('branchId') branchId: string) {
    const result = await this.dashboardService.getTableUtilization(branchId);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Table utilization retrieved', data: result });
  }
}
