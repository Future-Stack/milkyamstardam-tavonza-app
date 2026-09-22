import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';

import { ConfigService } from '@/config/config.service';
import { GMailService } from '@/email/gmail';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { AuditLogService } from '../audit-log/audit-log.service';
import { OrderService } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';
import {
  CreateGuestOrderDto,
  GuestPaymentDto,
  GuestReviewDto,
} from './dto/guest.dto';
import {
  GlobalRole,
  GuestSessionStatus,
  OrderChannel,
  OrderStatus,
  PaymentScope,
  PaymentStatus,
  TableServiceStatus,
  TableSessionStatus,
  UserStatus,
} from '@prisma/client';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

const OTP_TTL_MINUTES = 10;

/**
 * Everything a guest at a table can do.
 *
 * The governing rule for this whole module: **the guest's identity comes from
 * their JWT, never from the request body**. `guestSessionId` and
 * `tableSessionId` are baked into the token at OTP verification, so a guest
 * cannot order onto, or pay for, a table that isn't theirs.
 */
@Injectable()
export class GuestService {
  private readonly logger = new Logger(GuestService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly gmailService: GMailService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly auditLog: AuditLogService,
  ) {}

  // ───────────────────────────────────────────────────────────────────────────
  // Resolution helpers
  // ───────────────────────────────────────────────────────────────────────────

