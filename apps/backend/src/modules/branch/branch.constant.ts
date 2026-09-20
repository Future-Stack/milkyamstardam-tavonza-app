import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const branchFilterFields: (keyof Prisma.BranchFieldRefs)[] = [
  'restaurantId',
  'name',
  'phone',
  'timezone',
  'isActive',
];

export const branchSearchFields: (keyof Prisma.BranchFieldRefs)[] = [
  'name',
  'phone',
  'timezone',
];

export const branchNestedFilters: NestedFilter[] = [];

export const branchRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const branchInclude: Prisma.BranchInclude = {
  restaurant: true,
};
