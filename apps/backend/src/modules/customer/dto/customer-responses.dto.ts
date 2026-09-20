import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from './create-customer.dto';

export class CustomerProfileResponseDto {
  @ApiProperty({ example: '60d5ecb74d6bb8996032cb0a' })
  id: string;

  @ApiProperty({ example: 'customer@example.com' })
  email: string;

  @ApiProperty({ example: 'Jane Customer' })
  fullName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  phone?: string;

  @ApiProperty({ example: 'CUSTOMER' })
  globalRole: string;

  @ApiProperty({ type: CustomerDto, required: false })
  customer?: CustomerDto;
}
