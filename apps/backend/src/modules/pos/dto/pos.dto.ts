import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { PaymentMethod, PaymentScope } from '@prisma/client';

export class PosSettleDto {
  @ApiProperty()
  @IsMongoId()
  orderId: string;

  @ApiProperty({ enum: PaymentScope })
  @IsEnum(PaymentScope)
  scope: PaymentScope;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  tipAmount?: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}

export class PosShiftSummaryDto {
  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  activeOrdersCount: number;
}
