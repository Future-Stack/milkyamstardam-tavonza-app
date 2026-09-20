import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreatePaymentDto, RefundPaymentDto } from './dto/payment.dto';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import {
  paymentFilterFields,
  paymentSearchFields,
  paymentNestedFilters,
  paymentRangeFilter,
  paymentInclude,
} from './payment.constant';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async createPayment(data: CreatePaymentDto, actorId: string) {
    const totalAllocated = data.allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
    if (Math.abs(totalAllocated - data.amount) > 0.01) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Sum of allocations must equal payment amount');
    }

    const payment = await this.prisma.$transaction(async (prisma) => {
      const created = await prisma.payment.create({
        data: {
          orderId: data.orderId,
          tableSessionId: data.tableSessionId,
          payerGuestSessionId: data.payerGuestSessionId,
          paidForGuestIds: data.paidForGuestIds || [],
          scope: data.scope,
          amount: data.amount,
          tipAmount: data.tipAmount || 0,
          method: data.method,
          status: PaymentStatus.PAID,
          transactionRef: data.transactionRef,
          paidAt: new Date(),
          settledById: actorId, // assuming cashier
          allocations: {
            create: data.allocations.map(a => ({
              orderId: a.orderId,
              orderItemId: a.orderItemId,
              amount: a.amount,
            }))
          }
        },
        include: { allocations: true }
      });

      if (data.orderId) {
        // Find if fully paid
        const order = await prisma.order.findUnique({ where: { id: data.orderId }, include: { payments: true } });
        if (order) {
          const totalPaid = order.payments.filter(p => p.status === PaymentStatus.PAID).reduce((sum, p) => sum + p.amount, 0);
          await prisma.order.update({
            where: { id: order.id },
            data: {
              amountPaid: totalPaid,
              paymentStatus: totalPaid >= order.totalAmount ? PaymentStatus.PAID : PaymentStatus.PARTIALLY_PAID
            }
          });
        }
      }

      return created;
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: undefined, // Would need branch resolution logic
      action: 'PAYMENT_CREATED',
      entityType: 'Payment',
      entityId: payment.id,
      metadata: { amount: payment.amount, method: payment.method },
    });

    return payment;
  }

  async findAllPayments(query: Record<string, any>): Promise<IGenericResponse<Payment[]>> {
    const queryBuilder = new QueryBuilder<Payment>(query, this.prisma.payment);
    const result = (await queryBuilder
      .filter(paymentFilterFields as string[])
      .search(paymentSearchFields as string[])
      .nestedFilter(paymentNestedFilters)
      .sort()
      .paginate()
      .include(paymentInclude)
      .fields()
      .filterByRange(paymentRangeFilter)
      .execute()) as Payment[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async findOnePayment(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { allocations: true },
    });
    if (!payment) throw new ApiError(HttpStatus.NOT_FOUND, 'Payment not found');
    return payment;
  }

  async refundPayment(id: string, dto: RefundPaymentDto, actorId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new ApiError(HttpStatus.NOT_FOUND, 'Payment not found');
    if (payment.status !== PaymentStatus.PAID && payment.status !== PaymentStatus.PARTIALLY_PAID) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Can only refund paid payments');
    }

    const refundAmt = dto.refundAmount || payment.amount;

    const updated = await this.prisma.$transaction(async (prisma) => {
      const refunded = await prisma.payment.update({
        where: { id },
        data: {
          status: PaymentStatus.REFUNDED,
          refundAmount: refundAmt,
          refundRef: dto.refundRef,
          refundedAt: new Date(),
        }
      });

      if (payment.orderId) {
        const order = await prisma.order.findUnique({ where: { id: payment.orderId }, include: { payments: true } });
        if (order) {
          const totalPaid = order.payments.filter(p => p.status === PaymentStatus.PAID).reduce((sum, p) => sum + p.amount, 0);
          await prisma.order.update({
            where: { id: order.id },
            data: {
              amountPaid: totalPaid,
              paymentStatus: totalPaid === 0 ? PaymentStatus.UNPAID : PaymentStatus.PARTIALLY_PAID
            }
          });
        }
      }
      return refunded;
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: undefined, // Needs context
      action: 'PAYMENT_REFUNDED',
      entityType: 'Payment',
      entityId: id,
      metadata: { refundAmount: refundAmt },
    });

    return updated;
  }
}
