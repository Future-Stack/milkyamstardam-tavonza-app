import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const orderFilterFields: (keyof Prisma.OrderFieldRefs)[] = [
  'branchId',
  'tableId',
  'customerId',
  'tableSessionId',
  'guestSessionId',
  'channel',
  'status',
  'paymentStatus',
  'acceptanceMode',
  'acceptedById',
];

export const orderSearchFields: (keyof Prisma.OrderFieldRefs)[] = [
  'orderNumber',
];

export const orderNestedFilters: NestedFilter[] = [];

export const orderRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'totalAmount',
    maxQueryKey: 'maxAmount',
    minQueryKey: 'minAmount',
    dataType: 'number',
  },
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const orderInclude: Prisma.OrderInclude = {
  orderItems: true,
  table: true,
  customer: true,
};
