import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const paymentFilterFields: (keyof Prisma.PaymentFieldRefs)[] = [
  'orderId',
  'tableSessionId',
  'payerGuestSessionId',
  'scope',
  'method',
  'status',
  'settledById',
  'collectedById',
];

export const paymentSearchFields: (keyof Prisma.PaymentFieldRefs)[] = [
  'transactionRef',
  'refundRef',
];

export const paymentNestedFilters: NestedFilter[] = [];

export const paymentRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'amount',
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
  {
    field: 'paidAt',
    maxQueryKey: 'maxPaidDate',
    minQueryKey: 'minPaidDate',
    dataType: 'date',
  },
];

export const paymentInclude: Prisma.PaymentInclude = {
  allocations: true,
  order: true,
};
