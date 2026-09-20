export type TableStatus = 'Dining' | 'Attention' | 'Bussing' | 'Ready' | 'Seated' | 'Check Out';

export type DiningZone = 'All' | 'Main Dining' | 'Patio' | 'Bar & High Tops' | 'Private Room';

export type StatusFilter = 'All' | 'Alerts' | 'Dining' | 'Seated' | 'Check Out' | 'Bussing' | 'Ready';

export interface FloorTable {
  id: string;
  tableNumber: string; // e.g. "Table- 02"
  zone: string; // e.g. "Main Dining"
  capacity: number;
  currentGuests: number;
  status: TableStatus;
  totalAmount?: string; // e.g. "$78.00"
  course?: string; // e.g. "Course : Just Seated"
  itemsCount?: number; // e.g. 1
  elapsedMinutes?: number; // e.g. 8
  targetMinutes?: number; // e.g. 60
  serverName: string; // e.g. "Maya Patel"
  alertMessage?: string; // e.g. "Kitchen delay on mains (18m behind ticket)"
  awaitingReset?: boolean;
  orderItems?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: string;
    status: 'preparing' | 'served' | 'delayed';
  }>;
}

export interface FloorOccupancyKPI {
  rate: string; // e.g. "67%"
  tablesFraction: string; // e.g. "(16/24 tables)"
  tablesOpen: number; // e.g. 4
  bussingCount: number; // e.g. 2
}

export interface SeatedGuestsKPI {
  totalGuests: number; // e.g. 55
  unit: string; // "covers"
  subtitle: string; // "Dining across floor"
  waitlistCount: number; // e.g. 8
}

export interface StaffActiveKPI {
  activeCount: string; // "08"
  rosteredTotal: string; // "/10 rostered"
  coverageNote: string; // "All 4 zones covered"
}

export interface FrontlineAlertsKPI {
  pendingCount: string; // "06"
  statusLabel: string; // "pending review"
  actionNote: string; // "Requires AM action"
  actionLabel: string; // "Snapshot"
}

export interface QuickActionCard {
  id: string;
  title: string;
  subtitle: string;
  actionText: string;
  actionType: 'manage' | 'review' | 'send' | 'status';
  isHighlighted?: boolean;
  statusBadge?: string;
}

export interface ShiftNoteData {
  id: string;
  title: string;
  content: string;
  author: string;
  role: string;
  timestamp: string;
  priority: 'normal' | 'high' | 'urgent';
  targetZones: string[];
}

export interface FrontlineAlert {
  id: string;
  tableNumber: string;
  zone: string;
  title: string;
  description: string;
  elapsedMinutes: number;
  severity: 'critical' | 'warning' | 'info';
  server: string;
  timestamp: string;
}

export type EscalationQueueTab = 'Pending Action' | 'Forwarded to RM' | 'Resolved';
export type EscalationDepartment = 'All' | 'Waiters' | 'Kitchen & KDS' | 'Cashier' | 'Host' | 'Ready';

export interface EscalationTicket {
  id: string;
  sourceType: 'Waiter' | 'Kitchen' | 'Cashier' | 'Host' | 'Ready';
  timeAgo: string;
  title: string;
  description: string;
  flaggedBy: string;
  amount?: string;
  tableNumber?: string;
  zone?: string;
  department: EscalationDepartment;
  status: EscalationQueueTab;
  canApproveDirectly?: boolean;
}

export interface OutOfStockItem {
  id: string;
  name: string;
  category: 'Kitchen' | 'Bar' | 'Dessert';
  posStatus: '86ed' | 'low_stock' | 'restocked';
  reportedBy: string;
  reportedTime: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  zone: string;
  activeTables: number;
  status: 'active' | 'break' | 'off_duty';
  shiftHours: string;
  avatar: string;
}
