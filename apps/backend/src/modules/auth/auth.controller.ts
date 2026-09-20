import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './auth.decorator';
import { Request, Response } from 'express';
import { ResponseService } from '@/utils/response';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ConfirmEmailChangeDto } from './dto/confirm-email-change.dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '@/config/config.service';
import { ApiStandardResponse } from '@/utils/swagger.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  TokensResponseDto,
  UserProfileResponseDto,
  SimpleMessageResponseDto,
} from './dto/auth-responses.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  // ─────────────────────────────────────────
  // 🍪 Helper: Set Auth Cookies
  // ─────────────────────────────────────────
  private parseMaxAge(maxAge: string): number {
    const unit = maxAge.slice(-1);
    const value = parseInt(maxAge.slice(0, -1));
    if (isNaN(value)) return 0;

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return parseInt(maxAge) || 0;
    }
  }

  private setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    const isProduction = this.configService.get('NODE_ENV')?.toLowerCase() === 'production';
    const cookieDomain = this.configService.get('COOKIE_DOMAIN') || 'localhost';

    const accessTokenMaxAge = this.parseMaxAge(this.configService.get('JWT_EXPIRES_IN') || '7d');
    const refreshTokenMaxAge = this.parseMaxAge(
      this.configService.get('JWT_REFRESH_EXPIRES_IN') || '365d',
    );

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: accessTokenMaxAge,
      path: '/',
      domain: cookieDomain,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/',
      domain: cookieDomain,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiStandardResponse({ type: TokensResponseDto, description: 'Login successful' })
  async signIn(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);

    // 🍪 Set tokens as HTTP-only cookies
    if (result.access_token && result.refresh_token) {
      this.setAuthCookies(res, {
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      });
    }

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'User Login successfully',
      data: result,
    });
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Customer Self-Registration' })
  @ApiBody({ type: RegisterCustomerDto })
  @ApiStandardResponse({
    type: UserProfileResponseDto,
    description: 'Customer registered successfully',
  })
  async register(@Body() registerDto: RegisterCustomerDto) {
    const result = await this.userService.createCustomer(registerDto);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Customer registered successfully',
      data: result,
    });
  }

  @Post('fcm-token')
  @ApiBearerAuth('JWT-auth')
  @Roles(GlobalRole.ADMIN, GlobalRole.RESTAURANT_OWNER, GlobalRole.CUSTOMER)
  @ApiOperation({ summary: 'Set FCM Token' })
  @ApiStandardResponse({ type: UserProfileResponseDto, description: 'FCM token set successfully' })
  async setFCMToken(@Req() req: Request, @Body() tokenDto: { deviceToken: string }) {
    const result = await this.authService.setFCMToken(req, tokenDto);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'FCM token set successfully',
      data: result,
    });
  }

  @Get('get-me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiStandardResponse({
    type: UserProfileResponseDto,
    description: 'User profile retrieved successfully',
  })
  async getProfile(@Req() req: Request) {
    const user: any = req?.user;
    const result = await this.authService.getMe(user);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'User profile retrieved successfully',
      data: result,
    });
  }

  @Post('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change Password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiStandardResponse({ type: String, description: 'Password changed successfully' })
  async changePassword(@Body() data: ChangePasswordDto, @Req() req: Request) {
    const user: any = req?.user;
    const id: string = user?.id;
    const result = await this.authService.changePassword({ ...data, id });

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Password changed successfully',
      data: result,
    });
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot Password (Send OTP)' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiStandardResponse({ type: String, description: 'OTP sent successfully' })
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const result = await this.authService.forgetPassword({
      email: data.email,
    });
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'OTP sent successfully',
      data: result,
    });
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password using OTP' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiStandardResponse({ type: String, description: 'Password reset successfully' })
  async resetPassword(@Body() payload: ResetPasswordDto) {
    const result = await this.authService.resetPassword({
      email: payload.email,
      otp: payload.otp,
      password: payload.password,
    });

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
      data: result,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User Logout' })
  @ApiStandardResponse({ type: Boolean, description: 'Logout successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookieDomain = this.configService.get('COOKIE_DOMAIN') || 'localhost';
    // 🧹 Clear auth cookies
    res.clearCookie('access_token', {
      path: '/',
      domain: cookieDomain,
    });
    res.clearCookie('refresh_token', {
      path: '/',
      domain: cookieDomain,
    });

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'User Logout successfully',
      data: true,
    });
  }

  @Post('change-email-request')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Request Email Change' })
  @ApiBody({ type: ChangeEmailDto })
  @ApiStandardResponse({ type: String, description: 'Confirmation email sent successfully' })
  async requestEmailChange(@Body() data: ChangeEmailDto, @Req() req: Request) {
    const user: any = req?.user;
    const userId: string = user?.id;
    const result = await this.authService.requestEmailChange(userId, data.newEmail);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Confirmation email sent successfully',
      data: result,
    });
  }

  @Public()
  @Post('confirm-email-change')
  @ApiOperation({ summary: 'Confirm Email Change' })
  @ApiBody({ type: ConfirmEmailChangeDto })
  @ApiStandardResponse({
    type: SimpleMessageResponseDto,
    description: 'Email updated successfully',
  })
  async confirmEmailChange(@Body() data: ConfirmEmailChangeDto) {
    const result = await this.authService.confirmEmailChange(data.token);

    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: 'Email updated successfully',
      data: result,
    });
  }
}
