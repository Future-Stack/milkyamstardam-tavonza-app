import { PrismaService } from '@/helper/prisma.service';
import { UserService } from '@/modules/user/user.service';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiError } from '@/utils/api_error';
import { BcryptService } from '@/utils/bcrypt.service';
import { Request } from 'express';
import { ConfigService } from '@/config/config.service';
import { GlobalRole } from '@prisma/client';
// SES is parked in favour of Gmail for now — see `sendEmail` below.
// import { SesService } from '@/email/ses';
import { GMailService } from '@/email/gmail';
import { EmailTemplate } from '@/email-templates/forgot-password';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly gmailService: GMailService,
    // private readonly sesService: SesService,
    private readonly emailTemplate: EmailTemplate,
  ) {}

  /**
   * Delivers a template's output through Gmail.
   *
   * Templates return the SES-shaped `{ to, subject, html }`; GMailService takes
   * a `sender` + recipient list, so the two are bridged here rather than
   * changing every template's contract.
   */
  private async sendEmail(params: { to: string; subject: string; html: string }) {
    await this.gmailService.sendEmail({
      sender: {
        email:
          this.configService.get('MAIL_FROM') || this.configService.get('MAIL_USER') || '',
      },
      to: [{ email: params.to }],
      subject: params.subject,
      htmlContent: params.html,
    });
  }

  async login(data: {
    email: string;
    password: string;
    deviceToken?: string;
  }): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password, deviceToken } = data;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { customer: true },
    });

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const isPasswordMatched = await this.bcryptService.compare(password, user.password!);

    if (!isPasswordMatched) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '7d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '30d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async setFCMToken(
    req: Request,
    data: {
      deviceToken?: string;
    },
  ): Promise<any> {
    const user: any = req.user;
    if (!user || !user.id) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    if (data.deviceToken) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { fcmToken: data.deviceToken },
      });
    }

    return req.user;
  }

  async getMe(user: any) {
    const isUserExists = await this.prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      include: user.role === GlobalRole.CUSTOMER ? { customer: true } : undefined,
    });

    if (!isUserExists) {
      throw new ApiError(HttpStatus.NOT_FOUND, `user not found`);
    }

    delete (isUserExists as any).passwordHash;
    return isUserExists;
  }

  async changePassword({
    id,
    prevPass,
    newPass,
  }: {
    id: string;
    prevPass: string;
    newPass: string;
  }) {
    const isUserExists = await this.prisma.user.findUnique({ where: { id } });

    if (!isUserExists) {
      throw new ApiError(HttpStatus.NOT_FOUND, `user not found`);
    }

    const isPasswordMatched = await this.bcryptService.compare(prevPass, isUserExists.password!);

    if (!isPasswordMatched) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Password is not matched!');
    }

    const hashPassword = await this.bcryptService.hash(newPass);

    const changePassword = await this.prisma.user.update({
      where: { id: isUserExists?.id },
      data: {
        password: hashPassword,
      },
    });

    if (!changePassword) {
      throw new ApiError(HttpStatus.NOT_FOUND, `password not updated`);
    }

    return 'password updated';
  }

  async forgetPassword({ email }: { email: string }) {
    const isUserExists = await this.prisma.user.findUnique({ where: { email } });

    if (!isUserExists) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    // 6 digits — ResetPasswordDto validates @Length(6, 6).
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing OTP for this email
    await this.prisma.passwordResetOtp.deleteMany({ where: { email } });

    await this.prisma.passwordResetOtp.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    const params = await this.emailTemplate.resetPasswordEmail(email, isUserExists.name, otp);

    await this.sendEmail(params);

    return 'OTP sent to your email';
  }

  async resetPassword({ email, otp, password }: { email: string; otp: string; password: string }) {
    const otpRecord = await this.prisma.passwordResetOtp.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid or expired OTP');
    }

    if (otpRecord.otp !== otp) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid OTP');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'OTP has expired');
    }

    const hashPassword = await this.bcryptService.hash(password);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashPassword },
    });

    await this.prisma.passwordResetOtp.delete({
      where: { email },
    });

    return 'Password reset successfully';
  }

  async requestEmailChange(userId: string, newEmail: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const emailExists = await this.prisma.user.findUnique({ where: { email: newEmail } });
    if (emailExists) {
      throw new ApiError(HttpStatus.CONFLICT, 'Email already in use');
    }

    const payload = { userId, newEmail };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h',
    });

    const link = `${this.configService.get('CLIENT_URL')}/confirm-email?token=${token}`;
    const params = await this.emailTemplate.changeEmailConfirmation(newEmail, user.name, link);

    await this.sendEmail(params);

    return 'Confirmation email sent to the new email address';
  }

  async confirmEmailChange(token: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      console.log(error);
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid or expired confirmation token');
    }

    const { userId, newEmail } = payload;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const emailExists = await this.prisma.user.findUnique({ where: { email: newEmail } });
    if (emailExists) {
      throw new ApiError(HttpStatus.CONFLICT, 'Email already in use');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    return {
      message: 'Email updated successfully',
    };
  }
}
