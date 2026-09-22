import { FileService } from '@/helper/file.service';
import { BcryptService } from '@/utils/bcrypt.service';
import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AdminModule],
  controllers: [UsersController],
  providers: [UserService, BcryptService, FileService],
  exports: [UserService],
})
export class UserModule {}
