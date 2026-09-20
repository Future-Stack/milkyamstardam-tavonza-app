import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ example: '68ad69a250ceb2da150c3127' })
  id: string;

  @ApiProperty({ example: 'Golden Corral Corp' })
  name: string;

  @ApiProperty({ example: 'golden-corral-corp' })
  slug: string;

  @ApiProperty({ example: '68ad69a250ceb2da150c3127' })
  ownerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

