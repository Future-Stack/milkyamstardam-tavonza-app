import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderChannel, OrderItemStatus, OrderRejectionReason, OrderStatus } from '@prisma/client';

/**
 * One line of an order.
 *
 * Prices are deliberately NOT accepted here. Unit price, line subtotal, the
 * product-name snapshot and the station are all derived from `productId` on the
 * server — otherwise a customer could post `unitPrice: 0`.
 */
export class CreateOrderItemDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    type: [String],
    description: 'Ids of the Modifier rows the guest selected for this line',
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  modifierIds?: string[];
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

  @ApiPropertyOptional({ description: 'Promo code; validated and priced server-side' })
  @IsString()
  @IsOptional()
  discountCode?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tipAmount?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
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
