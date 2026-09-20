import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

export class CreateReservationDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  tableId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  guestPhone: string;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  partySize: number;

  @ApiProperty()
  @IsDateString()
  reservedFor: string;

  @ApiPropertyOptional({ default: 90 })
  @IsInt()
  @Min(1)
  @IsOptional()
  durationMins?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specialRequest?: string;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiPropertyOptional({ enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;
}

export class ReservationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  branchId: string;

  @ApiPropertyOptional()
  tableId?: string;

  @ApiPropertyOptional()
  customerId?: string;

  @ApiPropertyOptional()
  tableSessionId?: string;

  @ApiProperty()
  guestName: string;

  @ApiProperty()
  guestPhone: string;

  @ApiProperty()
  partySize: number;

  @ApiProperty()
  reservedFor: Date;

  @ApiProperty()
  durationMins: number;

  @ApiProperty({ enum: ReservationStatus })
  status: ReservationStatus;

  @ApiPropertyOptional()
  specialRequest?: string;
}
