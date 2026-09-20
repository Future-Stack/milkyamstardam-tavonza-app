const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.spec.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const missingImports = [];
      if (!content.includes('PrismaService')) missingImports.push(`import { PrismaService } from '@/helper/prisma.service';`);
      if (!content.includes('AuditLogService')) missingImports.push(`import { AuditLogService } from '@/modules/audit-log/audit-log.service';`);
      if (!content.includes('ConfigService')) missingImports.push(`import { ConfigService } from '@/config/config.service';`);
      if (!content.includes('OrderService')) missingImports.push(`import { OrderService } from '@/modules/order/order.service';`);
      if (!content.includes('PaymentService')) missingImports.push(`import { PaymentService } from '@/modules/payment/payment.service';`);
      if (!content.includes('SessionService')) missingImports.push(`import { SessionService } from '@/modules/session/session.service';`);
      if (!content.includes('TableService')) missingImports.push(`import { TableService } from '@/modules/table/table.service';`);
      if (!content.includes('RestaurantService')) missingImports.push(`import { RestaurantService } from '@/modules/restaurant/restaurant.service';`);
      if (!content.includes('BranchService')) missingImports.push(`import { BranchService } from '@/modules/branch/branch.service';`);
      if (!content.includes('BranchSettingsService')) missingImports.push(`import { BranchSettingsService } from '@/modules/branch-settings/branch-settings.service';`);
      if (!content.includes('MenuService')) missingImports.push(`import { MenuService } from '@/modules/menu/menu.service';`);
      if (!content.includes('StaffService')) missingImports.push(`import { StaffService } from '@/modules/staff/staff.service';`);
      if (!content.includes('OrganizationService')) missingImports.push(`import { OrganizationService } from '@/modules/organization/organization.service';`);
      
      // We just mock everything needed
      const mockProviders = `
        { provide: PrismaService, useValue: {} },
        { provide: AuditLogService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: OrderService, useValue: {} },
        { provide: PaymentService, useValue: {} },
        { provide: SessionService, useValue: {} },
        { provide: TableService, useValue: {} },
        { provide: RestaurantService, useValue: {} },
        { provide: BranchService, useValue: {} },
        { provide: BranchSettingsService, useValue: {} },
        { provide: MenuService, useValue: {} },
        { provide: StaffService, useValue: {} },
        { provide: OrganizationService, useValue: {} },
      `;

      if (content.includes('providers: [')) {
        content = content.replace(/providers: \[([^\]]+)\]/, (match, p1) => {
          return `providers: [${p1}, ${mockProviders}]`;
        });
      }
      
      if (content.includes('controllers: [')) {
        // for controllers, we need to add providers if they don't exist
        if (!content.includes('providers: [')) {
           content = content.replace(/(controllers: \[[^\]]+\]),?/, `$1, providers: [${mockProviders}]`);
        }
      }

      // Add imports at the top
      content = missingImports.join('\n') + '\n' + content;
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(path.join(__dirname, 'src/modules'));
