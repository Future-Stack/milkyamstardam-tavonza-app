/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';

// Define the models and their configurations
const models = [
  // 1-to-1 relationships
  {
    name: 'PersonalInformation',
    type: '1-1',
    hasFile: false,
    encryptFields: ['socialSecurityNumber'],
  },
  { name: 'WillInformation', type: '1-1', hasFile: false, encryptFields: [] },
  { name: 'LivingWillInformation', type: '1-1', hasFile: false, encryptFields: [] },
  { name: 'PowerOfAttorneyInformation', type: '1-1', hasFile: false, encryptFields: [] },
  { name: 'FuneralPreferences', type: '1-1', hasFile: false, encryptFields: [] },
  { name: 'CemeteryInformation', type: '1-1', hasFile: false, encryptFields: [] },
  {
    name: 'SocialSecurityInformation',
    type: '1-1',
    hasFile: false,
    encryptFields: ['accountNumber'],
  },

  // 1-to-N relationships
  { name: 'VeteranBenefits', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'Dependent', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'Pet', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'PersonalWish', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'ContactToInform', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'Doctor', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'Employer', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'PersonalEffect', type: '1-N', hasFile: false, encryptFields: [] },
  {
    name: 'LiquidAsset',
    type: '1-N',
    hasFile: false,
    encryptFields: ['accountNumber', 'routingNumber'],
  },
  { name: 'NonLiquidAsset', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'PersonalPaper', type: '1-N', hasFile: true, encryptFields: [] },
  { name: 'ExecutorBeneficiaryTrustee', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'Attorney', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'LifeInsurance', type: '1-N', hasFile: false, encryptFields: ['policyNumber'] },
  { name: 'RetirementAccount', type: '1-N', hasFile: false, encryptFields: ['loginCredentials'] },
  {
    name: 'CheckingAccount',
    type: '1-N',
    hasFile: false,
    encryptFields: ['accountNumber', 'loginCredentials'],
  },
  {
    name: 'SavingsAccount',
    type: '1-N',
    hasFile: false,
    encryptFields: ['accountNumber', 'loginCredentials'],
  },
  { name: 'SafeDepositBox', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'InvestmentAccount', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'Property', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'HealthInsurance', type: '1-N', hasFile: false, encryptFields: ['policyNumber'] },
  { name: 'OtherInsurance', type: '1-N', hasFile: false, encryptFields: ['policyNumber'] },
  { name: 'Bill', type: '1-N', hasFile: false, encryptFields: ['accountNumber'] },
  { name: 'AutoDeduction', type: '1-N', hasFile: false, encryptFields: ['sourceNumber'] },
  { name: 'Card', type: '1-N', hasFile: false, encryptFields: ['accountNumber'] },
  { name: 'Loan', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'StorageUnit', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'TaxReturn', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'Lease', type: '1-N', hasFile: false, encryptFields: [] },
  { name: 'Warranty', type: '1-N', hasFile: false, encryptFields: ['policyNumber'] },
];

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function generateControllerTemplate(model) {
  const { name, type, hasFile } = model;
  const kebab = toKebabCase(name);
  const camel = toCamelCase(name);

  const fileInterceptorImports = hasFile
    ? `
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileInterceptorInmemory } from '@/helper/file_interceptor_inmemorty';
import { ParseFormDataInterceptor } from '@/helper/form_data_interceptor';
import { FileService } from '@/helper/file.service';`
    : '';

  const uploadLogicParams = hasFile
    ? `, @UploadedFiles() files: Record<string, Express.Multer.File[]>`
    : '';
  const uploadLogicBody = hasFile
    ? `
    let fileUrl: string | undefined;
    const uploadableFile = files?.avatar || files?.file || files?.url;
    if (Array.isArray(uploadableFile) && uploadableFile.length > 0) {
      const uploaded = await this.fileService.uploadMultipleToCloudinary(uploadableFile);
      fileUrl = uploaded[0];
      (payload as any).url = fileUrl; // Assigning uploaded URL to expected field (adjust property name if needed)
    }
  `
    : '';

  const constructorInjection = hasFile
    ? `constructor(private readonly ${camel}Service: ${name}Service, private readonly fileService: FileService) {}`
    : `constructor(private readonly ${camel}Service: ${name}Service) {}`;

  if (type === '1-1') {
    return `import { Controller, Get, Put, Body, Delete, HttpStatus, Req } from '@nestjs/common';
import { ${name}Service } from './${kebab}.service';
import { Create${name}Dto } from './dto/create-${kebab}.dto';
import { Update${name}Dto } from './dto/update-${kebab}.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { Request } from 'express';${fileInterceptorImports}

@Controller('${kebab}s')
export class ${name}Controller {
  ${constructorInjection}

  @Put()
  @Roles(Role.CUSTOMER, Role.SUPER_ADMIN, Role.ADMIN)
  ${hasFile ? `@UseInterceptors(FileInterceptorInmemory([{ name: 'avatar', maxCount: 1 }, { name: 'file', maxCount: 1 }, { name: 'url', maxCount: 1 }]), ParseFormDataInterceptor)` : ''}
  async upsert(@Req() req: Request, @Body() payload: Create${name}Dto | Update${name}Dto${uploadLogicParams}) {
    ${uploadLogicBody}
    const result = await this.${camel}Service.upsert(req, payload);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: '${name} saved successfully',
      data: result,
    });
  }

  @Get('all')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findAll(@Req() req: Request) {
    const result = await this.${camel}Service.findAll(req);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: '${name}s retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.EXECUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  async findOne(@Req() req: Request) {
    const result = await this.${camel}Service.findOneByCustomer(req);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: '${name} retrieved successfully',
      data: result,
    });
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async remove(@Req() req: Request) {
    // Only Admin
    const id = req.params.id;
    const result = await this.${camel}Service.remove(id);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: '${name} deleted successfully',
      data: result,
    });
  }
}
`;
  } else {
    // 1-to-N
    return `import { Controller, Get, Post, Patch, Body, Param, Delete, HttpStatus, Req } from '@nestjs/common';
import { ${name}Service } from './${kebab}.service';
import { Create${name}Dto } from './dto/create-${kebab}.dto';
import { Update${name}Dto } from './dto/update-${kebab}.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseService } from '@/utils/response';
import { Request } from 'express';${fileInterceptorImports}

@Controller('${kebab}s')
export class ${name}Controller {
  ${constructorInjection}

  @Post()
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN)
  ${hasFile ? `@UseInterceptors(FileInterceptorInmemory([{ name: 'avatar', maxCount: 1 }, { name: 'file', maxCount: 1 }, { name: 'url', maxCount: 1 }]), ParseFormDataInterceptor)` : ''}
  async create(@Req() req: Request, @Body() payload: Create${name}Dto${uploadLogicParams}) {
    ${uploadLogicBody}
    const result = await this.${camel}Service.create(req, payload);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.CREATED,
      message: '${name} created successfully',
      data: result,
    });
  }

  @Get()
  @Roles(Role.CUSTOMER, Role.EXECUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  async findAll(@Req() req: Request) {
    const result = await this.${camel}Service.findAll(req);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: '${name}s retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, Role.EXECUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const result = await this.${camel}Service.findOne(id, req);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: '${name} retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN)
  ${hasFile ? `@UseInterceptors(FileInterceptorInmemory([{ name: 'avatar', maxCount: 1 }, { name: 'file', maxCount: 1 }, { name: 'url', maxCount: 1 }]), ParseFormDataInterceptor)` : ''}
  async update(@Param('id') id: string, @Req() req: Request, @Body() payload: Update${name}Dto${uploadLogicParams}) {
    ${uploadLogicBody}
    const result = await this.${camel}Service.update(id, req, payload);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: '${name} updated successfully',
      data: result,
    });
  }

  @Delete(':id')
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN)
  async remove(@Param('id') id: string, @Req() req: Request) {
    const result = await this.${camel}Service.remove(id, req);
    return ResponseService.formatResponse({
      statusCode: HttpStatus.OK,
      message: '${name} deleted successfully',
      data: result,
    });
  }
}
`;
  }
}

