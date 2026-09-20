import { ConfigService } from '@/config/config.service';
import { PrismaService } from '@/helper/prisma.service';
import { BcryptService } from '@/utils/bcrypt.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GlobalRole, Prisma, UserStatus } from '@prisma/client';

/**
 * Bootstraps the platform's single SUPER_ADMIN account.
 *
 * Runs once on every application start (Nest `OnModuleInit`, which fires after
 * PrismaService has connected). Behaviour is idempotent:
 *   - a SUPER_ADMIN already exists  -> skip, nothing is written
 *   - no SUPER_ADMIN exists         -> create one from SUPER_ADMIN_* env vars
 *
 * Credentials default to the values agreed for the platform owner
 * (euhan.dev@gmail.com / 123456) and can be overridden through the environment.
 */
@Injectable()
export class SuperAdminInitService implements OnModuleInit {
  private readonly logger = new Logger(SuperAdminInitService.name);

  static readonly DEFAULT_EMAIL = 'euhan.dev@gmail.com';
  static readonly DEFAULT_PASSWORD = '123456';
  static readonly DEFAULT_NAME = 'Super Admin';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureSuperAdmin();
  }

  /**
   * Creates the SUPER_ADMIN if — and only if — the platform has none.
   * Returns a small result object so this can be asserted in tests.
   */
  async ensureSuperAdmin(): Promise<{ created: boolean; email: string; id?: string }> {
    const email = (this.configService.get('SUPER_ADMIN_EMAIL') || '').trim().toLowerCase() ||
      SuperAdminInitService.DEFAULT_EMAIL;
    const password =
      this.configService.get('SUPER_ADMIN_PASSWORD') || SuperAdminInitService.DEFAULT_PASSWORD;
    const name = this.configService.get('SUPER_ADMIN_NAME') || SuperAdminInitService.DEFAULT_NAME;
    const contactNo = (this.configService.get('SUPER_ADMIN_CONTACT_NO') || '').trim() || undefined;

    try {
      // 1️⃣ Does a super admin already exist? Match on role, not on email —
      //    a renamed/re-emailed super admin still counts as "one exists".
      const existing = await this.prisma.user.findFirst({
        where: { role: GlobalRole.SUPER_ADMIN },
        select: { id: true, email: true },
      });

      if (existing) {
        this.logger.log(`✅ SUPER_ADMIN already exists (${existing.email}) — skipping creation.`);
        return { created: false, email: existing.email, id: existing.id };
      }

      // 2️⃣ None exists — create it.
      const created = await this.prisma.user.create({
        data: {
          email,
          name,
          contactNo,
          password: await this.bcryptService.hash(password),
          role: GlobalRole.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
        },
        select: { id: true, email: true },
      });

      this.logger.log(`🚀 SUPER_ADMIN created successfully (${created.email}).`);
      return { created: true, email: created.email, id: created.id };
    } catch (error) {
      // Two instances booting at once: the unique index on `email` lets exactly
      // one win. The loser treats P2002 as "already exists", not as a failure.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        this.logger.log('✅ SUPER_ADMIN was created concurrently by another instance — skipping.');
        return { created: false, email };
      }

      this.logger.error('❌ Failed to bootstrap SUPER_ADMIN', (error as Error)?.stack);
      return { created: false, email };
    }
  }
}
