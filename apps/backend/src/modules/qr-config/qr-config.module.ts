import { Module } from '@nestjs/common';
import { QrConfigController } from './qr-config.controller';
import { QrConfigService } from './qr-config.service';
import { ConfigModule } from '@/config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [QrConfigController],
  providers: [QrConfigService]
})
export class QrConfigModule {}
