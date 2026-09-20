import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/helper/prisma.service';
import { ApiError } from '@/utils/api_error';
import { UpdateDisplayItemStatusDto } from './dto/display.dto';
import { OrderItemStatus, StationType } from '@prisma/client';
import { OrderService } from '../order/order.service';

@Injectable()
export class DisplayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  async getDisplayItems(branchId: string, stationType: StationType) {
    return this.prisma.orderItem.findMany({
      where: {
        stationType,
        order: { branchId },
        status: { in: [OrderItemStatus.PENDING, OrderItemStatus.PREPARING] }
      },
      include: {
        order: {
          select: { orderNumber: true, table: { select: { label: true } }, specialInstructions: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async updateItemStatus(id: string, dto: UpdateDisplayItemStatusDto, actorId: string) {
    return this.orderService.updateOrderItemStatus(id, dto, actorId);
  }
}
