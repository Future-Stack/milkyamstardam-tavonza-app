import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const customerFilterFields: (keyof Prisma.UserFieldRefs)[] = ['email', 'status', 'role'];

export const customerSearchFields: (keyof Prisma.UserFieldRefs)[] = ['email', 'contactNo'];

export const customerNestedFilters: NestedFilter[] = [
  {
    key: 'customer',
    searchOption: 'search',
    queryFields: ['loyaltyPoints'], // just a valid field for example
  },
];

export const customerRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const customerInclude: Prisma.UserInclude = {
  customer: true,
};
