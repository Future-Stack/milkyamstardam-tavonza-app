/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';

const dmmfModels = Prisma.dmmf.datamodel.models;

const modelsList = [
  'PersonalInformation',
  'WillInformation',
  'LivingWillInformation',
  'PowerOfAttorneyInformation',
  'FuneralPreferences',
  'CemeteryInformation',
  'SocialSecurityInformation',
  'VeteranBenefits',
  'Dependent',
  'Pet',
  'PersonalWish',
  'ContactToInform',
  'Doctor',
  'Employer',
  'PersonalEffect',
  'LiquidAsset',
  'NonLiquidAsset',
  'PersonalPaper',
  'ExecutorBeneficiaryTrustee',
  'Attorney',
  'LifeInsurance',
  'RetirementAccount',
  'CheckingAccount',
  'SavingsAccount',
  'SafeDepositBox',
  'InvestmentAccount',
  'Property',
  'HealthInsurance',
  'OtherInsurance',
  'Bill',
  'AutoDeduction',
  'Card',
  'Loan',
  'StorageUnit',
  'TaxReturn',
  'Lease',
  'Warranty',
];

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const omitDtoFields = ['id', 'createdAt', 'updatedAt', 'customerId', 'userId'];

function getValidationDecorator(type, isList) {
  let decorators = [];
  if (isList) decorators.push('@IsArray()');
  switch (type) {
    case 'String':
      decorators.push('@IsString()');
      break;
    case 'Int':
    case 'Float':
      decorators.push('@IsNumber()');
      break;
    case 'Boolean':
      decorators.push('@IsBoolean()');
      break;
    case 'DateTime':
      decorators.push('@IsDate()', '@Type(() => Date)');
      break;
    default:
      // Enums or untracked scalar
      decorators.push('@IsString()');
      break;
  }
  return decorators;
}

function getTypeScriptType(type, isList) {
  let tsType = '';
  switch (type) {
    case 'String':
      tsType = 'string';
      break;
    case 'Int':
    case 'Float':
      tsType = 'number';
      break;
    case 'Boolean':
      tsType = 'boolean';
      break;
    case 'DateTime':
      tsType = 'Date';
      break;
    default:
      tsType = 'string';
      break; // Assuming Enum is imported as string or omitted
  }
  return isList ? tsType + '[]' : tsType;
}

function generateDtoContent(modelName, dmmfModel) {
  let classBody = '';
  const usedValidators = new Set();
  let usesType = false;

  for (const field of dmmfModel.fields) {
    if (field.kind === 'object') continue; // omit relation payloads
    if (omitDtoFields.includes(field.name)) continue;

    const isOptional = !field.isRequired && !field.isList;

    // Custom DTO handling for relations pointing scalar representation
    if (field.name.endsWith('Id') && field.name !== 'customerId') {
      // example: documentId
      classBody += `  @IsOptional()\n`;
      classBody += `  @IsString()\n`;
      classBody += `  ${field.name}?: string | null;\n\n`;
      usedValidators.add('IsOptional');
      usedValidators.add('IsString');
      continue;
    }

    const decorators = getValidationDecorator(field.type, field.isList);
    const tsType = getTypeScriptType(field.type, field.isList);

    if (isOptional) decorators.unshift('@IsOptional()');

    for (const d of decorators) {
      const match = d.match(/@(\w+)\(/);
      if (match) {
        if (match[1] === 'Type') usesType = true;
        else usedValidators.add(match[1]);
      }
    }

    classBody += `  ${decorators.join('\n  ')}\n`;
    classBody += `  ${field.name}${isOptional ? '?' : ''}: ${tsType};\n\n`;
  }

  let importsStr = '';
  if (usedValidators.size > 0) {
    importsStr += `import { ${Array.from(usedValidators).join(', ')} } from 'class-validator';\n`;
  }
  if (usesType) {
    importsStr += `import { Type } from 'class-transformer';\n`;
  }

  return `${importsStr}\nexport class Create${modelName}Dto {\n${classBody}}\n`;
}

function generateConstantsContent(modelName, dmmfModel) {
  const camel = toCamelCase(modelName);

  // Extrapolate scalar fields
  const scalarFields = dmmfModel.fields.filter(
    (f) => f.kind === 'scalar' && f.name !== 'customerId' && f.name !== 'userId',
  );
  const stringFields = scalarFields.filter((f) => f.type === 'String');
  const objectFields = dmmfModel.fields.filter((f) => f.kind === 'object' && f.name !== 'customer');

  const filterFieldsStr = scalarFields.map((f) => `  '${f.name}',`).join('\n');
  const searchFieldsStr = stringFields.map((f) => `  '${f.name}',`).join('\n');
  const includesStr = objectFields.map((f) => `  ${f.name}: true,`).join('\n');

  return `import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

// Fields for basic filtering
export const ${camel}FilterFields: (keyof Prisma.${modelName}FieldRefs)[] = [
${filterFieldsStr}
];

// Fields for top-level search
export const ${camel}SearchFields: (keyof Prisma.${modelName}FieldRefs)[] = [
${searchFieldsStr}
];

// Nested filtering config
export const ${camel}NestedFilters: NestedFilter[] = [];

// Range-based filtering config
export const ${camel}RangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

// Prisma include configuration
export const ${camel}Include: Prisma.${modelName}Include = {
${includesStr}
};
`;
}

function run() {
  const baseDir = path.join(process.cwd(), 'src', 'modules');

  for (const modelName of modelsList) {
    const dmmfModel = dmmfModels.find((m) => m.name === modelName);
    if (!dmmfModel) {
      console.warn(`Model ${modelName} not found in DMMF!`);
      continue;
    }

    const kebab = toKebabCase(modelName);
    const moduleDir = path.join(baseDir, kebab);

    // Write Create DTO
    const createDtoContent = generateDtoContent(modelName, dmmfModel);
    fs.writeFileSync(path.join(moduleDir, 'dto', 'create-' + kebab + '.dto.ts'), createDtoContent);

    // Update DTO doesn't change from PartialType(CreateDto)

    // Write Constants
    const constantsContent = generateConstantsContent(modelName, dmmfModel);
    fs.writeFileSync(path.join(moduleDir, kebab + '.constant.ts'), constantsContent);

    console.log('+ Recreated DTOs and Constants for: ' + modelName);
  }

  console.log('Automated generation complete!');
}

try {
  run();
} catch (error) {
  console.error('Generator failed', error);
}
