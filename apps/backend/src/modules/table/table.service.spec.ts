import { PrismaService } from '@/helper/prisma.service';
import { AuditLogService } from '@/modules/audit-log/audit-log.service';
import { ConfigService } from '@/config/config.service';
import { OrderService } from '@/modules/order/order.service';
import { PaymentService } from '@/modules/payment/payment.service';
import { SessionService } from '@/modules/session/session.service';
import { RestaurantService } from '@/modules/restaurant/restaurant.service';
import { BranchService } from '@/modules/branch/branch.service';
import { BranchSettingsService } from '@/modules/branch-settings/branch-settings.service';
import { MenuService } from '@/modules/menu/menu.service';
import { StaffService } from '@/modules/staff/staff.service';
import { OrganizationService } from '@/modules/organization/organization.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './table.service';

describe('TableService', () => {
  let service: TableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableService, 
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

    service = module.get<TableService>(TableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
