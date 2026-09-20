import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

// ----------------------------------------------------
// Tables
// ----------------------------------------------------
export const tableFilterFields: (keyof Prisma.TableFieldRefs)[] = [
  'branchId',
  'label',
  'capacity',
  'serviceStatus',
  'operationalFlag',
  'shape',
  'floor',
];

export const tableSearchFields: (keyof Prisma.TableFieldRefs)[] = [
  'label',
];

export const tableNestedFilters: NestedFilter[] = [];

export const tableRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'capacity',
    maxQueryKey: 'maxCapacity',
    minQueryKey: 'minCapacity',
    dataType: 'number',
  },
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const tableInclude: Prisma.TableInclude = {
  branch: true,
};

// ----------------------------------------------------
// Reservations
// ----------------------------------------------------
export const reservationFilterFields: (keyof Prisma.ReservationFieldRefs)[] = [
  'branchId',
  'tableId',
  'customerId',
  'status',
  'guestName',
  'guestPhone',
  'partySize',
];

export const reservationSearchFields: (keyof Prisma.ReservationFieldRefs)[] = [
  'guestName',
  'guestPhone',
  'specialRequest',
];

export const reservationNestedFilters: NestedFilter[] = [];

export const reservationRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'reservedFor',
    maxQueryKey: 'endDate',
    minQueryKey: 'startDate',
    dataType: 'date',
  },
  {
    field: 'partySize',
    maxQueryKey: 'maxPartySize',
    minQueryKey: 'minPartySize',
    dataType: 'number',
  },
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const reservationInclude: Prisma.ReservationInclude = {
  table: true,
  customer: true,
};