  private async resolveTable(token: string) {
    const table = await this.prisma.table.findUnique({ where: { qrCodeToken: token } });
    if (!table) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'This QR code is not recognised.');
    }

    const branch = await this.prisma.branch.findUnique({
      where: { id: table.branchId },
      include: { restaurant: true, settings: true },
    });
    if (!branch) throw new ApiError(HttpStatus.NOT_FOUND, 'Branch not found');
    if (!branch.isActive) {
      throw new ApiError(HttpStatus.CONFLICT, 'This branch is not currently taking orders.');
    }

    return { table, branch, restaurant: branch.restaurant, settings: branch.settings };
  }

  /** The one open session for a table, if any. */
  private findOpenSession(tableId: string) {
    return this.prisma.tableSession.findFirst({
      where: {
        tableId,
        status: { in: [TableSessionStatus.ACTIVE, TableSessionStatus.BILL_REQUESTED] },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  private generateJoinCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Public — the guest has not identified themselves yet
  // ───────────────────────────────────────────────────────────────────────────

  async getTableByToken(token: string) {
    const { table, branch, restaurant, settings } = await this.resolveTable(token);
    const session = await this.findOpenSession(table.id);

    const guestCount = session
      ? await this.prisma.guestSession.count({
          where: { tableSessionId: session.id, status: GuestSessionStatus.ACTIVE },
        })
      : 0;

    return {
      table: {
        id: table.id,
        label: table.label,
        capacity: table.capacity,
        shape: table.shape,
        serviceStatus: table.serviceStatus,
      },
      branch: { id: branch.id, name: branch.name, phone: branch.phone, timezone: branch.timezone },
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        logoUrl: restaurant.logoUrl,
        description: restaurant.description,
      },
      settings: {
        currency: settings?.currency ?? 'USD',
        taxPercent: settings?.taxPercent ?? 0,
        serviceChargePct: settings?.serviceChargePct ?? 0,
        tipEnabled: settings?.tipEnabled ?? true,
        hideUnavailableItems: settings?.hideUnavailableItems ?? false,
        requireOtpPerGuest: settings?.requireOtpPerGuest ?? true,
        allowSplitBill: settings?.allowSplitBill ?? true,
        allowMultipleGuestSessions: settings?.allowMultipleGuestSessions ?? true,
        orderAcceptanceMode: settings?.orderAcceptanceMode ?? 'WAITER_APPROVAL',
      },
      session: session
        ? {
            id: session.id,
            joinCode: session.joinCode,
            status: session.status,
            partySize: session.partySize,
            guestCount,
            startedAt: session.startedAt,
          }
        : null,
    };
  }

  /**
   * Sends a 6-digit code to the guest's email or phone.
   *
   * Email goes out through Gmail. There is no SMS provider wired up, so a phone
   * contact is logged server-side and — outside production — echoed back in the
   * response so the flow stays testable. That escape hatch is deliberately
   * tied to NODE_ENV.
   */
  async sendOtp(token: string, contact: string) {
    const { table, restaurant } = await this.resolveTable(token);
    const normalized = contact.trim().toLowerCase();

    // One live code per contact per table.
    await this.prisma.tableAuthOtp.deleteMany({
      where: { tableId: table.id, contact: normalized, verified: false },
    });

    const otp = String(randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);
    const session = await this.findOpenSession(table.id);

    await this.prisma.tableAuthOtp.create({
      data: {
        contact: normalized,
        tableId: table.id,
        tableSessionId: session?.id,
        otp,
        expiresAt,
      },
    });

    const isEmail = normalized.includes('@');

    if (isEmail) {
      await this.gmailService.sendEmail({
        sender: {
          email: this.configService.get('MAIL_FROM') || this.configService.get('MAIL_USER') || '',
        },
        to: [{ email: normalized }],
        subject: `${otp} is your ${restaurant.name} verification code`,
        htmlContent: `
          <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px">
            <h1 style="font-size:20px;margin:0 0 8px">Your verification code</h1>
            <p style="color:#555;margin:0 0 24px">
              Enter this code at ${table.label} to start ordering.
            </p>
            <div style="font-size:34px;font-weight:700;letter-spacing:8px;padding:18px 0;
                        text-align:center;background:#f4f4f5;border-radius:10px">${otp}</div>
            <p style="color:#888;font-size:13px;margin:24px 0 0">
              It expires in ${OTP_TTL_MINUTES} minutes. If you didn't ask for this, ignore this email.
            </p>
          </div>`,
      });
    } else {
      this.logger.warn(
        `No SMS provider is configured. OTP for ${normalized} at ${table.label} is ${otp}.`,
      );
    }

    return {
      contact: normalized,
      expiresAt,
      expiresInMinutes: OTP_TTL_MINUTES,
      delivery: isEmail ? 'email' : 'sms_unconfigured',
      ...(process.env.NODE_ENV !== 'production' && !isEmail ? { devOtp: otp } : {}),
    };
  }

  /** Verifies the code and establishes the guest's table session. */
  async verifyOtp(token: string, contact: string, otp: string) {
    const { table, branch, restaurant, settings } = await this.resolveTable(token);
    const normalized = contact.trim().toLowerCase();

    const record = await this.prisma.tableAuthOtp.findFirst({
      where: { tableId: table.id, contact: normalized, verified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'No code was requested for this contact.');
    }
    if (record.otp !== otp) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'That code is not correct.');
    }
    if (new Date() > record.expiresAt) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'That code has expired — request a new one.');
    }

    await this.prisma.tableAuthOtp.update({
      where: { id: record.id },
      data: { verified: true },
    });

    const user = await this.findOrCreateGuestUser(normalized);
    const customer = await this.ensureCustomer(user.id);

    // Open the table if nobody has, otherwise join the existing session. A
    // second scan must never be refused with "table occupied".
    let session = await this.findOpenSession(table.id);
    let openedSession = false;

    if (!session) {
      session = await this.prisma.tableSession.create({
        data: {
          tableId: table.id,
          branchId: table.branchId,
          joinCode: this.generateJoinCode(),
          status: TableSessionStatus.ACTIVE,
        },
      });
      openedSession = true;
    } else if (settings && !settings.allowMultipleGuestSessions) {
      const alreadySeated = await this.prisma.guestSession.findFirst({
        where: {
          tableSessionId: session.id,
          customerId: customer.id,
          status: GuestSessionStatus.ACTIVE,
        },
      });
      if (!alreadySeated) {
        throw new ApiError(
          HttpStatus.CONFLICT,
          'This table already has an open session and is not accepting additional guests.',
        );
      }
    }

    // Re-verifying at the same table resumes the same guest session.
    let guestSession = await this.prisma.guestSession.findFirst({
      where: {
        tableSessionId: session.id,
        customerId: customer.id,
        status: GuestSessionStatus.ACTIVE,
      },
    });

    if (!guestSession) {
      const seatedCount = await this.prisma.guestSession.count({
        where: { tableSessionId: session.id },
      });

      guestSession = await this.prisma.guestSession.create({
        data: {
          tableSessionId: session.id,
          customerId: customer.id,
          displayName: user.name,
          contact: normalized,
          otpVerifiedAt: new Date(),
          isHostGuest: seatedCount === 0,
        },
      });
    }

    if (table.serviceStatus === TableServiceStatus.AVAILABLE) {
      await this.prisma.table.update({
        where: { id: table.id },
        data: { serviceStatus: TableServiceStatus.OCCUPIED },
      });
    }

    this.auditLog.handleAuditLogEvent({
      actorId: user.id,
      branchId: branch.id,
      action: openedSession ? 'TABLE_SESSION_OPENED_BY_GUEST' : 'GUEST_JOINED_TABLE',
      entityType: 'GuestSession',
      entityId: guestSession.id,
      metadata: { tableLabel: table.label, tableSessionId: session.id },
    });

    // The token IS the table session — both ids travel in it so no endpoint has
    // to trust a session id supplied in a request body.
    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        guestSessionId: guestSession.id,
        tableSessionId: session.id,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '12h',
      },
    );

    return {
      accessToken,
      guest: {
        id: guestSession.id,
        displayName: guestSession.displayName,
        isHostGuest: guestSession.isHostGuest,
      },
      tableSession: {
        id: session.id,
        joinCode: session.joinCode,
        status: session.status,
        guestCount: await this.prisma.guestSession.count({
          where: { tableSessionId: session.id },
        }),
      },
      table: { id: table.id, label: table.label },
      branch: { id: branch.id, name: branch.name },
      restaurant: { id: restaurant.id, name: restaurant.name },
    };
  }

  async getMenu(token: string) {
    const { restaurant, settings } = await this.resolveTable(token);

    const categories = await this.prisma.menuCategory.findMany({
      where: { restaurantId: restaurant.id, isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        menuItems: {
          // Per the branch setting: either hide unavailable items entirely, or
          // show them greyed out so regulars know the dish still exists.
          where: settings?.hideUnavailableItems ? { isAvailable: true } : {},
          orderBy: { displayOrder: 'asc' },
          include: {
            modifierGroups: {
              include: {
                modifiers: { where: { isAvailable: true } },
              },
            },
          },
        },
      },
    });

    return {
      restaurant: { id: restaurant.id, name: restaurant.name, logoUrl: restaurant.logoUrl },
      currency: settings?.currency ?? 'USD',
      hideUnavailableItems: settings?.hideUnavailableItems ?? false,
      categories: categories.filter((category) => category.menuItems.length > 0),
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Authenticated — the guest session comes from the JWT
  // ───────────────────────────────────────────────────────────────────────────

  private async loadGuest(claims: any) {
    const guestSessionId = claims?.guestSessionId;
    if (!guestSessionId) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        'Sign in at your table first — scan the table QR code.',
      );
    }

    const guest = await this.prisma.guestSession.findUnique({
      where: { id: guestSessionId },
      include: { tableSession: { include: { table: true, branch: true } } },
    });

    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Your table session is no longer available.');
    }
    if (guest.status !== GuestSessionStatus.ACTIVE) {
      throw new ApiError(HttpStatus.CONFLICT, 'You have already left this table.');
    }

    return guest;
  }

  /**
   * The guest's own view of the table: who is sitting here, what each guest
   * ordered, and what each still owes. This is what makes "pay for myself",
   * "pay for them" and "pay for the table" decidable on the client.
   */
  async getTab(claims: any) {
    const guest = await this.loadGuest(claims);
    const session = guest.tableSession;

    const [guests, orders, payments, settings] = await Promise.all([
      this.prisma.guestSession.findMany({
        where: { tableSessionId: session.id },
        orderBy: { joinedAt: 'asc' },
      }),
      this.prisma.order.findMany({
        where: { tableSessionId: session.id },
        include: { orderItems: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.payment.findMany({
        // Table-level, guest-level and item-level payments all allocate onto
        // orders, so allocations are the single source of what's been settled.
        where: { tableSessionId: session.id, status: PaymentStatus.PAID },
        include: { allocations: true },
      }),
      this.prisma.branchSetting.findUnique({ where: { branchId: session.branchId } }),
    ]);

    const paidByOrder = new Map<string, number>();
    for (const payment of payments) {
      for (const allocation of payment.allocations) {
        if (!allocation.orderId) continue;
        paidByOrder.set(
          allocation.orderId,
          round2((paidByOrder.get(allocation.orderId) ?? 0) + allocation.amount),
        );
      }
    }

    const orderViews = orders.map((order) => {
      const paidAmount = paidByOrder.get(order.id) ?? 0;
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        guestSessionId: order.guestSessionId,
        placedAt: order.createdAt,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        serviceCharge: order.serviceCharge,
        taxAmount: order.taxAmount,
        tipAmount: order.tipAmount,
        totalAmount: order.totalAmount,
        paidAmount,
        balance: round2(Math.max(0, order.totalAmount - paidAmount)),
        items: order.orderItems.map((item) => ({
          id: item.id,
          name: item.productNameSnapshot,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          status: item.status,
          stationType: item.stationType,
          modifiers: item.modifiers ?? [],
        })),
      };
    });

    const guestViews = guests.map((person) => {
      const theirs = orderViews.filter((order) => order.guestSessionId === person.id);
      return {
        id: person.id,
        displayName: person.displayName,
        isHostGuest: person.isHostGuest,
        status: person.status,
        // Only the caller's own contact is echoed back.
        contact: person.id === guest.id ? person.contact : undefined,
        orders: theirs,
        owed: round2(theirs.reduce((sum, order) => sum + order.totalAmount, 0)),
        paid: round2(theirs.reduce((sum, order) => sum + order.paidAmount, 0)),
        balance: round2(theirs.reduce((sum, order) => sum + order.balance, 0)),
      };
    });

    const mine = guestViews.find((person) => person.id === guest.id);

    return {
      currency: settings?.currency ?? 'USD',
      allowSplitBill: settings?.allowSplitBill ?? true,
      me: mine,
      guests: guestViews,
      table: {
        id: session.table.id,
        label: session.table.label,
        serviceStatus: session.table.serviceStatus,
      },
      branch: { id: session.branch.id, name: session.branch.name },
      session: {
        id: session.id,
        joinCode: session.joinCode,
        status: session.status,
        partySize: session.partySize,
        startedAt: session.startedAt,
      },
      tableTotals: {
        subtotal: round2(orderViews.reduce((sum, order) => sum + order.totalAmount, 0)),
        paid: round2(orderViews.reduce((sum, order) => sum + order.paidAmount, 0)),
        outstanding: round2(orderViews.reduce((sum, order) => sum + order.balance, 0)),
      },
    };
  }

  async placeOrder(claims: any, dto: CreateGuestOrderDto) {
    const guest = await this.loadGuest(claims);
    const session = guest.tableSession;

    if (
      session.status !== TableSessionStatus.ACTIVE &&
      session.status !== TableSessionStatus.BILL_REQUESTED
    ) {
      throw new ApiError(HttpStatus.CONFLICT, 'This table is no longer accepting orders.');
    }

    // Table, session and guest all come from the verified session — never the body.
    const order = await this.orderService.createOrder(
      session.branchId,
      {
        tableId: session.tableId,
        tableSessionId: session.id,
        guestSessionId: guest.id,
        customerId: guest.customerId ?? undefined,
        channel: OrderChannel.QR_SELF_ORDER,
        items: dto.items,
        specialInstructions: dto.specialInstructions,
        tipAmount: dto.tipAmount,
        discountCode: dto.discountCode,
      },
      { userId: claims.id, isStaff: false },
    );

    await this.prisma.table.update({
      where: { id: session.tableId },
      data: { serviceStatus: TableServiceStatus.ORDERING },
    });

    return order;
  }

  async reviewOrder(claims: any, orderId: string, dto: GuestReviewDto) {
    const guest = await this.loadGuest(claims);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ApiError(HttpStatus.NOT_FOUND, 'Order not found');

    if (order.guestSessionId !== guest.id) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You can only review an order you placed.');
    }
    if (order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.SERVED) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        'You can review an order once it has been served.',
      );
    }
    if (!guest.customerId) {
      throw new ApiError(HttpStatus.CONFLICT, 'This guest session has no customer profile.');
    }

    const review = await this.prisma.orderReview.upsert({
      where: { orderId },
      update: { rating: dto.rating, comment: dto.comment },
      create: {
        orderId,
        customerId: guest.customerId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    this.auditLog.handleAuditLogEvent({
      actorId: claims.id,
      branchId: order.branchId,
      action: 'ORDER_REVIEWED',
      entityType: 'OrderReview',
      entityId: review.id,
      metadata: { orderId, rating: dto.rating },
    });

    return review;
  }

  /**
   * Settles whatever the guest asked to settle.
   *
   * The guest never sends an amount — the server resolves the unpaid orders the
   * requested scope covers, prices them, and allocates the payment across them.
   */
  async pay(claims: any, dto: GuestPaymentDto) {
    const guest = await this.loadGuest(claims);
    const session = guest.tableSession;

    const openOrders = await this.prisma.order.findMany({
      where: {
        tableSessionId: session.id,
        status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REJECTED] },
      },
      include: { orderItems: true },
    });

    const paidByOrder = await this.paidByOrder(session.id);
    const unpaid = openOrders.filter(
      (order) => round2(order.totalAmount - (paidByOrder.get(order.id) ?? 0)) > 0.009,
    );

    const allocations: { orderId?: string; orderItemId?: string; amount: number }[] = [];
    const targetGuestIds: string[] = [];

    if (dto.scope === PaymentScope.ORDER_ITEMS) {
      if (!dto.itemIds?.length) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'itemIds is required when paying for items.');
      }

      const orderIds = new Set(unpaid.map((order) => order.id));
      const items = await this.prisma.orderItem.findMany({
        where: { id: { in: dto.itemIds } },
      });

      if (items.length !== dto.itemIds.length) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'One or more items could not be found.');
      }

      for (const item of items) {
        if (!orderIds.has(item.orderId)) {
          throw new ApiError(
            HttpStatus.FORBIDDEN,
            'Those items are not part of an unpaid order on this table.',
          );
        }
        allocations.push({
          orderId: item.orderId,
          orderItemId: item.id,
          amount: round2(item.subtotal),
        });
      }
    } else {
      let targets = unpaid;

      if (dto.scope === PaymentScope.GUEST_SESSION) {
        const guestIds = dto.targetGuestIds?.length ? dto.targetGuestIds : [guest.id];

        // Every target must be seated at THIS table.
        const seated = await this.prisma.guestSession.findMany({
          where: { tableSessionId: session.id, id: { in: guestIds } },
          select: { id: true },
        });
        if (seated.length !== guestIds.length) {
          throw new ApiError(
            HttpStatus.FORBIDDEN,
            'You can only pay for guests at your own table.',
          );
        }

        targetGuestIds.push(...guestIds);
        targets = unpaid.filter(
          (order) => order.guestSessionId && guestIds.includes(order.guestSessionId),
        );
      } else if (dto.scope === PaymentScope.TABLE_SESSION) {
        targetGuestIds.push(
          ...(openOrders.map((order) => order.guestSessionId).filter(Boolean) as string[]),
        );
      } else {
        // Defensive: the DTO already restricts the scopes a guest may send.
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          `Scope ${dto.scope} cannot be used from a guest session.`,
        );
      }

      if (targets.length === 0) {
        throw new ApiError(HttpStatus.CONFLICT, 'Nothing is outstanding for that selection.');
      }

      for (const order of targets) {
        allocations.push({
          orderId: order.id,
          amount: round2(order.totalAmount - (paidByOrder.get(order.id) ?? 0)),
        });
      }
    }

    const amount = round2(allocations.reduce((sum, allocation) => sum + allocation.amount, 0));
    const serviceTip = round2(Math.max(0, dto.tipAmount ?? 0));

    const payment = await this.paymentService.createPayment(
      {
        // A payment that spans several orders leaves orderId null and relies on
        // its allocations — exactly what PaymentAllocation exists for.
        orderId: allocations.length === 1 ? allocations[0].orderId : undefined,
        tableSessionId: session.id,
        payerGuestSessionId: guest.id,
        paidForGuestIds: [...new Set(targetGuestIds)],
        scope: dto.scope,
        amount,
        tipAmount: serviceTip,
        method: dto.method,
        transactionRef: dto.transactionRef,
        allocations,
      },
      claims.id,
    );

    // createPayment only rolls payment status up for a single-order payment, so
    // multi-order settlements are reconciled here.
    const touchedOrderIds = [...new Set(allocations.map((a) => a.orderId).filter(Boolean) as string[])];
    await this.refreshOrderPaymentStatus(touchedOrderIds);

    // Once nothing is outstanding, the table is ready to be cleared.
    const afterPaid = await this.paidByOrder(session.id);
    const stillOwed = openOrders.some(
      (order) => round2(order.totalAmount - (afterPaid.get(order.id) ?? 0)) > 0.009,
    );

    if (!stillOwed) {
      await this.prisma.table.update({
        where: { id: session.tableId },
        data: { serviceStatus: TableServiceStatus.PAYMENT_PENDING },
      });
    }

    return { payment, amount, tipAmount: serviceTip };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────────────────────────────────────

  /** How much of each order has actually been settled, via payment allocations. */
  private async paidByOrder(tableSessionId: string): Promise<Map<string, number>> {
    const payments = await this.prisma.payment.findMany({
      where: { tableSessionId, status: PaymentStatus.PAID },
      include: { allocations: true },
    });

    const paid = new Map<string, number>();
    for (const payment of payments) {
      for (const allocation of payment.allocations) {
        if (!allocation.orderId) continue;
        paid.set(
          allocation.orderId,
          round2((paid.get(allocation.orderId) ?? 0) + allocation.amount),
        );
      }
    }
    return paid;
  }

  private async refreshOrderPaymentStatus(orderIds: string[]) {
    if (orderIds.length === 0) return;

    for (const orderId of orderIds) {
      const order = await this.prisma.order.findUnique({ where: { id: orderId } });
      if (!order) continue;

      const payments = await this.prisma.payment.findMany({
        where: { status: PaymentStatus.PAID, allocations: { some: { orderId } } },
        include: { allocations: true },
      });

      const paid = round2(
        payments.reduce(
          (sum, payment) =>
            sum +
            payment.allocations
              .filter((allocation) => allocation.orderId === orderId)
              .reduce((inner, allocation) => inner + allocation.amount, 0),
          0,
        ),
      );

      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          amountPaid: paid,
          paymentStatus:
            paid >= order.totalAmount
              ? PaymentStatus.PAID
              : paid > 0
                ? PaymentStatus.PARTIALLY_PAID
                : PaymentStatus.UNPAID,
        },
      });
    }
  }

  /**
   * Guests get a real User row (no password — they authenticate by OTP) so that
   * orders, reviews and loyalty attach to a durable identity.
   */
  private async findOrCreateGuestUser(contact: string) {
    const isEmail = contact.includes('@');

    const existing = await this.prisma.user.findFirst({
      where: isEmail ? { email: contact } : { contactNo: contact },
    });
    if (existing) return existing;

    // Phone-only guests still need the unique email column filled. This address
    // is a placeholder, never a mailbox we send to.
    const email = isEmail
      ? contact
      : `${contact.replace(/[^0-9]/g, '') || 'guest'}@guest.tavonza.local`;

    return this.prisma.user.create({
      data: {
        email,
        contactNo: isEmail ? undefined : contact,
        name: isEmail ? contact.split('@')[0] : 'Guest',
        role: GlobalRole.CUSTOMER,
        status: UserStatus.ACTIVE,
      },
    });
  }

  private async ensureCustomer(userId: string) {
    const existing = await this.prisma.customer.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.customer.create({ data: { userId } });
  }
}
