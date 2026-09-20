import { Controller, Get, Post, Body, Param, Request, HttpStatus, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, PaymentResponseDto, RefundPaymentDto } from './dto/payment.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole, PaymentStatus } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { ApiStandardResponse } from '@/utils/swagger.decorator';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF, GlobalRole.CUSTOMER)
  @Post()
  @ApiOperation({ summary: 'Create payment (with allocations)' })
  @ApiStandardResponse({ type: PaymentResponseDto })
  async createPayment(@Body() dto: CreatePaymentDto, @Request() req: any) {
    const result = await this.paymentService.createPayment(dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.CREATED, message: 'Payment created', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get()
  @ApiOperation({ summary: 'List payments' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search transaction reference' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: '-createdAt' })
  @ApiQuery({ name: 'orderId', required: false, type: String })
  @ApiQuery({ name: 'tableSessionId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus })
  @ApiStandardResponse({ type: PaymentResponseDto, isArray: true, isPaginated: true })
  async findAllPayments(@Query() query: Record<string, any>) {
    const result = await this.paymentService.findAllPayments(query);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Payments retrieved',
      meta: result?.meta,
      data: result?.data,
    });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Get(':id')
  @ApiOperation({ summary: 'Get payment details' })
  @ApiStandardResponse({ type: PaymentResponseDto })
  async findOnePayment(@Param('id') id: string) {
    const result = await this.paymentService.findOnePayment(id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Payment retrieved', data: result });
  }

  @Roles(GlobalRole.SUPER_ADMIN, GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.STAFF)
  @Post(':id/refund')
  @ApiOperation({ summary: 'Process refund' })
  @ApiStandardResponse({ type: PaymentResponseDto })
  async refundPayment(@Param('id') id: string, @Body() dto: RefundPaymentDto, @Request() req: any) {
    const result = await this.paymentService.refundPayment(id, dto, req.user.id);
    return ResponseService.formatResponse({ statusCode: HttpStatus.OK, message: 'Payment refunded', data: result });
  }
}
