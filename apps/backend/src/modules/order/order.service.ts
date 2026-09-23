import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateOrderDto, CreateOrderItemDto, UpdateOrderItemStatusDto, UpdateOrderStatusDto } from './dto/order.dto';
import {
  BranchSetting,
  Discount,
  DiscountType,
  Order,
  OrderAcceptanceMode,
  OrderChannel,
  OrderItemStatus,
  OrderRejectionReason,
  OrderStatus,
  Prisma,
  StationType,
} from '@prisma/client';
import QueryBuilder from '@/utils/query_builder';
import { IGenericResponse } from '@/interface/common';
import {
  orderFilterFields,
  orderSearchFields,
  orderNestedFilters,
  orderRangeFilter,
  orderInclude,
} from './order.constant';

/** Rounds to 2dp so repeated float arithmetic doesn't drift into 12.999998. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** A line after the server has decided what it costs. */
interface PricedLine {
  productId: string;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  stationType: StationType;
  modifiers: { id: string; name: string; priceDelta: number }[];
}

/** Who is placing the order — distinguishes a guest self-order from a POS entry. */
export interface OrderActor {
  userId: string;
  isStaff: boolean;
}

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  /**
   * Turns `{ productId, quantity, modifierIds }` lines into fully priced order
   * lines and order-level totals.
   *
   * Every money figure and the station come from the database, never from the
   * caller: the client decides WHAT is being ordered, the server decides what it
   * costs. `whitelist: true` on the global ValidationPipe already strips any
   * price field a caller tries to smuggle in.
   */
  async priceOrder(items: CreateOrderItemDto[], settings: BranchSetting, discountCode?: string) {
    if (!items || items.length === 0) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'An order must contain at least one item');
    }

    const products = await this.prisma.menuItem.findMany({
      where: { id: { in: [...new Set(items.map((item) => item.productId))] } },
      include: { modifierGroups: { include: { modifiers: true } } },
    });
    const byId = new Map(products.map((product) => [product.id, product]));

    const lines: PricedLine[] = items.map((line) => {
      const product = byId.get(line.productId);
      if (!product) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Menu item ${line.productId} does not exist`);
      }
      if (!product.isAvailable) {
        throw new ApiError(HttpStatus.CONFLICT, `"${product.name}" is currently unavailable`);
      }

      // A modifier only counts if it is actually offered on THIS item.
      const offered = new Map(
        product.modifierGroups.flatMap((group) => group.modifiers.map((m) => [m.id, m])),
      );
      const chosen = (line.modifierIds ?? []).map((id) => {
        const modifier = offered.get(id);
        if (!modifier) {
          throw new ApiError(
            HttpStatus.BAD_REQUEST,
            `Option ${id} is not offered on "${product.name}"`,
          );
        }
        if (!modifier.isAvailable) {
          throw new ApiError(HttpStatus.CONFLICT, `Option "${modifier.name}" is unavailable`);
        }
        return modifier;
      });

      const unitPrice = round2(
        product.basePrice + chosen.reduce((sum, modifier) => sum + modifier.priceDelta, 0),
      );

      return {
        productId: product.id,
        productNameSnapshot: product.name,
        unitPrice,
        quantity: line.quantity,
        subtotal: round2(unitPrice * line.quantity),
        stationType: product.stationType,
        modifiers: chosen.map((m) => ({ id: m.id, name: m.name, priceDelta: m.priceDelta })),
      };
    });

    const subtotal = round2(lines.reduce((sum, line) => sum + line.subtotal, 0));

    let discount: Discount | null = null;
    let discountAmount = 0;

    if (discountCode) {
      discount = await this.prisma.discount.findUnique({ where: { code: discountCode } });
      if (!discount || !discount.isActive) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Discount code "${discountCode}" is not valid`);
      }

      const now = new Date();
      if (discount.validFrom && now < discount.validFrom) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Discount code "${discount.code}" is not active yet`);
      }
      if (discount.validUntil && now > discount.validUntil) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Discount code "${discount.code}" has expired`);
      }
      if (discount.usageLimit !== null && discount.timesUsed >= discount.usageLimit) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Discount code "${discount.code}" has been fully redeemed`);
      }

      discountAmount =
        discount.type === DiscountType.PERCENTAGE
          ? round2(subtotal * (discount.value / 100))
          : round2(Math.min(discount.value, subtotal));
    }

    // Service charge applies to the discounted amount, and tax on top of both —
    // matching how the seeded history was priced.
    const taxable = round2(subtotal - discountAmount);
    const serviceCharge = round2(taxable * ((settings.serviceChargePct ?? 0) / 100));
    const taxAmount = round2((taxable + serviceCharge) * ((settings.taxPercent ?? 0) / 100));

    return {
      lines,
      discount,
      discountAmount,
      subtotal,
      serviceCharge,
      taxAmount,
      totalAmount: round2(taxable + serviceCharge + taxAmount),
    };
  }

  /** Per-branch daily sequence, e.g. "A1B2-260922-0003". */
  private async nextOrderNumber(branchId: string): Promise<string> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const count = await this.prisma.order.count({
      where: { branchId, createdAt: { gte: startOfDay } },
    });

    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const sequence = (count + 1).toString().padStart(4, '0');
    return `${branchId.slice(-4).toUpperCase()}-${dateStr}-${sequence}`;
  }

  async createOrder(branchId: string, data: CreateOrderDto, actor?: OrderActor) {
    const branchSettings = await this.prisma.branchSetting.findUnique({ where: { branchId } });
    if (!branchSettings) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch settings not found');

    const priced = await this.priceOrder(data.items, branchSettings, data.discountCode);
    const tipAmount = round2(Math.max(0, data.tipAmount ?? 0));

    const acceptanceMode = branchSettings.orderAcceptanceMode;
    const initialStatus =
      acceptanceMode === OrderAcceptanceMode.AUTO_ACCEPT ? OrderStatus.CONFIRMED : OrderStatus.PENDING;

    const orderNumber = await this.nextOrderNumber(branchId);

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        branchId,
        tableId: data.tableId,
        customerId: data.customerId,
        tableSessionId: data.tableSessionId,
        guestSessionId: data.guestSessionId,
        channel: data.channel || OrderChannel.DINE_IN,
        status: initialStatus,
        subtotal: priced.subtotal,
        discountAmount: priced.discountAmount,
        taxAmount: priced.taxAmount,
        serviceCharge: priced.serviceCharge,
        tipAmount,
        totalAmount: round2(priced.totalAmount + tipAmount),
        discountId: priced.discount?.id ?? null,
        discountCodeSnapshot: priced.discount?.code ?? null,
        specialInstructions: data.specialInstructions,
        acceptanceMode,
        // Only a staff member goes on `placedByStaffId`; a guest order leaves it null.
        placedByStaffId: actor?.isStaff ? actor.userId : null,
        orderItems: {
          create: priced.lines.map((line) => ({
            productId: line.productId,
            productNameSnapshot: line.productNameSnapshot,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
            subtotal: line.subtotal,
            stationType: line.stationType,
            modifiers: line.modifiers.length > 0 ? line.modifiers : undefined,
            status:
              initialStatus === OrderStatus.CONFIRMED
                ? OrderItemStatus.PREPARING
                : OrderItemStatus.PENDING,
          })),
        },
      },
      include: { orderItems: true },
    });

    if (priced.discount) {
      await this.prisma.discount.update({
        where: { id: priced.discount.id },
        data: { timesUsed: { increment: 1 } },
      });
    }

    if (actor) {
      this.auditLog.handleAuditLogEvent({
        actorId: actor.userId,
        branchId,
        action: 'ORDER_CREATED',
        entityType: 'Order',
        entityId: order.id,
        metadata: {
          orderNumber,
          status: initialStatus,
          total: order.totalAmount,
          discountCode: priced.discount?.code ?? null,
        },
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
