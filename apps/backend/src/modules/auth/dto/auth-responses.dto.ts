import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;
}

export class SimpleMessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}

export class UserProfileResponseDto {
  @ApiProperty({ example: '60d5ecb74d6bb8996032cb0a' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'CUSTOMER' })
  globalRole: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;
}
