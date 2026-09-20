import { FileService } from '@/helper/file.service';
import { BcryptService } from '@/utils/bcrypt.service';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SuperAdminInitService } from './super-admin.init.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, FileService, BcryptService, SuperAdminInitService],
  exports: [AdminService],
})
export class AdminModule {}
