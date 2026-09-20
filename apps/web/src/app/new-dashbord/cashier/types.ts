export interface BillQueueItem {
  id: string;
  tableNumber: number;
  tableName: string;
  orderNumber: string;
  customerName: string;
  itemsCount: number;
  itemsDescription?: string;
  waitMinutes: number;
  amountDue: number;
  status: 'pending' | 'processing' | 'paid';
  isHighlighted?: boolean;
}

export interface CashierMenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Mains' | 'Drinks' | 'Desserts' | 'Sides';
  price: number;
  imageUrl: string;
  description?: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShiftHistoryItem {
  id: string;
  tableNumber: number;
  tableName: string;
  orderNumber: string;
  paymentMethod: 'Credit Card' | 'Cash' | 'Apple Pay' | 'Split Card';
  itemsSummary: string;
  timestamp: string;
  amount: number;
  status: 'completed' | 'refunded';
}

export interface CashierNotification {
  id: string;
  title: string;
  timeAgo: string;
  type: 'payment' | 'hardware' | 'system' | 'alert';
  isActive: boolean;
}
