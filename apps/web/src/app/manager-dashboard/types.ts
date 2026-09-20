import React from 'react';

export interface ManagerNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export interface ManagerProfile {
  name: string;
  email: string;
  role: string;
  branch: string;
  company: string;
}

export interface AIOperationsSummary {
  score: number;
  rating: string;
  description: string;
  recommendations: string[];
}

export interface OperationKPICard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  iconColor: string;
  iconBg: string;
  color: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  iconName: string;
}

export type OrderStatus = 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export type LiveOrderStatus =
  | 'All'
  | 'Waiting'
  | 'Cooking'
  | 'Preparing'
  | 'Ready'
  | 'Served'
  | 'Paid';

export interface LiveOrder {
  id: string;
  orderNumber: string;
  table: string;
  waiter: string;
  status: OrderStatus;
  amount: number;
}

export interface DetailedLiveOrder {
  id: string;
  orderNumber: string;
  table: string;
  waiter: string;
  itemsCount: number;
  itemsSummary?: string;
  total: number;
  status: LiveOrderStatus;
  eta: string;
  time: string;
  notes?: string;
  orderItems?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface FilterOrdersState {
  status: string;
  waiter: string;
  tableNumber: string;
  dateRange: string;
}

export interface LiveOrdersKPIData {
  activeOrders: number;
  activeOrdersSubtitle: string;
  avgWaitTime: string;
  avgWaitTimeSubtitle: string;
  delayedOrders: number;
  delayedOrdersSubtitle: string;
  revenueToday: string;
  revenueTodaySubtitle: string;
}

export interface SmartAlert {
  id: string;
  message: string;
  timeAgo: string;
  severity: 'danger' | 'warning' | 'caution' | 'success';
}

export interface FloorStatusItem {
  status: string;
  count: number;
  color: string;
  bg: string;
}

export interface KitchenOpsSummary {
  queueCount: number;
  delayedCount: number;
  completedCount: number;
  avgTime: string;
  stationAlert: string;
}

export interface HealthMetric {
  label: string;
  score: number;
  color: string;
}

// ==========================================
// Point of Sale (POS) Types
// ==========================================
export type POSCategory =
  | 'All'
  | 'Burgers'
  | 'Pizza'
  | 'Pasta'
  | 'Salads'
  | 'Desserts'
  | 'Drinks';

export interface POSProductItem {
  id: string;
  name: string;
  category: POSCategory;
  subcategory: string;
  price: number;
  image: string;
  isHot?: boolean;
  emoji?: string;
}

export interface POSCartItem {
  product: POSProductItem;
  quantity: number;
}

export type POSPaymentMethod = 'Card' | 'Cash' | 'QR / Digital';

// ==========================================
// QR Ordering Types
// ==========================================
export interface TableQRItem {
  id: string;
  tableNumber: string;
  seats: number;
  area: string;
  status: 'Active' | 'Inactive' | 'Occupied';
  language: string;
  scansToday: number;
  lastScanTime?: string;
}

export interface QRStatsData {
  activeQRCodes: number;
  activeSubtitle: string;
  scansToday: number;
  scansGrowth: string;
  ordersViaQRPercent: number;
  ordersSubtitle: string;
  avgOrderValue: number;
  avgSubtitle: string;
}

export interface QRHourlyScan {
  time: string;
  scans: number;
}

export interface QRSettingsState {
  autoConfirmOrders: boolean;
  showAllergenInfo: boolean;
  allowItemNotes: boolean;
  upsellSuggestions: boolean;
  tableSidePayment: boolean;
}

// ==========================================
// Tables Page Types
// ==========================================
export type TableFloorStatus = 'Occupied' | 'Available' | 'Reserved';

export type TableFilterTab = 'All' | 'Occupied' | 'Available' | 'Reserved';

export interface FloorTable {
  id: string;
  tableNumber: string;
  capacity: number;
  currentGuests: number;
  status: TableFloorStatus;
  waiter: string;
  seatedTime: string;
  section: string;
  location: string;
  shape: string;
  notes?: string;
}

export interface TablesKPIStats {
  occupiedText: string;
  occupiedCount: number;
  totalTables: number;
  availableCount: number;
  reservedCount: number;
  activeRevenue: number;
}

export interface AddTableFormData {
  tableNumber: string;
  capacity: number;
  shape: string;
  section: string;
  location: string;
  notes: string;
}

// ==========================================
// Menu Management Types
// ==========================================
export type MenuCategoryFilter =
  | 'All'
  | 'Sweet'
  | 'Savory'
  | 'Pancake'
  | 'Coffee'
  | 'Drinks';

export type MenuAvailabilityStatus = 'Available' | 'Unavailable';

export interface ManagerMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  status: MenuAvailabilityStatus;
  isPopular: boolean;
  description?: string;
  prepTimeMinutes?: number;
  calories?: number;
  allergens?: string;
}

export interface AddMenuItemFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  prepTimeMinutes: number;
  calories: number;
  allergens: string;
  isAvailable: boolean;
  isPopular?: boolean;
}

// ==========================================
// Inventory Management Types
// ==========================================
export type InventoryCategoryFilter =
  | 'All'
  | 'Dairy'
  | 'Meat'
  | 'Beverages'
  | 'Pantry'
  | 'Seafood'
  | 'Bakery';

