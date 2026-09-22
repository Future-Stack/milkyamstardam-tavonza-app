import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod, PaymentScope } from '@prisma/client';

/** Email address or phone number the guest wants their OTP sent to. */
export class SendTableOtpDto {
  @ApiProperty({ example: 'guest@example.com', description: 'Email address or phone number' })
  @IsString()
  @IsNotEmpty()
  contact: string;
}

export class VerifyTableOtpDto {
  @ApiProperty({ example: 'guest@example.com' })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  otp: string;
}

/**
 * One line of a guest order.
 *
 * No prices: the server derives unit price, subtotal and station from
 * `productId` and the selected modifiers. See `OrderService.priceOrder`.
 */
export class GuestOrderItemDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ minimum: 1, example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ type: [String], description: 'Selected Modifier ids' })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  modifierIds?: string[];
}

export class CreateGuestOrderDto {
  @ApiProperty({ type: [GuestOrderItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GuestOrderItemDto)
  items: GuestOrderItemDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tipAmount?: number;

  @ApiPropertyOptional({ example: 'WELCOME10' })
  @IsString()
  @IsOptional()
  discountCode?: string;
}

export class GuestReviewDto {
  @ApiProperty({ minimum: 1, maximum: 5, example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Great food, quick service.' })
  @IsString()
  @IsOptional()
  comment?: string;
}

/**
 * What the guest intends to settle. The amount is never sent — the server works
 * it out from the unpaid orders the scope resolves to.
 */
export class GuestPaymentDto {
  @ApiProperty({
    enum: [PaymentScope.ORDER_ITEMS, PaymentScope.GUEST_SESSION, PaymentScope.TABLE_SESSION],
    description:
      'ORDER_ITEMS = the listed itemIds · GUEST_SESSION = targetGuestIds (or yourself) · TABLE_SESSION = the whole table',
  })
  // Deliberately not every PaymentScope: a guest sending `ORDER` would otherwise
  // be read as "settle the table", because ORDER only makes sense for a staff
  // settlement against one known order.
  @IsIn([PaymentScope.ORDER_ITEMS, PaymentScope.GUEST_SESSION, PaymentScope.TABLE_SESSION])
  scope: PaymentScope;

  @ApiPropertyOptional({ type: [String], description: 'Guest sessions being paid for' })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  targetGuestIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'OrderItem ids, when scope = ORDER_ITEMS' })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  itemIds?: string[];

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tipAmount?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  transactionRef?: string;
}
