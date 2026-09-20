import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { FileService } from '@/helper/file.service';

@Module({
  imports: [RestaurantModule],
  controllers: [OrganizationController],
  providers: [OrganizationService, FileService],
})
export class OrganizationModule {}

