import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { GuestSessionStatus, TableSessionStatus } from '@prisma/client';

export class CreateTableSessionDto {
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  partySize?: number;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  reservationId?: string;
}

export class UpdateTableSessionDto {
  @ApiPropertyOptional({ enum: TableSessionStatus })
  @IsEnum(TableSessionStatus)
  @IsOptional()
  status?: TableSessionStatus;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  partySize?: number;
}

export class JoinTableSessionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  customerId?: string;
}

export class UpdateGuestSessionDto {
  @ApiPropertyOptional({ enum: GuestSessionStatus })
  @IsEnum(GuestSessionStatus)
  @IsOptional()
  status?: GuestSessionStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  displayName?: string;
}

export class TableSessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tableId: string;

  @ApiProperty()
  branchId: string;

  @ApiPropertyOptional()
  joinCode?: string;

  @ApiPropertyOptional()
  partySize?: number;

  @ApiProperty()
  startedAt: Date;

  @ApiPropertyOptional()
  endedAt?: Date;

  @ApiProperty({ enum: TableSessionStatus })
  status: TableSessionStatus;
}

export class GuestSessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tableSessionId: string;

  @ApiPropertyOptional()
  customerId?: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiPropertyOptional()
  contact?: string;

  @ApiProperty()
  isHostGuest: boolean;

  @ApiProperty()
  joinedAt: Date;

  @ApiPropertyOptional()
  leftAt?: Date;

  @ApiProperty({ enum: GuestSessionStatus })
  status: GuestSessionStatus;
}