export type InventoryStockStatus = 'Critical' | 'Low' | 'Healthy';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStockText: string;
  currentStock: number;
  unit: string;
  minLevel: string;
  minLevelValue: number;
  status: 'Available' | 'Unavailable';
  stockStatus: InventoryStockStatus;
  progressPercentage: number;
  progressColor: string;
  textColor: string;
  supplier?: string;
}

export interface InventoryKPIsData {
  criticalCount: number;
  criticalSubtitle: string;
  lowStockCount: number;
  lowSubtitle: string;
  healthyCount: number;
  healthySubtitle: string;
  totalCount: number;
  totalSubtitle: string;
}

export interface QuickRestockFormData {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  supplier: string;
  urgency: 'Normal' | 'Express';
}

export interface AdjustStockFormData {
  itemId: string;
  adjustmentType: 'add' | 'remove' | 'set';
  amount: number;
  reason: 'Delivery' | 'Waste' | 'Inventory Count' | 'Transfer';
  notes?: string;
}

// ==========================================
// Staff Management Types
// ==========================================
export type StaffRole = 'Waiter' | 'Chef' | 'Bartender' | 'Host' | 'Manager' | 'Busser';

export type StaffStatus = 'Active' | 'On Break' | 'Off Duty';

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  role: StaffRole;
  status: StaffStatus;
  shift: string;
  tablesCount: number;
  ordersCount: number;
  rating: number;
  phone: string;
  email: string;
  hourlyRate: number;
  startDate?: string;
  emergencyContact?: string;
}

export interface StaffKPIsData {
  onDutyCount: number;
  onDutySubtitle: string;
  waitersActiveCount: number;
  waitersSubtitle: string;
  kitchenStaffCount: number;
  kitchenSubtitle: string;
  avgRating: number;
  ratingSubtitle: string;
}

export interface AddStaffFormData {
  firstName: string;
  lastName: string;
  role: StaffRole;
  shift: string;
  phone: string;
  email: string;
  startDate: string;
  hourlyRate: string;
  emergencyContact: string;
}

// ==========================================
// Customer Management Types
// ==========================================
export interface ManagerCustomer {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  dob?: string;
  preferredTable?: string;
  dietaryPreferences?: string;
  notes?: string;
  isVIP: boolean;
  rating: number;
  visits: number;
  spent: number;
  lastVisit: string;
}

export interface CustomerKPIsData {
  totalCustomers: number;
  totalCustomersSubtitle: string;
  vipMembers: number;
  vipSubtitle: string;
  avgRating: number;
  avgRatingSubtitle: string;
  returnRate: number;
  returnRateSubtitle: string;
}

export interface AddCustomerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob?: string;
  preferredTable?: string;
  dietaryPreferences?: string;
  notes?: string;
  isVIP: boolean;
}

// ==========================================
// Analytics & Reports Page Types
// ==========================================
export interface AnalyticsKPIData {
  revenueToday: string;
  revenueTrend: string;
  ordersToday: number;
  ordersTrend: string;
  avgOrderValue: string;
  avgOrderTrend: string;
  tableTurnover: string;
  turnoverSubtitle: string;
}

export interface TrafficDataPoint {
  day: string;
  value: number;
  dineIn: number;
  takeout: number;
}

export interface CategoryRevenuePoint {
  name: string;
  percentage: number;
  color: string;
  amount: number;
  amountFormatted: string;
}

export type AnalyticsTimeframe = 'Today' | 'This Week' | 'This Month' | 'This Quarter';

export interface CategoryBreakdownRow {
  id: string;
  category: string;
  itemsSold: number;
  grossRevenue: number;
  avgTicket: number;
  share: number;
  growth: string;
}

// ==========================================
// AI Insights Page Types
// ==========================================
export interface AIInsightsKPIData {
  insightsGenerated: number;
  insightsGeneratedSubtitle: string;
  actionsSuggested: number;
  actionsSuggestedSubtitle: string;
  accuracyRate: string;
  accuracyRateSubtitle: string;
  efficiencyGain: string;
  efficiencyGainSubtitle: string;
}

export type InsightBadgeType = 'positive' | 'action' | 'insight' | 'warning';

export interface AIInsightItem {
  id: string;
  title: string;
  badgeText: string;
  badgeType: InsightBadgeType;
  description: string;
  actionText: string;
  iconType: 'revenue' | 'staffing' | 'menu' | 'inventory' | 'loyalty' | 'kitchen';
  impactMetric?: string;
  recommendedAction?: string;
  status?: 'pending' | 'applied' | 'dismissed';
}

// ==========================================
// Manager Notifications Page Types
// ==========================================
export type ManagerNotificationSeverity = 'urgent' | 'warning' | 'caution' | 'info';

export interface ManagerNotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  isNew?: boolean;
  severity: ManagerNotificationSeverity;
  category: 'table' | 'kitchen' | 'inventory' | 'customer' | 'staff' | 'order' | 'report';
  metadata?: string;
}

// ==========================================
// Manager Settings Page Types
// ==========================================
export interface RestaurantInfoSettings {
  restaurantName: string;
  branch: string;
  address: string;
  phone: string;
}

export interface IntegrationSettingItem {
  id: string;
  name: string;
  status: 'Connected' | 'Disconnected';
  category: string;
}

export interface NotificationSettingToggle {
  id: string;
  label: string;
  enabled: boolean;
}

export interface AIOperationSettingToggle {
  id: string;
  label: string;
  enabled: boolean;
}

