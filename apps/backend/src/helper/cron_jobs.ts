import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CronJob } from 'cron';
import { PrismaService } from './prisma.service';

@Injectable()
export class CronJobService implements OnModuleInit, OnModuleDestroy {
  private jobs: CronJob[] = [];

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // 1️⃣ Job: Daily midnight in Sweden (Europe/Stockholm)
    const dailyJob = new CronJob(
      '0 0 0 * * *',
      async () => {
        console.log('🔄 Daily Cron job started (Sweden Timezone)');
        await this.handleUpcomingTasks();
        console.log('✅ Daily Cron job finished');
      },
      null,
      true,
      'Europe/Stockholm',
    );

    // const threeTimesJob = new CronJob(
    //   '0 0 0,8,16 * * *', // at 00:00, 08:00, 16:00 UTC
    //   async () => {
    //     console.log('🔄 Three-times-daily job started (UTC)');
    //     await this.handleCustomerSubcriptionExpiration();
    //     console.log('✅ Three-times-daily job finished');
    //   },
    //   null,
    //   true,
    //   'UTC',
    // );

    // store jobs so we can stop them later
    this.jobs.push(dailyJob);
  }

  onModuleDestroy() {
    this.jobs.forEach((job) => job.stop());
  }

  private async handleUpcomingTasks() {
    // your custom logic here
    console.log('📌 handling upcoming tasks...');
  }

  // private async handleCustomerSubcriptionExpiration() {
  //   const nowUtc = new Date(); // already UTC internally
  //   await this.prisma.customerSubscription.updateMany({
  //     where: { AND: [{ expiresAt: { lte: nowUtc } }] }, // should be lte for expiration
  //     data: { subscriptionStatus: 'EXPIRED' },
  //   });
  //   console.log('📌 expired subscriptions updated');
  // }
}
