import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerDto } from './create-customer.dto';

export class UpdateCustomerProfileDto extends PartialType(CustomerDto) {}

export class UpdateCustomerDto {
  @ApiProperty({ example: 'rose@mailinator.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'jekono name', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '+1 (938) 424-3571', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ type: UpdateCustomerProfileDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCustomerProfileDto)
  customer?: UpdateCustomerProfileDto;
}
