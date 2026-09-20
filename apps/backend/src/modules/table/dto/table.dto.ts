import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Shape, TableOperationalFlag, TableServiceStatus } from '@prisma/client';

export class CreateTableDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label: string;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ enum: Shape, default: Shape.SQUARE })
  @IsEnum(Shape)
  @IsOptional()
  shape?: Shape;

  @ApiPropertyOptional({ default: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  floor?: number;
}

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @ApiPropertyOptional({ enum: TableServiceStatus })
  @IsEnum(TableServiceStatus)
  @IsOptional()
  serviceStatus?: TableServiceStatus;

  @ApiPropertyOptional({ enum: TableOperationalFlag })
  @IsEnum(TableOperationalFlag)
  @IsOptional()
  operationalFlag?: TableOperationalFlag;
}

export class TableResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  branchId: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  capacity: number;

  @ApiProperty({ enum: TableServiceStatus })
  serviceStatus: TableServiceStatus;

  @ApiProperty({ enum: TableOperationalFlag })
  operationalFlag: TableOperationalFlag;

  @ApiPropertyOptional()
  qrCodeToken?: string;

  @ApiProperty({ enum: Shape })
  shape: Shape;

  @ApiProperty()
  floor: number;
}
