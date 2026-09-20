import { Module } from '@nestjs/common';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderService } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';

@Module({
  controllers: [PosController],
  providers: [PosService, OrderService, PaymentService],
})
export class PosModule {}
