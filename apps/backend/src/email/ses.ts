import { HttpStatus, Injectable } from '@nestjs/common';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { ConfigService } from '@/config/config.service';
import * as nodemailer from 'nodemailer';
import { ApiError } from '@/utils/api_error';

@Injectable()
export class SesService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const sesClient = new SESv2Client({
      region: this.configService.get('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });

    this.transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand },
    } as any);
  }

  async sendEmail(options: { to: string; subject: string; html: string }) {
    console.log(`see from`, this.configService.get('SES_FROM_EMAIL'));
    console.log(`see access key`, this.configService.get('AWS_ACCESS_KEY_ID'));
    console.log(`see secret access key`, this.configService.get('AWS_SECRET_ACCESS_KEY'));
    console.log(`see region`, this.configService.get('AWS_REGION'));

    try {
      await this.transporter.sendMail({
        from: this.configService.get('SES_FROM_EMAIL') || this.configService.get('MAIL_FROM'),
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      console.error('SES Email Send Error:', error);
      throw new ApiError(HttpStatus.FAILED_DEPENDENCY, 'Failed to send email via SES');
    }
  }
}
