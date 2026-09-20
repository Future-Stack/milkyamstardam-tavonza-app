import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailChangeDto {
  @ApiProperty({
    description: 'The confirmation token sent to the new email address',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
