import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class EmailTemplate {
  constructor(private readonly configService: ConfigService) {}
  async resetPasswordEmail(email: string, name: string, otp: string) {
    const params = {
      to: email,
      subject: 'LifeKeys Shepherd - Reset Your Password OTP',
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; line-height: 1.6; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #FF7600; padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Reset OTP</h1>
            </div>
            <div style="padding: 40px 30px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">We received a request to reset your password. Use the following One-Time Password (OTP) to reset your password:</p>
                
                <div style="text-align: center; margin: 30px 0; background-color: #f4f7fa; padding: 20px; border-radius: 8px;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #FF7600;">${otp}</span>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>

                <p style="font-size: 16px; margin-bottom: 20px;">If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                
                <p style="font-size: 16px; margin-bottom: 0;">Best regards,<br>Your Support Team</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d;">
                <p style="margin: 0 0 10px;">This is an automated message, please do not reply to this email.</p>
                <p style="margin: 0;">© 2025 oaktree. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`,
    };
    return params;
  }

  async changeEmailConfirmation(email: string, name: string, link: string) {
    const params = {
      to: email,
      subject: 'LifeKeys Shepherd - Confirm Your New Email Address',
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Change Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; line-height: 1.6; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #FF7600; padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Email Change Confirmation</h1>
            </div>
            <div style="padding: 40px 30px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
                
                <p style="font-size: 16px; margin-bottom: 30px;">We received a request to change the email address associated with your LifeKeys Shepherd account to this one. Click the button below to confirm this change:</p>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="${link}" style="display: inline-block; background-color: #FF7600; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
                        Confirm New Email
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                <p style="font-size: 14px; color: #FF7600; word-break: break-all; margin-bottom: 30px;">${link}</p>
 
                <p style="font-size: 16px; margin-bottom: 20px;">If you did not request this change, please ignore this email. No changes will be made to your account.</p>
                
                <p style="font-size: 16px; margin-bottom: 0;">Best regards,<br>Your Support Team</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d;">
                <p style="margin: 0 0 10px;">This is an automated message, please do not reply to this email.</p>
                <p style="margin: 0;">© 2025 oaktree. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`,
    };
    return params;
  }
}
