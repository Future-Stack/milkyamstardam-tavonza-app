import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsObject, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'NY', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '10001', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  country: string;
}

export class CustomerDto {
  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  loyaltyPoints?: number;

  @ApiProperty({ type: AddressDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  defaultAddress?: AddressDto;

  @ApiProperty({ example: { dietaryRequirements: 'vegan' }, required: false })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;
}