function generateServiceTemplate(model) {
  const { name, type, encryptFields } = model;
  const kebab = toKebabCase(name);
  const camel = toCamelCase(name);

  let encryptionHook = '';
  let decryptionHook = '';
  if (encryptFields.length > 0) {
    encryptionHook = `
    const encryptFields = ${JSON.stringify(encryptFields)};
    for (const field of encryptFields) {
      if ((payload as any)[field]) {
        (payload as any)[field] = this.encryptionService.encrypt((payload as any)[field]);
      }
    }
    `;
    decryptionHook = `
    if (result) {
      const encryptFields = ${JSON.stringify(encryptFields)};
      if (Array.isArray(result)) {
        result.forEach((item: any) => {
          for (const field of encryptFields) {
            if (item[field]) item[field] = this.encryptionService.decrypt(item[field]);
          }
        });
      } else {
        const item: any = result;
        for (const field of encryptFields) {
          if (item[field]) item[field] = this.encryptionService.decrypt(item[field]);
        }
      }
    }
    `;
  }

  const constructorInjection =
    encryptFields.length > 0
      ? `constructor(private prisma: PrismaService, private encryptionService: EncryptionService) {}`
      : `constructor(private prisma: PrismaService) {}`;

  const encryptionImport =
    encryptFields.length > 0
      ? `import { EncryptionService } from '@/utils/encryption.service';\n`
      : '';

  return `import { HttpStatus, Injectable } from '@nestjs/common';
import { Create${name}Dto } from './dto/create-${kebab}.dto';
import { Update${name}Dto } from './dto/update-${kebab}.dto';
import { PrismaService } from '@/helper/prisma.service';
import { Request } from 'express';
${encryptionImport}import {
  ${camel}FilterFields,
  ${camel}Include,
  ${camel}NestedFilters,
  ${camel}SearchFields,
} from './${kebab}.constant';
import QueryBuilder from '@/utils/query_builder';
import { ApiError } from '@/utils/api_error';

@Injectable()
export class ${name}Service {
  ${constructorInjection}

  // Get customer id based on logged in user or executor
  private async getCustomerId(req: Request): Promise<string | null> {
    const user: any = req?.user;
    if (!user) throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        // If admin is querying, maybe they passed customerId in query, otherwise return undefined to signify no customer scoping
        return req.query?.customerId as string || null;
    }

    if (user.role === 'EXECUTOR') {
      const executor = await this.prisma.executor.findUnique({ where: { userId: user.id } });
      if (!executor) throw new ApiError(HttpStatus.NOT_FOUND, 'Executor profile not found');
      // In real scenario, wait, an executor might have multiple customers. 
      // Executor queries usually contain the customerId in query params. 
      // Ensure the grantedExecutor check passes.
      const targetCustomerId = req.query?.customerId as string;
      if (!targetCustomerId) throw new ApiError(HttpStatus.BAD_REQUEST, 'Customer ID must be provided for executor queries');
      const granted = await this.prisma.grantedExecutor.findUnique({ where: { executorId_customerId: { executorId: executor.id, customerId: targetCustomerId } }});
      if (!granted) throw new ApiError(HttpStatus.FORBIDDEN, 'Access denied for this customer');
      return targetCustomerId;
    }

    // Default: Customer itself
    const customer = await this.prisma.customer.findUnique({ where: { userId: user.id } });
    if (!customer) throw new ApiError(HttpStatus.NOT_FOUND, 'Customer profile not found');
    return customer.id;
  }

  ${
    type === '1-1'
      ? `
  async upsert(req: Request, payload: Create${name}Dto | Update${name}Dto) {
    const customerId = await this.getCustomerId(req);
    if (!customerId) throw new ApiError(HttpStatus.BAD_REQUEST, 'Customer ID is required');
    
    ${encryptionHook}

    const isExist = await (this.prisma.${camel} as any).findUnique({ where: { customerId } });
    const result = isExist 
      ? await (this.prisma.${camel} as any).update({ where: { customerId }, data: payload })
      : await (this.prisma.${camel} as any).create({ data: { ...payload, customerId } as any });
      
    ${decryptionHook}
    return result;
  }

  async findOneByCustomer(req: Request) {
    const customerId = await this.getCustomerId(req);
    if (!customerId) throw new ApiError(HttpStatus.BAD_REQUEST, 'Customer ID is required');

    const result = await (this.prisma.${camel} as any).findUnique({ where: { customerId } });
    if (!result) return null;

    ${decryptionHook}
    return result;
  }
  `
      : `
  async create(req: Request, payload: Create${name}Dto) {
    const customerId = await this.getCustomerId(req);
    if (!customerId) throw new ApiError(HttpStatus.BAD_REQUEST, 'Customer ID is required');

    ${encryptionHook}

    const result = await (this.prisma.${camel} as any).create({
      data: { ...payload, customerId } as any,
    });
    ${decryptionHook}
    return result;
  }

  async findOne(id: string, req: Request) {
    const customerId = await this.getCustomerId(req);
    const where: any = { id };
    if (customerId) where.customerId = customerId;

    const result = await (this.prisma.${camel} as any).findFirst({ where });
    if (!result) throw new ApiError(HttpStatus.NOT_FOUND, '${name} not found');

    ${decryptionHook}
    return result;
  }

  async update(id: string, req: Request, payload: Update${name}Dto) {
    const customerId = await this.getCustomerId(req);
    const where: any = { id };
    if (customerId) where.customerId = customerId;

    const isExist = await (this.prisma.${camel} as any).findFirst({ where });
    if (!isExist) throw new ApiError(HttpStatus.NOT_FOUND, '${name} not found or access denied');

    ${encryptionHook}

    const result = await (this.prisma.${camel} as any).update({
      where: { id },
      data: payload,
    });

    ${decryptionHook}
    return result;
  }
  `
  }

  async findAll(req: Request) {
    const customerId = await this.getCustomerId(req);
    const query = req.query;

    const queryBuilder = new QueryBuilder(query, this.prisma.${camel});
    let qb = queryBuilder
      .filter(${camel}FilterFields)
      .search(${camel}SearchFields)
      .nestedFilter(${camel}NestedFilters)
      .sort()
      .paginate()
      .fields()
      .include(${camel}Include)
      .rawFilter(customerId ? { customerId } : {});

    const result = await qb.execute();
    const meta = await qb.countTotal();

    ${decryptionHook}
    
    return { meta, data: result };
  }

  async remove(${type === '1-1' ? 'id: string' : 'id: string, req: Request'}) {
    ${
      type === '1-N'
        ? `
    const customerId = await this.getCustomerId(req);
    const where: any = { id };
    if (customerId) where.customerId = customerId;

    const isExist = await (this.prisma.${camel} as any).findFirst({ where });
    if (!isExist) throw new ApiError(HttpStatus.NOT_FOUND, '${name} not found or access denied');
    `
        : `
    const isExist = await (this.prisma.${camel} as any).findUnique({ where: { id } });
    if (!isExist) throw new ApiError(HttpStatus.NOT_FOUND, '${name} not found');
    `
    }

    return await (this.prisma.${camel} as any).delete({ where: { id } });
  }
}
`;
}

