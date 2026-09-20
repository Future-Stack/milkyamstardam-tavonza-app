import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Golden Corral Corp', description: 'Name of the organization' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({
    example: '68ad69a250ceb2da150c3127',
    description:
      'User ID of the organization owner. Required when created by SUPER_ADMIN; omitted when created by ADMIN for himself.',
  })
  @IsOptional()
  @IsMongoId()
  ownerId?: string;

  @ApiPropertyOptional({
    example: 'golden-corral-corp',
    description: 'Unique slug for the organization. If omitted, auto-generated from name.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' })
  slug?: string;
}

