import { NestedFilter, rangeFilteringPrams } from '@/utils/query_builder';
import { Prisma } from '@prisma/client';

// ----------------------------------------------------
// Menu Categories
// ----------------------------------------------------
export const menuCategoryFilterFields: (keyof Prisma.MenuCategoryFieldRefs)[] = [
  'restaurantId',
  'name',
  'isActive',
];

export const menuCategorySearchFields: (keyof Prisma.MenuCategoryFieldRefs)[] = [
  'name',
  'description',
];

export const menuCategoryNestedFilters: NestedFilter[] = [];

export const menuCategoryRangeFilter: rangeFilteringPrams[] = [];

export const menuCategoryInclude: Prisma.MenuCategoryInclude = {
  menuItems: true,
};

// ----------------------------------------------------
// Menu Items
// ----------------------------------------------------
export const menuItemFilterFields: (keyof Prisma.MenuItemFieldRefs)[] = [
  'restaurantId',
  'categoryId',
  'name',
  'isAvailable',
  'isVegetarian',
  'spiceLevel',
];

export const menuItemSearchFields: (keyof Prisma.MenuItemFieldRefs)[] = [
  'name',
  'description',
];

export const menuItemNestedFilters: NestedFilter[] = [];

export const menuItemRangeFilter: rangeFilteringPrams[] = [
  {
    field: 'basePrice',
    maxQueryKey: 'maxPrice',
    minQueryKey: 'minPrice',
    dataType: 'number',
  },
  {
    field: 'createdAt',
    maxQueryKey: 'maxDate',
    minQueryKey: 'minDate',
    dataType: 'date',
  },
];

export const menuItemInclude: Prisma.MenuItemInclude = {
  category: true,
  modifierGroups: {
    include: { modifiers: true },
  },
};
