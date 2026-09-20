import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PaymentScope, PaymentStatus } from '@prisma/client';

export class PaymentAllocationDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  orderItemId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreatePaymentDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  tableSessionId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  payerGuestSessionId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  paidForGuestIds?: string[];

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  transactionRef?: string;

  @ApiProperty({ type: [PaymentAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentAllocationDto)
  allocations: PaymentAllocationDto[];
}

export class RefundPaymentDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  refundAmount?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  refundRef?: string;
}

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;
}
