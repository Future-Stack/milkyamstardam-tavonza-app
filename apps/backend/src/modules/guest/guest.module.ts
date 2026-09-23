import { Module } from '@nestjs/common';

import { GMailService } from '@/email/gmail';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';

@Module({
  imports: [OrderModule, PaymentModule],
  controllers: [GuestController],
  providers: [GuestService, GMailService],
})
export class GuestModule {}
