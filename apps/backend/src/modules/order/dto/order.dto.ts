import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderChannel, OrderItemStatus, OrderRejectionReason, OrderStatus, PaymentStatus, StationType } from '@prisma/client';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productNameSnapshot: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ enum: StationType })
  @IsEnum(StationType)
  stationType: StationType;
}

export class CreateOrderDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  tableId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  tableSessionId?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  guestSessionId?: string;

  @ApiPropertyOptional({ enum: OrderChannel })
  @IsEnum(OrderChannel)
  @IsOptional()
  channel?: OrderChannel;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  serviceCharge?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  tipAmount?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiPropertyOptional({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsOptional()
  items?: CreateOrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({ enum: OrderRejectionReason })
  @IsEnum(OrderRejectionReason)
  @IsOptional()
  rejectionReasonCode?: OrderRejectionReason;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class UpdateOrderItemStatusDto {
  @ApiProperty({ enum: OrderItemStatus })
  @IsEnum(OrderItemStatus)
  status: OrderItemStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unavailableReason?: string;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  branchId: string;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  totalAmount: number;
}

export class OrderItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty({ enum: OrderItemStatus })
  status: OrderItemStatus;
}
