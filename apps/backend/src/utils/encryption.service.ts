import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@/config/config.service';
import { ApiError } from './api_error';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey: Buffer;
  private readonly logger = new Logger(EncryptionService.name);

  constructor(private configService: ConfigService) {
    const rawKey = this.configService.get('ENCRYPTION_KEY');
    if (!rawKey) {
      throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'ENCRYPTION_KEY is not defined');
    }
    // Ensure the key is exactly 32 bytes (256 bits)
    this.secretKey = crypto.createHash('sha256').update(String(rawKey)).digest();
  }

  encrypt(text: string): string {
    if (!text) return text;
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (error) {
      this.logger.error('Encryption failed', error);
      throw error;
    }
  }

  decrypt(text: string): string {
    if (!text || !text.includes(':')) return text;
    try {
      const parts = text.split(':');
      if (parts.length !== 3) return text; // Not an encrypted string

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encryptedText = parts[2];

      const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed', error);
      // Fallback: return original text if decryption fails (e.g., plain text saved before encryption was enabled)
      return text;
    }
  }
}
