import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GlobalRole } from '@prisma/client';

import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import { Roles } from '../roles/roles.decorator';
import { AnalyticsService } from './analytics.service';
import { AnalyticsOverviewDto, GrowthQueryDto, GrowthResponseDto } from './dto/analytics.dto';

/**
 * Platform-wide analytics for the super admin dashboard. Every route is
 * restricted to SUPER_ADMIN — this is cross-tenant data.
 */
@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@Roles(GlobalRole.SUPER_ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Platform KPIs (SUPER_ADMIN only)',
    description:
      'Counts of organizations, restaurants, branches, admins and users, plus onboarding ' +
      'progress (how many client admins have no restaurant or no branch yet) and 24h activity.',
  })
  @ApiStandardResponse({ type: AnalyticsOverviewDto })
  async getOverview() {
    const result = await this.analyticsService.getOverview();

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Analytics overview retrieved',
      data: result,
    });
  }

  @Get('growth')
  @ApiOperation({
    summary: 'Daily new organizations and admins (SUPER_ADMIN only)',
    description:
      'One point per day across the window, zero-filled, ready to chart. Customer volume is ' +
      'returned as a window total rather than a daily series.',
  })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 30 })
  @ApiStandardResponse({ type: GrowthResponseDto })
  async getGrowth(@Query() query: GrowthQueryDto) {
    const result = await this.analyticsService.getGrowth(query.days ?? 30);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Analytics growth retrieved',
      data: result,
    });
  }
}
