import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * The fields a signed-in user may change about themselves.
 *
 * Deliberately narrow: email changes go through the confirmation-email flow
 * (`/auth/change-email-request`) and role/status are never self-serviceable.
 */
export class UpdateMeDto {
  @ApiProperty({ example: 'Super Admin', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiProperty({ example: '+8801700000001', required: false })
  @IsOptional()
  @IsString()
  contactNo?: string;
}
