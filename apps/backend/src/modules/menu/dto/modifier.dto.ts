import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateModifierDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  priceDelta: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;


}

export class UpdateModifierDto extends PartialType(CreateModifierDto) {}

export class CreateModifierGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  minSelect: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  maxSelect: number;


}

export class UpdateModifierGroupDto extends PartialType(CreateModifierGroupDto) {}
