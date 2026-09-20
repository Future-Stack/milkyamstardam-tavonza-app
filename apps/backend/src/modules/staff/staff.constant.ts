import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

// ----------------------------------------------------
// Users (in Staff context)
// ----------------------------------------------------
export const staffUserFilterFields: (keyof Prisma.UserFieldRefs)[] = [
  'role',
  'status',
  'email',
  'contactNo',
];

export const staffUserSearchFields: (keyof Prisma.UserFieldRefs)[] = [
  'name',
  'email',
  'contactNo',
];

export const staffUserNestedFilters: NestedFilter[] = [];

export const staffUserRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const staffUserInclude: Prisma.UserInclude = {
  staff: true,
};

// ----------------------------------------------------
// Staff Assignments
// ----------------------------------------------------
export const staffAssignmentFilterFields: (keyof Prisma.StaffAssignmentFieldRefs)[] = [
  'branchId',
  'staffId',
  'role',
  'isActive',
];

export const staffAssignmentSearchFields: (keyof Prisma.StaffAssignmentFieldRefs)[] = [];

export const staffAssignmentNestedFilters: NestedFilter[] = [
  {
    key: 'staff.user',
    searchOption: 'search',
    queryFields: ['searchTerm'],
    fieldMap: {
      searchTerm: 'name',
    },
  },
];

export const staffAssignmentRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const staffAssignmentInclude: Prisma.StaffAssignmentInclude = {
  staff: {
    include: {
      user: true,
    },
  },
  branch: true,
};
