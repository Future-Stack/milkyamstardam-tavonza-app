import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { GlobalRole, PermissionAction, StaffRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contactNo?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: GlobalRole, default: GlobalRole.STAFF })
  @IsEnum(GlobalRole)
  @IsOptional()
  role?: GlobalRole;
}

export class StaffUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  contactNo?: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: GlobalRole })
  role: GlobalRole;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;
}

export class CreateStaffAssignmentDto {
  @ApiProperty()
  @IsMongoId()
  userId: string; // The user ID to assign

  @ApiProperty({ enum: StaffRole })
  @IsEnum(StaffRole)
  role: StaffRole;

  @ApiPropertyOptional({ enum: PermissionAction, isArray: true })
  @IsArray()
  @IsEnum(PermissionAction, { each: true })
  @IsOptional()
  permissions?: PermissionAction[];
}

export class UpdateStaffAssignmentDto {
  @ApiPropertyOptional({ enum: StaffRole })
  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole;

  @ApiPropertyOptional({ enum: PermissionAction, isArray: true })
  @IsArray()
  @IsEnum(PermissionAction, { each: true })
  @IsOptional()
  permissions?: PermissionAction[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class StaffAssignmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  staffId: string;

  @ApiProperty()
  branchId: string;

  @ApiProperty({ enum: StaffRole })
  role: StaffRole;

  @ApiProperty({ enum: PermissionAction, isArray: true })
  permissions: PermissionAction[];

  @ApiProperty()
  isActive: boolean;
}
