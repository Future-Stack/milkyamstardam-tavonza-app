import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '@/helper/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { OrderStatus, PaymentStatus, OrderAcceptanceMode } from '@prisma/client';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService;
  let auditLog: AuditLogService;

  const mockPrisma = {
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    branchSetting: {
      findUnique: jest.fn(),
    },
    orderItem: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    orderStatusChangeLog: {
      create: jest.fn(),
    },
    orderItemStatusChangeLog: {
      create: jest.fn(),
    },
  };

  const mockAuditLog = {
    handleAuditLogEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogService, useValue: mockAuditLog },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);
    auditLog = module.get<AuditLogService>(AuditLogService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      mockPrisma.branchSetting.findUnique.mockResolvedValue({ orderAcceptanceMode: OrderAcceptanceMode.WAITER_APPROVAL });
      mockPrisma.order.count.mockResolvedValue(0);
      mockPrisma.order.create.mockResolvedValue({ id: 'order1', branchId: 'branch1' });

      const dto: any = {
        tableId: 'table1',
        items: [{ productVersionId: 'pv1', quantity: 1, unitPrice: 10 }]
      };

      const result = await service.createOrder('branch1', dto, 'actor1');
      expect(result.id).toEqual('order1');
      expect(mockPrisma.order.create).toHaveBeenCalled();
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status and log to audit', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order1', status: OrderStatus.PENDING, branchId: 'branch1' });
      mockPrisma.order.update.mockResolvedValue({ id: 'order1', status: OrderStatus.CONFIRMED });

      const result = await service.updateOrderStatus('order1', { status: OrderStatus.CONFIRMED }, 'actor1');
      
      expect(result.status).toEqual(OrderStatus.CONFIRMED);
      expect(mockPrisma.orderStatusChangeLog.create).toHaveBeenCalled();
      expect(mockAuditLog.handleAuditLogEvent).toHaveBeenCalled();
    });
  });
});
