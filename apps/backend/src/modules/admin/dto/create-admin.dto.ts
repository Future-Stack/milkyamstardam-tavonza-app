import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Payload the SUPER_ADMIN sends to create a platform admin.
 *
 * Note: `role` is intentionally absent — this endpoint always produces an
 * ADMIN, so it cannot be used to escalate someone to SUPER_ADMIN.
 */
export class CreateAdminDto {
  @ApiProperty({ example: 'Rose Ahmed', description: "Admin's full name" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'rose@mailinator.com', description: 'Login email (must be unique)' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'admin123456',
    description: 'Login password (min 6 chars). Falls back to DEFAULT_ADMIN_PASSWORD if omitted.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: '+8801700000001', description: 'Contact number', required: false })
  @IsOptional()
  @IsString()
  contactNo?: string;

  @ApiProperty({ example: 'https://cdn.example.com/rose.png', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    example: 'Rose Ahmed',
    description:
      "Name for the organization auto-created for this admin. Defaults to the admin's own name.",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  organizationName?: string;
}
