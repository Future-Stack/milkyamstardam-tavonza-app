import { ConfigService } from '@/config/config.service';
import { OrderService } from '@/modules/order/order.service';
import { PaymentService } from '@/modules/payment/payment.service';
import { SessionService } from '@/modules/session/session.service';
import { TableService } from '@/modules/table/table.service';
import { RestaurantService } from '@/modules/restaurant/restaurant.service';
import { BranchService } from '@/modules/branch/branch.service';
import { BranchSettingsService } from '@/modules/branch-settings/branch-settings.service';
import { MenuService } from '@/modules/menu/menu.service';
import { StaffService } from '@/modules/staff/staff.service';
import { OrganizationService } from '@/modules/organization/organization.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogService } from './audit-log.service';
import { PrismaService } from '@/helper/prisma.service';

describe('AuditLogService', () => {
  let service: AuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        { provide: PrismaService, useValue: {} }
      , 
        { provide: PrismaService, useValue: {} },
        { provide: AuditLogService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: OrderService, useValue: {} },
        { provide: PaymentService, useValue: {} },
        { provide: SessionService, useValue: {} },
        { provide: TableService, useValue: {} },
        { provide: RestaurantService, useValue: {} },
        { provide: BranchService, useValue: {} },
        { provide: BranchSettingsService, useValue: {} },
        { provide: MenuService, useValue: {} },
        { provide: StaffService, useValue: {} },
        { provide: OrganizationService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
