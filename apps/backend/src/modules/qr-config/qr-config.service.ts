import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { UpdateQrSettingsDto } from './dto/qr-config.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import * as crypto from 'crypto';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class QrConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
    private readonly configService: ConfigService,
  ) {}

  private getQrCodeUrl(token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return `${frontendUrl}/qr-order?token=${token}`;
  }

  async generateQrCode(tableId: string, actorId: string) {
    const table = await this.prisma.table.findUnique({ where: { id: tableId } });
    if (!table) throw new ApiError(HttpStatus.NOT_FOUND, 'Table not found');

    const qrCodeToken = crypto.randomUUID();
    
    await this.prisma.table.update({
      where: { id: tableId },
      data: { qrCodeToken }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: table.branchId,
      action: 'QR_CODE_GENERATED',
      entityType: 'Table',
      entityId: table.id,
    });

    return {
      tableId,
      branchId: table.branchId,
      qrCodeToken,
      qrCodeUrl: this.getQrCodeUrl(qrCodeToken)
    };
  }

  async getQrCode(tableId: string) {
    const table = await this.prisma.table.findUnique({ where: { id: tableId } });
    if (!table) throw new ApiError(HttpStatus.NOT_FOUND, 'Table not found');
    if (!table.qrCodeToken) throw new ApiError(HttpStatus.NOT_FOUND, 'QR code not generated for this table');

    return {
      tableId,
      branchId: table.branchId,
      qrCodeToken: table.qrCodeToken,
      qrCodeUrl: this.getQrCodeUrl(table.qrCodeToken)
    };
  }

  async updateQrSettings(branchId: string, dto: UpdateQrSettingsDto, actorId: string) {
    const settings = await this.prisma.branchSetting.findUnique({ where: { branchId } });
    if (!settings) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch settings not found');

    const updated = await this.prisma.branchSetting.update({
      where: { branchId },
      data: {
        ...(dto.allowMultipleGuestSessions !== undefined && { allowMultipleGuestSessions: dto.allowMultipleGuestSessions }),
        ...(dto.requireOtpPerGuest !== undefined && { requireOtpPerGuest: dto.requireOtpPerGuest }),
        ...(dto.allowSplitBill !== undefined && { allowSplitBill: dto.allowSplitBill }),
        ...(dto.allowGuestCheckoutWithoutAccount !== undefined && { allowGuestCheckoutWithoutAccount: dto.allowGuestCheckoutWithoutAccount }),
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId,
      action: 'QR_SETTINGS_UPDATED',
      entityType: 'BranchSetting',
      entityId: settings.id,
    });

    return updated;
  }
}
