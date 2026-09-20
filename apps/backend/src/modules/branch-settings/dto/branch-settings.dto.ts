import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min, IsArray } from 'class-validator';
import { OrderAcceptanceMode, StaffRole } from '@prisma/client';

export class UpdateBranchSettingsDto {
  @ApiPropertyOptional({ enum: OrderAcceptanceMode })
  @IsEnum(OrderAcceptanceMode)
  @IsOptional()
  orderAcceptanceMode?: OrderAcceptanceMode;

  @ApiPropertyOptional({ enum: StaffRole, isArray: true })
  @IsArray()
  @IsEnum(StaffRole, { each: true })
  @IsOptional()
  backupAccepterRoles?: StaffRole[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  hideUnavailableItems?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  allowMultipleGuestSessions?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requireOtpPerGuest?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  allowSplitBill?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  allowGuestCheckoutWithoutAccount?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  autoCloseIdleSessionMins?: number | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  taxPercent?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  serviceChargePct?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  tipEnabled?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  reservationsEnabled?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  waitlistEnabled?: boolean;
}

export class BranchSettingsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  branchId: string;

  @ApiProperty({ enum: OrderAcceptanceMode })
  orderAcceptanceMode: OrderAcceptanceMode;

  @ApiProperty({ enum: StaffRole, isArray: true })
  backupAccepterRoles: StaffRole[];

  @ApiProperty()
  hideUnavailableItems: boolean;

  @ApiProperty()
  allowMultipleGuestSessions: boolean;

  @ApiProperty()
  requireOtpPerGuest: boolean;

  @ApiProperty()
  allowSplitBill: boolean;

  @ApiProperty()
  allowGuestCheckoutWithoutAccount: boolean;

  @ApiPropertyOptional()
  autoCloseIdleSessionMins?: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  taxPercent: number;

  @ApiProperty()
  serviceChargePct: number;

  @ApiProperty()
  tipEnabled: boolean;

  @ApiProperty()
  reservationsEnabled: boolean;

  @ApiProperty()
  waitlistEnabled: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
