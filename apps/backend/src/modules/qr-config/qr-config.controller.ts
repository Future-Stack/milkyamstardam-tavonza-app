import { Controller, Get, Post, Body, Patch, Param, Request, HttpStatus } from '@nestjs/common';
import { QrConfigService } from './qr-config.service';
import { QrCodeResponseDto, UpdateQrSettingsDto } from './dto/qr-config.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('QR Ordering Config')
@ApiBearerAuth('JWT-auth')
@Controller()
export class QrConfigController {
  constructor(private readonly qrConfigService: QrConfigService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Post('tables/:id/qr-code')
  @ApiOperation({ summary: 'Generate/regenerate qrCodeToken' })
  @ApiStandardResponse({ type: QrCodeResponseDto })
  async generateQrCode(@Param('id') id: string, @Request() req: any) {
    const result = await this.qrConfigService.generateQrCode(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'QR Code generated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('tables/:id/qr-code')
  @ApiOperation({ summary: 'Get current QR code data' })
  @ApiStandardResponse({ type: QrCodeResponseDto })
  async getQrCode(@Param('id') id: string) {
    const result = await this.qrConfigService.getQrCode(id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'QR Code retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER)
  @Patch('branches/:branchId/qr-settings')
  @ApiOperation({ summary: 'Toggle self-order settings' })
  @ApiStandardResponse({})
  async updateQrSettings(@Param('branchId') branchId: string, @Body() dto: UpdateQrSettingsDto, @Request() req: any) {
    const result = await this.qrConfigService.updateQrSettings(branchId, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'QR Settings updated', data: result });
  }
}
