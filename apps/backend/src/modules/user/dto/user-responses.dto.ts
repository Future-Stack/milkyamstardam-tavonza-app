import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '60d5ecb74d6bb8996032cb0a' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '+1234567890', required: false })
  contactNo?: string;

  @ApiProperty({ enum: ['SUPER_ADMIN', 'ADMIN', 'RESTAURANT_OWNER', 'STAFF', 'CUSTOMER'] })
  role: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  avatar?: string;

  @ApiProperty({ example: '2026-08-26T10:15:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-08-26T10:15:00.000Z' })
  updatedAt: Date;
}
