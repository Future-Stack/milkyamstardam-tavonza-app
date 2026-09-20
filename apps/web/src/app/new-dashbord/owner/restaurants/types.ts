export type RestaurantType = 'Restaurant' | 'Café' | 'Bar' | 'Fast Food' | 'Bakery';

export type RestaurantStatus = 'Open' | 'Closed' | 'Opening Soon';

export interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Manager {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  phone?: string;
}

export type StaffRole =
  | 'Manager'
  | 'Assistant Manager'
  | 'Kitchen Staff'
  | 'Bartender'
  | 'Delivery Staff'
  | 'Waiter'
  | 'Cashier';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole | string;
  avatar: string;
  email?: string;
  shift?: string;
  days?: string[];
  status?: 'Active' | 'On Leave';
  restaurantName?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  status: 'Available' | 'Out of Stock';
}

export interface RestaurantDetailStats {
  thisMonthRevenue: string;
  thisMonthRevenueChange: string;
  totalOrders: string;
  totalOrdersChange: string;
  avgDailyRevenue: string;
  avgDailyRevenueChange: string;
}

export interface SubBranch {
  id: string;
  name: string;
  location: string;
  staffCount: number;
  status: 'Open' | 'Closed';
  manager: string;
  address?: string;
  phone?: string;
}

export interface RestaurantBranch {
  id: string;
  codeId?: string; // REST-0001
  name: string;
  type: RestaurantType;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  status: RestaurantStatus;
  manager: Manager;
  staffCount: number;
  assignedStaff: StaffMember[];
  operatingHours: DaySchedule[];
  services: string[];
  branchesCount?: number;
  revenue?: string;
  rating?: number;
  tablesCount?: number;
  detailStats?: RestaurantDetailStats;
  branchesList?: SubBranch[];
  menuItems?: MenuItem[];
}

export interface BranchItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  status: 'Open' | 'Closed' | 'Opening Soon';
  manager: Manager;
  staffCount: number;
  assignedStaff: StaffMember[];
  operatingHours?: DaySchedule[];
  services?: string[];
  revenue?: string;
}
