import { Controller, Get, Body, Patch, Param, Request, HttpStatus } from '@nestjs/common';
import { BranchSettingsService } from './branch-settings.service';
import { BranchSettingsResponseDto, UpdateBranchSettingsDto } from './dto/branch-settings.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import { Permissions } from '../permissions/permissions.decorator';
import { PermissionAction } from '@prisma/client';

@ApiTags('Branch Settings')
@ApiBearerAuth('JWT-auth')
@Controller('branches/:branchId/settings')
export class BranchSettingsController {
  constructor(private readonly branchSettingsService: BranchSettingsService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Permissions(PermissionAction.MANAGE_BRANCH_SETTINGS)
  @Get()
  @ApiOperation({ summary: 'Get branch settings' })
  @ApiStandardResponse({ type: BranchSettingsResponseDto })
  async getSettings(@Param('branchId') branchId: string, @Request() req: any) {
    const result = await this.branchSettingsService.getSettings(branchId, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Branch settings retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Permissions(PermissionAction.MANAGE_BRANCH_SETTINGS)
  @Patch()
  @ApiOperation({ summary: 'Update branch settings' })
  @ApiStandardResponse({ type: BranchSettingsResponseDto })
  async updateSettings(@Param('branchId') branchId: string, @Body() dto: UpdateBranchSettingsDto, @Request() req: any) {
    const result = await this.branchSettingsService.updateSettings(branchId, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Branch settings updated', data: result });
  }
}
