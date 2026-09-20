import { Module } from '@nestjs/common';
import { DisplayController } from './display.controller';
import { DisplayService } from './display.service';
import { OrderModule } from '../order/order.module';
import { OrderService } from '../order/order.service';

@Module({
  controllers: [DisplayController],
  providers: [DisplayService, OrderService]
})
export class DisplayModule {}
