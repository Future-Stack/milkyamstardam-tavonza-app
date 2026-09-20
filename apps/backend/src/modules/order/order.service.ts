import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateOrderDto, UpdateOrderItemStatusDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Order, OrderAcceptanceMode, OrderItemStatus, OrderRejectionReason, OrderStatus, Prisma } from '@prisma/client';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import {
  orderFilterFields,
  orderSearchFields,
  orderNestedFilters,
  orderRangeFilter,
  orderInclude,
} from './order.constant';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async createOrder(branchId: string, data: CreateOrderDto, actorId?: string) {
    const branchSettings = await this.prisma.branchSetting.findUnique({ where: { branchId } });
    if (!branchSettings) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch settings not found');

    const acceptanceMode = branchSettings.orderAcceptanceMode;
    const initialStatus = acceptanceMode === OrderAcceptanceMode.AUTO_ACCEPT ? OrderStatus.CONFIRMED : OrderStatus.PENDING;

    // Generate order number (e.g. branchId short + date + sequence)
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = await this.prisma.order.count({ where: { branchId, createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } });
    const sequence = (count + 1).toString().padStart(4, '0');
    const orderNumber = `${branchId.slice(-4).toUpperCase()}-${dateStr}-${sequence}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        branchId,
        tableId: data.tableId,
        customerId: data.customerId,
        tableSessionId: data.tableSessionId,
        guestSessionId: data.guestSessionId,
        channel: data.channel || 'DINE_IN',
        status: initialStatus,
        subtotal: data.subtotal,
        discountAmount: data.discountAmount || 0,
        taxAmount: data.taxAmount || 0,
        serviceCharge: data.serviceCharge || 0,
        tipAmount: data.tipAmount || 0,
        totalAmount: data.totalAmount,
        specialInstructions: data.specialInstructions,
        acceptanceMode,
        placedByStaffId: actorId,
        orderItems: {
          create: (data.items || []).map(item => ({
            productId: item.productId,
            productNameSnapshot: item.productNameSnapshot,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
            stationType: item.stationType,
            status: initialStatus === OrderStatus.CONFIRMED ? OrderItemStatus.PREPARING : OrderItemStatus.PENDING,
          }))
        }
      },
      include: { orderItems: true }
    });

    if (actorId) {
      this.auditLog.handleAuditLogEvent({
        actorId,
        branchId,
        action: 'ORDER_CREATED',
        entityType: 'Order',
        entityId: order.id,
        metadata: { orderNumber, status: initialStatus },
      });
    }

    return order;
  }

  async findAllOrders(branchId: string, query: Record<string, any> = {}): Promise<IGenericResponse<Order[]>> {
    const queryBuilder = new QueryBuilder<Order>(query, this.prisma.order);
    const result = (await queryBuilder
      .filter(orderFilterFields as string[])
      .search(orderSearchFields as string[])
      .nestedFilter(orderNestedFilters)
      .sort()
      .paginate()
      .include(orderInclude)
      .fields()
      .filterByRange(orderRangeFilter)
      .rawFilter({ branchId })
      .execute()) as Order[];

    const meta = await queryBuilder.countTotal();

    return {
      meta,
      data: result,
    };
  }

  async findOneOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Order not found');
    return order;
  }

  async acceptOrder(id: string, actorId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Order not found');
    if (order.status !== OrderStatus.PENDING) {
      throw new ApiError(HttpStatus.BAD_REQUEST, `Cannot accept order in ${order.status} status`);
    }

    const updated = await this.prisma.$transaction(async (prisma) => {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status: OrderStatus.CONFIRMED,
          acceptedById: actorId,
          acceptedAt: new Date(),
        }
      });
      
      await prisma.orderItem.updateMany({
        where: { orderId: id },
        data: { status: OrderItemStatus.PREPARING }
      });

      return updatedOrder;
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: order.branchId,
      action: 'ORDER_ACCEPTED',
      entityType: 'Order',
      entityId: order.id,
    });

    return updated;
  }

  async rejectOrder(id: string, reasonCode: OrderRejectionReason, reason: string | undefined, actorId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Order not found');
    if (order.status !== OrderStatus.PENDING) {
      throw new ApiError(HttpStatus.BAD_REQUEST, `Cannot reject order in ${order.status} status`);
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.REJECTED,
        rejectedById: actorId,
        rejectedAt: new Date(),
        rejectionReasonCode: reasonCode,
        rejectionReason: reason,
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: order.branchId,
      action: 'ORDER_REJECTED',
      entityType: 'Order',
      entityId: order.id,
      metadata: { reasonCode },
    });

    return updated;
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto, actorId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Order not found');

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
      }
    });

    await this.prisma.orderStatusChangeLog.create({
      data: {
        orderId: id,
        previousStatus: order.status,
        newStatus: dto.status,
        changedById: actorId,
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: order.branchId,
      action: 'ORDER_STATUS_UPDATED',
      entityType: 'Order',
      entityId: order.id,
      metadata: { oldStatus: order.status, newStatus: dto.status },
    });

    return updated;
  }

  async cancelOrder(id: string, actorId: string) {
    return this.updateOrderStatus(id, { status: OrderStatus.CANCELLED } as any, actorId);
  }

  async updateOrderItemStatus(itemId: string, dto: UpdateOrderItemStatusDto, actorId: string) {
    const item = await this.prisma.orderItem.findUnique({ where: { id: itemId }, include: { order: true } });
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Order item not found');

    const updated = await this.prisma.orderItem.update({
      where: { id: itemId },
      data: {
        status: dto.status,
        unavailableReason: dto.unavailableReason,
        ...(dto.status === OrderItemStatus.PREPARING && { preparingAt: new Date() }),
        ...(dto.status === OrderItemStatus.READY && { readyAt: new Date() }),
        ...(dto.status === OrderItemStatus.SERVED && { servedAt: new Date() }),
      }
    });

    await this.prisma.orderItemStatusChangeLog.create({
      data: {
        orderItemId: itemId,
        previousStatus: item.status,
        newStatus: dto.status,
        changedById: actorId,
      }
    });

    this.auditLog.handleAuditLogEvent({
      actorId,
      branchId: item.order.branchId,
      action: 'ORDER_ITEM_STATUS_UPDATED',
      entityType: 'OrderItem',
      entityId: itemId,
      metadata: { oldStatus: item.status, newStatus: dto.status },
    });

    return updated;
  }

  async getOrderStatusLog(id: string) {
    return this.prisma.orderStatusChangeLog.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'desc' }
    });
  }
}
