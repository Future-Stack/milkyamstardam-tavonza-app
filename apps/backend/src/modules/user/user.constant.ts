import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const userFilterFields: (keyof Prisma.UserFieldRefs)[] = [
  'contactNo',
  'email',
  'role',
  'status',
];

export const userSearchFields: (keyof Prisma.UserFieldRefs)[] = ['contactNo', 'email', 'name'];

export const userNestedFilters: NestedFilter[] = [];

export const userRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const userInclude: Prisma.UserInclude = {
  customer: true,
};
