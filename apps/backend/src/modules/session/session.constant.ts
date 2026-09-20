import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const sessionFilterFields: (keyof Prisma.TableSessionFieldRefs)[] = [
  'branchId',
  'tableId',
  'joinCode',
  'status',
  'openedByStaffId',
  'closedByStaffId',
];

export const sessionSearchFields: (keyof Prisma.TableSessionFieldRefs)[] = [
  'joinCode',
];

export const sessionNestedFilters: NestedFilter[] = [];

export const sessionRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'startedAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const sessionInclude: Prisma.TableSessionInclude = {
  table: true,
  guestSessions: true,
};
