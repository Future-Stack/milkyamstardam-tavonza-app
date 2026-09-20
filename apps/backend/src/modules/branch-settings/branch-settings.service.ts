import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { UpdateBranchSettingsDto } from './dto/branch-settings.dto';

@Injectable()
export class BranchSettingsService {
  private readonly logger = new Logger(BranchSettingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async getSettings(branchId: string, actorId: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch not found');

    let settings = await this.prisma.branchSetting.findUnique({
      where: { branchId },
    });

    if (!settings) {
      settings = await this.prisma.branchSetting.create({
        data: { branchId },
      });
      this.auditLog.handleAuditLogEvent({
        actorId,
        branchId,
        action: 'BRANCH_SETTINGS_INITIALIZED',
        entityType: 'BranchSetting',
        entityId: settings.id,
      });
    }

    return settings;
  }

  async updateSettings(branchId: string, data: UpdateBranchSettingsDto, actorId: string) {
    const settings = await this.getSettings(branchId, actorId); // ensures it exists

    const updated = await this.prisma.branchSetting.update({
      where: { id: settings.id },
      data: {
        ...(data.orderAcceptanceMode && { orderAcceptanceMode: data.orderAcceptanceMode }),
        ...(data.backupAccepterRoles && { backupAccepterRoles: data.backupAccepterRoles }),
        ...(data.hideUnavailableItems !== undefined && { hideUnavailableItems: data.hideUnavailableItems }),
        ...(data.allowMultipleGuestSessions !== undefined && { allowMultipleGuestSessions: data.allowMultipleGuestSessions }),
        ...(data.requireOtpPerGuest !== undefined && { requireOtpPerGuest: data.requireOtpPerGuest }),
        ...(data.allowSplitBill !== undefined && { allowSplitBill: data.allowSplitBill }),
        ...(data.allowGuestCheckoutWithoutAccount !== undefined && { allowGuestCheckoutWithoutAccount: data.allowGuestCheckoutWithoutAccount }),
        ...(data.autoCloseIdleSessionMins !== undefined && { autoCloseIdleSessionMins: data.autoCloseIdleSessionMins }),
        ...(data.currency && { currency: data.currency }),
        ...(data.taxPercent !== undefined && { taxPercent: data.taxPercent }),
        ...(data.serviceChargePct !== undefined && { serviceChargePct: data.serviceChargePct }),
        ...(data.tipEnabled !== undefined && { tipEnabled: data.tipEnabled }),
        ...(data.reservationsEnabled !== undefined && { reservationsEnabled: data.reservationsEnabled }),
        ...(data.waitlistEnabled !== undefined && { waitlistEnabled: data.waitlistEnabled }),
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId,
      action: 'BRANCH_SETTINGS_UPDATED',
      entityType: 'BranchSetting',
      entityId: settings.id,
    });

    return updated;
  }
}
