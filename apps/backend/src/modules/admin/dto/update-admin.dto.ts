import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({ example: 'rose@mailinator.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Rose Ahmed', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @ApiProperty({ example: '+8801700000001', required: false })
  @IsOptional()
  @IsString()
  contactNo?: string;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    example: 'Platform admin responsible for restaurant onboarding and compliance.',
    required: false,
  })
  @IsOptional()
  @IsString()
  intro?: string;
}

