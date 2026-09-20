import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { OrderService } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';
import { PosSettleDto } from './dto/pos.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { ApiError } from '@/utils/api_error';

@Injectable()
export class PosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  async getActiveOrders(branchId: string) {
    return this.prisma.order.findMany({
      where: {
        branchId,
        status: { in: [OrderStatus.SERVED, OrderStatus.READY] },
        paymentStatus: { in: [PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID] }
      },
      include: {
        orderItems: true,
        table: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async settleOrder(data: PosSettleDto, actorId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: { orderItems: true }
    });

    if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Order not found');

    const paymentDto = {
      orderId: data.orderId,
      scope: data.scope,
      amount: data.amount,
      tipAmount: data.tipAmount,
      method: data.method,
      allocations: order.orderItems.map(item => ({
        orderId: order.id,
        orderItemId: item.id,
        amount: item.subtotal
      }))
    };

    const payment = await this.paymentService.createPayment(paymentDto, actorId);

    // If fully paid, mark order as completed if it was served
    const updatedOrder = await this.prisma.order.findUnique({ where: { id: order.id } });
    if (updatedOrder && updatedOrder.paymentStatus === PaymentStatus.PAID && updatedOrder.status === OrderStatus.SERVED) {
      await this.orderService.updateOrderStatus(order.id, { status: OrderStatus.COMPLETED }, actorId);
    }

    return payment;
  }

  async getShiftSummary(branchId: string, actorId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const payments = await this.prisma.payment.aggregate({
      where: {
        order: { branchId },
        status: PaymentStatus.PAID,
        paidAt: { gte: startOfDay },
        settledById: actorId
      },
      _sum: { amount: true }
    });

    const totalOrders = await this.prisma.order.count({
      where: {
        branchId,
        createdAt: { gte: startOfDay },
        placedByStaffId: actorId
      }
    });

    const activeOrdersCount = await this.prisma.order.count({
      where: {
        branchId,
        status: { in: [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.SERVED] },
        paymentStatus: { in: [PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID] }
      }
    });

    return {
      totalRevenue: payments._sum.amount || 0,
      totalOrders,
      activeOrdersCount
    };
  }
}
