import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({
    description: 'The new email address for the user',
    example: 'new.email@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  newEmail: string;
}
