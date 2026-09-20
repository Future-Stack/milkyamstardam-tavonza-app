import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

export const adminFilterFields: (keyof Prisma.UserFieldRefs)[] = ['contactNo', 'email', 'status'];

export const adminSearchFields: (keyof Prisma.UserFieldRefs)[] = ['contactNo', 'email', 'name'];

export const adminNestedFilters: NestedFilter[] = [];

export const adminRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

/** Never leak the password hash; always surface the auto-created organization and admin intro. */
export const adminSelect = {
  id: true,
  email: true,
  name: true,
  contactNo: true,
  role: true,
  status: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
  ownedOrganizations: {
    select: { id: true, name: true, ownerId: true, createdAt: true },
  },
  admin: {
    select: { intro: true },
  },
} satisfies Prisma.UserSelect;

export const adminInclude: Prisma.UserInclude = {
  ownedOrganizations: {
    select: { id: true, name: true, ownerId: true, createdAt: true },
  },
  admin: {
    select: { intro: true },
  },
};
