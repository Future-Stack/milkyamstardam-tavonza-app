import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateQrSettingsDto {
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
}

export class QrCodeResponseDto {
  @ApiProperty()
  tableId: string;

  @ApiProperty()
  branchId: string;

  @ApiProperty()
  qrCodeToken: string;

  @ApiProperty()
  qrCodeUrl: string;
}
