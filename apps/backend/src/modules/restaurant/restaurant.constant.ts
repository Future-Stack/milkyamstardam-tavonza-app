import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const restaurantFilterFields: (keyof Prisma.RestaurantFieldRefs)[] = [
  'organizationId',
  'name',
  'slug',
  'isActive',
];

export const restaurantSearchFields: (keyof Prisma.RestaurantFieldRefs)[] = [
  'name',
  'slug',
  'description',
];

export const restaurantNestedFilters: NestedFilter[] = [];

export const restaurantRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const restaurantInclude: Prisma.RestaurantInclude = {
  branches: true,
};