function generateModuleTemplate(model) {
  const { name } = model;
  const kebab = toKebabCase(name);
  const camel = toCamelCase(name);

  return `import { Module } from '@nestjs/common';
import { ${name}Service } from './${kebab}.service';
import { ${name}Controller } from './${kebab}.controller';
import { PrismaModule } from '@/helper/prisma.module';
import { EncryptionService } from '@/utils/encryption.service';
import { FileService } from '@/helper/file.service';

@Module({
  imports: [PrismaModule],
  controllers: [${name}Controller],
  providers: [${name}Service, EncryptionService, FileService],
})
export class ${name}Module {}
`;
}

function generateConstantTemplate(model) {
  const { name } = model;
  const camel = toCamelCase(name);

  return `export const ${camel}SearchFields: string[] = [];
export const ${camel}FilterFields: string[] = [];
export const ${camel}NestedFilters: any[] = [];
export const ${camel}Include: Record<string, boolean> = {};
`;
}

function generateCreateDtoTemplate(model) {
  const { name } = model;
  return `export class Create${name}Dto {}`;
}

function generateUpdateDtoTemplate(model) {
  const { name } = model;
  const kebab = toKebabCase(name);
  return `import { PartialType } from '@nestjs/swagger';
import { Create${name}Dto } from './create-${kebab}.dto';

export class Update${name}Dto extends PartialType(Create${name}Dto) {}`;
}

