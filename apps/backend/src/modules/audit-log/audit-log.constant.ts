import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const auditLogFilterFields: (keyof Prisma.AuditLogFieldRefs)[] = [
  'branchId',
  'actorId',
  'action',
  'entityType',
  'entityId',
];

export const auditLogSearchFields: (keyof Prisma.AuditLogFieldRefs)[] = [
  'action',
  'entityType',
];

export const auditLogNestedFilters: NestedFilter[] = [];

export const auditLogRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'endDate',
    minQueryKey: 'startDate',
    dataType: 'date',
  },
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const auditLogInclude: Prisma.AuditLogInclude = {
  actor: {
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
    },
  },
};
