export interface DrinkOrderItem {
  id: string;
  orderNumber: string;
  table: string;
  items: string;
  priority: 'High' | 'Medium' | 'Normal';
  eta: string;
  status: 'New' | 'Preparing' | 'Quality Check' | 'Ready';
  timePlaced: string;
  station: 'Cocktail' | 'Coffee' | 'Soft Drinks' | 'Juice';
}

export interface BarStation {
  id: string;
  name: string;
  activeOrders: number;
  status: 'Busy' | 'Normal' | 'Available';
  statusColor: string;
  dotColor: string;
}

export interface BeverageInventoryItem {
  id: string;
  name: string;
  stockStatus: 'Low Stock' | 'Running Low' | 'In Stock';
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface BarAlert {
  id: string;
  message: string;
  dotColor: string;
  bgTint: string;
  borderTint: string;
}

export interface AIBeverageInsight {
  id: string;
  title: string;
  description: string;
}

export interface BarStatCard {
  id: string;
  value: string;
  label: string;
  subtext: string;
  shadowColor: string;
  iconName: string;
}