async function run() {
  const baseDir = path.join(process.cwd(), 'src', 'modules');
  const appModulePath = path.join(process.cwd(), 'src', 'app', 'app.module.ts');
  let appModuleContent = fs.readFileSync(appModulePath, 'utf8');

  for (const model of models) {
    const { name } = model;
    const kebab = toKebabCase(name);
    const moduleDir = path.join(baseDir, kebab);

    // Create directories
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.mkdirSync(path.join(moduleDir, 'dto'), { recursive: true });

    // Write files
    fs.writeFileSync(
      path.join(moduleDir, kebab + '.controller.ts'),
      generateControllerTemplate(model),
    );
    fs.writeFileSync(path.join(moduleDir, kebab + '.service.ts'), generateServiceTemplate(model));
    fs.writeFileSync(path.join(moduleDir, kebab + '.module.ts'), generateModuleTemplate(model));
    fs.writeFileSync(path.join(moduleDir, kebab + '.constant.ts'), generateConstantTemplate(model));
    fs.writeFileSync(
      path.join(moduleDir, 'dto', 'create-' + kebab + '.dto.ts'),
      generateCreateDtoTemplate(model),
    );
    fs.writeFileSync(
      path.join(moduleDir, 'dto', 'update-' + kebab + '.dto.ts'),
      generateUpdateDtoTemplate(model),
    );

    // Check if module is imported in app.module.ts
    const importStatement =
      'import { ' + name + "Module } from '@/modules/" + kebab + '/' + kebab + ".module';";
    if (!appModuleContent.includes(importStatement)) {
      // Find imports block
      const lastImportIndex = appModuleContent.lastIndexOf('import ');
      const insertIdx = appModuleContent.indexOf('\\n', lastImportIndex) + 1;
      appModuleContent =
        appModuleContent.slice(0, insertIdx) +
        importStatement +
        '\\n' +
        appModuleContent.slice(insertIdx);

      // Add to imports array
      const importsArrayIndex = appModuleContent.indexOf('imports: [');
      if (importsArrayIndex > -1) {
        const insertArrayIdx = appModuleContent.indexOf('[', importsArrayIndex) + 1;
        appModuleContent =
          appModuleContent.slice(0, insertArrayIdx) +
          '\\n    ' +
          name +
          'Module,' +
          appModuleContent.slice(insertArrayIdx);
      }
    }

    console.log('+ Generated module: ' + name);
  }

  // Rewrite app.module.ts
  fs.writeFileSync(appModulePath, appModuleContent);
  console.log('AppModule updated successfully!');
}

run();
