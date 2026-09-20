import { Controller, Get, Patch, Body, Param, Request, HttpStatus, Query } from '@nestjs/common';
import { DisplayService } from './display.service';
import { DisplayItemResponseDto, UpdateDisplayItemStatusDto } from './dto/display.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole, StationType } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('Kitchen/Bar Display')
@ApiBearerAuth('JWT-auth')
@Controller()
export class DisplayController {
  constructor(private readonly displayService: DisplayService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('branches/:branchId/kitchen-display')
  @ApiOperation({ summary: 'Get pending/preparing items for kitchen' })
  @ApiStandardResponse({ type: DisplayItemResponseDto, isArray: true })
  async getKitchenDisplay(@Param('branchId') branchId: string) {
    const result = await this.displayService.getDisplayItems(branchId, StationType.KITCHEN);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Kitchen items retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('branches/:branchId/bar-display')
  @ApiOperation({ summary: 'Get pending/preparing items for bar' })
  @ApiStandardResponse({ type: DisplayItemResponseDto, isArray: true })
  async getBarDisplay(@Param('branchId') branchId: string) {
    const result = await this.displayService.getDisplayItems(branchId, StationType.BAR);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Bar items retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Patch('display-items/:id/status')
  @ApiOperation({ summary: 'Mark item preparing/ready/unavailable' })
  @ApiStandardResponse({ type: DisplayItemResponseDto })
  async updateItemStatus(@Param('id') id: string, @Body() dto: UpdateDisplayItemStatusDto, @Request() req: any) {
    const result = await this.displayService.updateItemStatus(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Item status updated', data: result });
  }
}
