import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationResponseDto } from '../../organization/dto/organization-responses.dto';

export class RestaurantResponseDto {
  @ApiProperty({ example: '68ad69a250ceb2da150c3127' })
  id: string;

  @ApiProperty({ example: '68ad69a250ceb2da150c3128' })
  organizationId: string;

  @ApiProperty({ example: 'Golden Corral Buffet' })
  name: string;

  @ApiProperty({ example: 'golden-corral' })
  slug: string;

  @ApiPropertyOptional()
  logoUrl?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => OrganizationResponseDto })
  organization?: OrganizationResponseDto;
}
