import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const organizationFilterFields: (keyof Prisma.OrganizationFieldRefs)[] = ['name', 'slug', 'ownerId'];

export const organizationSearchFields: (keyof Prisma.OrganizationFieldRefs)[] = ['name', 'slug'];

export const organizationNestedFilters: NestedFilter[] = [];

export const organizationRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];
