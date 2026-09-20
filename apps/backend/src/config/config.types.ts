// config.types.ts

export interface EnvConfig {
  PORT: string;
  NODE_ENV: string;

  DATABASE_URL: string;

  SERVER_URL: string;
  ENCRYPTION_KEY: string;

  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_NAME: string;
  SUPER_ADMIN_CONTACT_NO: string;

  DEFAULT_ADMIN_EMAIL: string;
  DEFAULT_ADMIN_PASSWORD: string;
  DEFAULT_ADMIN_CONTACT_NO: string;

  DEFAULT_EXECUTOR_EMAIL: string;
  DEFAULT_EXECUTOR_PASSWORD: string;
  DEFAULT_EXECUTOR_CONTACT_NO: string;

  DEFAULT_CUSTOMER_EMAIL: string;
  DEFAULT_CUSTOMER_PASSWORD: string;
  DEFAULT_CUSTOMER_CONTACT_NO: string;

  BCRYPT_SALT_ROUNDS: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;

  CLIENT_URL: string;

  SESSION_SECRET: string;
  COOKIE_DOMAIN: string;

  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_CLOUD_NAME: string;

  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM: string;

  BREVO_API_KEY: string;

  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  SES_FROM_EMAIL: string;
  AWS_S3_BUCKET_NAME: string;
  AWS_S3_BUCKET_ENDPOINT: string;
}

// config.types.ts (continued)

export type EnvKey = keyof EnvConfig;
