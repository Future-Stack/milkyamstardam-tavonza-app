import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '@/helper/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PaymentStatus, PaymentScope, PaymentMethod } from '@prisma/client';
import { ApiError } from '@/utils/api_error';

describe('PaymentService', () => {
  let service: PaymentService;
  let prisma: PrismaService;

  const mockPrisma = {
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(cb => cb(mockPrisma)),
  };

  const mockAuditLog = {
    handleAuditLogEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogService, useValue: mockAuditLog },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should throw an error if sum of allocations does not match total amount', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order1', branchId: 'branch1' });
      
      const dto: any = {
        orderId: 'order1',
        scope: PaymentScope.ORDER,
        amount: 100,
        method: PaymentMethod.CASH,
        allocations: [
          { orderId: 'order1', amount: 50 } // Total is 50, but amount is 100
        ]
      };

      await expect(service.createPayment(dto, 'actor1')).rejects.toThrow(ApiError);
    });

    it('should create payment if allocations match', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order1', branchId: 'branch1', payments: [] });
      mockPrisma.payment.create.mockResolvedValue({ id: 'payment1' });
      
      const dto: any = {
        orderId: 'order1',
        scope: PaymentScope.ORDER,
        amount: 100,
        method: PaymentMethod.CASH,
        allocations: [
          { orderId: 'order1', amount: 100 }
        ]
      };

      const result = await service.createPayment(dto, 'actor1');
      expect(result.id).toEqual('payment1');
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });
});
