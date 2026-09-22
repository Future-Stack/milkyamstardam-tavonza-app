import { AppEvents } from '@/events/app-events.service';
import { CronJobService } from '@/helper/cron_jobs';
import { FileService } from '@/helper/file.service';
import { PrismaModule } from '@/helper/prisma.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { AnalyticsModule } from '@/modules/analytics/analytics.module';
import { GuestModule } from '@/modules/guest/guest.module';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { AuthModule } from '@/modules/auth/auth.module';
import { CustomerModule } from '@/modules/customer/customer.module';
import { RolesGuard } from '@/modules/roles/roles.guard';
import { UserModule } from '@/modules/user/user.module';
import { UserService } from '@/modules/user/user.service';
import { AuditLogModule } from '@/modules/audit-log/audit-log.module';
import { PermissionsGuard } from '@/modules/permissions/permissions.guard';
import { OrganizationModule } from '@/modules/organization/organization.module';
import { RestaurantModule } from '@/modules/restaurant/restaurant.module';
import { BranchModule } from '@/modules/branch/branch.module';
import { MenuModule } from '@/modules/menu/menu.module';
import { StaffModule } from '@/modules/staff/staff.module';
import { BranchSettingsModule } from '@/modules/branch-settings/branch-settings.module';
import { TableModule } from '@/modules/table/table.module';
import { SessionModule } from '@/modules/session/session.module';
import { OrderModule } from '@/modules/order/order.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { PosModule } from '@/modules/pos/pos.module';
import { QrConfigModule } from '@/modules/qr-config/qr-config.module';
import { DisplayModule } from '@/modules/display/display.module';
import { DashboardModule } from '@/modules/dashboard/dashboard.module';
import { BcryptService } from '@/utils/bcrypt.service';
import { GlobalExceptionFilter } from '@/utils/global_exception';
import { PrismaHelperService } from '@/utils/is_existance';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { ConfigService } from '@/config/config.service';
import { ConfigModule } from '@/config/config.module';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule.forRoot(),
    ConfigModule,
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 1000, limit: 100 },
        { name: 'medium', ttl: 10000, limit: 1000 },
        { name: 'long', ttl: 600000, limit: 1000 },
      ],
    }),
    AuthModule,
    UserModule,
    AdminModule,
    AnalyticsModule,
    GuestModule,
    CustomerModule,
    ConfigModule,
    AuditLogModule,
    OrganizationModule,
    RestaurantModule,
    BranchModule,
    MenuModule,
    StaffModule,
    BranchSettingsModule,
    TableModule,
    SessionModule,
    OrderModule,
    PaymentModule,
    PosModule,
    QrConfigModule,
    DisplayModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    UserService,
    BcryptService,
    FileService,
    PrismaHelperService,
    CronJobService,
    AppEvents,
    ConfigService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
