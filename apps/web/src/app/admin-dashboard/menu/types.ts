export type MenuCategory =
  | 'All'
  | 'Sweet'
  | 'Savory'
  | 'Pancake'
  | 'Coffee'
  | 'Drinks'
  | 'Burgers'
  | 'Pizza'
  | 'Pasta'
  | 'Salads'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  costPrice?: number;
  marginPercent: number;
  soldToday: number;
  isActive: boolean;
  image: string;
  description?: string;
}

export interface MenuStats {
  totalItems: number;
  activeItems: number;
  hiddenItems: number;
  totalRevenue: string;
  avgMargin: number;
}
