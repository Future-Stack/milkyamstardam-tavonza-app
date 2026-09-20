import { BcryptService } from '@/utils/bcrypt.service';
import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AdminModule],
  controllers: [UsersController],
  providers: [UserService, BcryptService],
  exports: [UserService],
})
export class UserModule {}
