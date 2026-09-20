import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderItemStatus, StationType } from '@prisma/client';

export class UpdateDisplayItemStatusDto {
  @ApiProperty({ enum: OrderItemStatus })
  @IsEnum(OrderItemStatus)
  status: OrderItemStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unavailableReason?: string;
}

export class DisplayItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  productNameSnapshot: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ enum: StationType })
  stationType: StationType;

  @ApiProperty({ enum: OrderItemStatus })
  status: OrderItemStatus;
}
