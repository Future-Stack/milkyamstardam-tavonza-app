import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@/config/config.service';
import { ApiError } from '@/utils/api_error';

interface GmailEmailParams {
  sender: { email: string; name?: string };
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

@Injectable()
export class GMailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(GMailService.name);

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get('MAIL_USER');
    const pass = this.configService.get('MAIL_PASS');

    if (!user || !pass) {
      this.logger.error('MAIL_USER or MAIL_PASS not found');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  async sendEmail(options: GmailEmailParams) {
    try {
      const to = options.to.map((contact) => contact.email).join(', ');

      console.log(`see email playload`, {
        from: options.sender.email || this.configService.get('MAIL_FROM'),
        to: to,
        subject: options.subject,
        html: options.htmlContent,
      });

      await this.transporter.sendMail({
        from: options.sender.email || this.configService.get('MAIL_FROM'),
        to: to,
        subject: options.subject,
        html: options.htmlContent,
      });
    } catch (error: any) {
      if (error.code === 'EAUTH') {
        this.logger.error(
          'Gmail authentication failed (535). Please ensure you are using an "App Password" if 2FA is enabled.',
        );
      } else {
        this.logger.error('Failed to send email via Gmail', error);
      }
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Failed to send email via Gmail');
    }
  }
}
