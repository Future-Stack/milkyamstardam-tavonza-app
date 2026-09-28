import { Controller, Get, Post, Body, Patch, Param, Request, HttpStatus, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto, UpdateOrderItemStatusDto, UpdateOrderStatusDto } from './dto/order.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole, OrderChannel, OrderItemStatus, OrderRejectionReason, OrderStatus } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

export class RejectOrderDto {
  rejectionReasonCode: OrderRejectionReason;
  rejectionReason?: string;
}

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF, GlobalRole.CUSTOMER)
  @Post('branches/:branchId/orders')
  @ApiOperation({ summary: 'Create order' })
  @ApiStandardResponse({ type: OrderResponseDto })
  async createOrder(@Param('branchId') branchId: string, @Body() dto: CreateOrderDto, @Request() req: any) {
    const result = await this.orderService.createOrder(branchId, dto, {
      userId: req.user.id,
      isStaff: req.user.role !== GlobalRole.CUSTOMER,
    });
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Order created', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('branches/:branchId/orders')
  @ApiOperation({ summary: 'List orders' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search by orderNumber' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'channel', required: false, enum: OrderChannel })
  @ApiQuery({ name: 'tableId', required: false, type: String })
  @ApiStandardResponse({ type: OrderResponseDto, isArray: true, isPaginated: true })
  async findAllOrders(@Param('branchId') branchId: string, @Query() query: Record<string, any> = {}) {
    const result = await this.orderService.findAllOrders(branchId, query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Orders retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF, GlobalRole.CUSTOMER)
  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiStandardResponse({ type: OrderResponseDto })
  async findOneOrder(@Param('id') id: string) {
    const result = await this.orderService.findOneOrder(id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Order retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Patch('orders/:id/accept')
  @ApiOperation({ summary: 'Accept order' })
  @ApiStandardResponse({ type: OrderResponseDto })
  async acceptOrder(@Param('id') id: string, @Request() req: any) {
    const result = await this.orderService.acceptOrder(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Order accepted', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Patch('orders/:id/reject')
  @ApiOperation({ summary: 'Reject order' })
  @ApiStandardResponse({ type: OrderResponseDto })
  async rejectOrder(@Param('id') id: string, @Body() dto: RejectOrderDto, @Request() req: any) {
    const result = await this.orderService.rejectOrder(id, dto.rejectionReasonCode, dto.rejectionReason, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Order rejected', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiStandardResponse({ type: OrderResponseDto })
  async updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto, @Request() req: any) {
    const result = await this.orderService.updateOrderStatus(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Order status updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF, GlobalRole.CUSTOMER)
  @Patch('orders/:id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiStandardResponse({ type: OrderResponseDto })
  async cancelOrder(@Param('id') id: string, @Request() req: any) {
    const result = await this.orderService.cancelOrder(id, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Order cancelled', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Patch('order-items/:id/status')
  @ApiOperation({ summary: 'Update order item status' })
  @ApiStandardResponse({ type: OrderResponseDto })
  async updateOrderItemStatus(@Param('id') id: string, @Body() dto: UpdateOrderItemStatusDto, @Request() req: any) {
    const result = await this.orderService.updateOrderItemStatus(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Order item status updated', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get('orders/:id/status-log')
  @ApiOperation({ summary: 'Get order status change history' })
  @ApiStandardResponse({ type: OrderResponseDto, isArray: true })
  async getOrderStatusLog(@Param('id') id: string) {
    const result = await this.orderService.getOrderStatusLog(id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Status log retrieved', data: result });
  }
}
