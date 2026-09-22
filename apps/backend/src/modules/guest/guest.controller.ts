import { Body, Controller, Get, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GlobalRole } from '@prisma/client';

import { ResponseService } from '@/utils/response';
import { Public } from '../auth/auth.decorator';
import { Roles } from '../roles/roles.decorator';
import {
  CreateGuestOrderDto,
  GuestPaymentDto,
  GuestReviewDto,
  SendTableOtpDto,
  VerifyTableOtpDto,
} from './dto/guest.dto';
import { GuestService } from './guest.service';

/**
 * The guest journey, from scanning a table QR to settling the bill.
 *
 * The four `table/:token` and `menu/:token` routes are public: a guest has no
 * account until they verify an OTP. Everything else reads its table context from
 * the JWT — a guest cannot address another table by passing an id.
 */
@ApiTags('Guest (QR Ordering)')
@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Public()
  @Get('table/:token')
  @ApiOperation({
    summary: 'Resolve a table QR code',
    description:
      'Turns the `?token=` from a scanned QR into the table, branch, restaurant and the ' +
      'guest-facing branch settings. Also reports whether a table session is already open.',
  })
  async getTable(@Param('token') token: string) {
    const result = await this.guestService.getTableByToken(token);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Table resolved',
      data: result,
    });
  }

  @Public()
  @Post('table/:token/otp')
  @ApiOperation({
    summary: 'Send a table verification code',
    description:
      'Emails a 6-digit code. Phone contacts are logged server-side — no SMS provider is ' +
      'configured yet — and, outside production, returned as `devOtp` so the flow stays testable.',
  })
  async sendOtp(@Param('token') token: string, @Body() dto: SendTableOtpDto) {
    const result = await this.guestService.sendOtp(token, dto.contact);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Verification code sent',
      data: result,
    });
  }

  @Public()
  @Post('table/:token/otp/verify')
  @ApiOperation({
    summary: 'Verify the code and seat the guest',
    description:
      'Opens the table session if nobody has, otherwise joins the existing one — a second ' +
      'scan is never refused. Returns the guest JWT that carries the guest and table session ids.',
  })
  async verifyOtp(@Param('token') token: string, @Body() dto: VerifyTableOtpDto) {
    const result = await this.guestService.verifyOtp(token, dto.contact, dto.otp);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Verified — welcome to the table',
      data: result,
    });
  }

  @Public()
  @Get('menu/:token')
  @ApiOperation({ summary: 'Menu for the branch behind a table QR code' })
  async getMenu(@Param('token') token: string) {
    const result = await this.guestService.getMenu(token);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Menu retrieved',
      data: result,
    });
  }

  @Roles(GlobalRole.CUSTOMER)
  @ApiBearerAuth('JWT-auth')
  @Get('tab')
  @ApiOperation({
    summary: "The guest's view of the table",
    description:
      'Every guest seated here, what each ordered, and what each still owes — the data behind ' +
      '"pay for myself", "pay for them" and "pay for the table".',
  })
  async getTab(@Req() req: any) {
    const result = await this.guestService.getTab(req.user);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Tab retrieved',
      data: result,
    });
  }

  @Roles(GlobalRole.CUSTOMER)
  @ApiBearerAuth('JWT-auth')
  @Post('orders')
  @ApiOperation({
    summary: 'Place an order',
    description:
      'Send only products, quantities and modifier ids. Prices, tax, service charge and the ' +
      'kitchen/bar station are all computed server-side.',
  })
  async placeOrder(@Req() req: any, @Body() dto: CreateGuestOrderDto) {
    const result = await this.guestService.placeOrder(req.user, dto);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Order placed',
      data: result,
    });
  }

  @Roles(GlobalRole.CUSTOMER)
  @ApiBearerAuth('JWT-auth')
  @Post('orders/:id/review')
  @ApiOperation({ summary: 'Rate a served order (1–5)' })
  async reviewOrder(@Req() req: any, @Param('id') id: string, @Body() dto: GuestReviewDto) {
    const result = await this.guestService.reviewOrder(req.user, id, dto);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Thanks for the review',
      data: result,
    });
  }

  @Roles(GlobalRole.CUSTOMER)
  @ApiBearerAuth('JWT-auth')
  @Post('payments')
  @ApiOperation({
    summary: 'Settle the bill',
    description:
      'No amount is sent. The scope decides what is covered — the whole table, selected guest ' +
      'sessions, selected items, or your own — and the server prices and allocates it.',
  })
  async pay(@Req() req: any, @Body() dto: GuestPaymentDto) {
    const result = await this.guestService.pay(req.user, dto);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Payment settled',
      data: result,
    });
  }
}
