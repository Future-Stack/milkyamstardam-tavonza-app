export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

/** `GET /guest/table/:token` */
export interface GuestTableContext {
  table: {
    id: string;
    label: string;
    capacity: number;
    shape: string;
    serviceStatus: string;
  };
  branch: { id: string; name: string; phone?: string | null; timezone: string };
  restaurant: {
    id: string;
    name: string;
    logoUrl?: string | null;
    description?: string | null;
  };
  settings: {
    currency: string;
    taxPercent: number;
    serviceChargePct: number;
    tipEnabled: boolean;
    hideUnavailableItems: boolean;
    requireOtpPerGuest: boolean;
    allowSplitBill: boolean;
    allowMultipleGuestSessions: boolean;
    orderAcceptanceMode: string;
  };
  session: {
    id: string;
    joinCode?: string | null;
    status: string;
    partySize?: number | null;
    guestCount: number;
    startedAt: string;
  } | null;
}

export interface GuestModifier {
  id: string;
  name: string;
  priceDelta: number;
  isAvailable: boolean;
}

export interface GuestModifierGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  modifiers: GuestModifier[];
}

export interface GuestMenuItem {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  basePrice: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  spiceLevel?: number | null;
  stationType: "KITCHEN" | "BAR";
  modifierGroups: GuestModifierGroup[];
}

export interface GuestMenuCategory {
  id: string;
  name: string;
  description?: string | null;
  menuItems: GuestMenuItem[];
}

/** `GET /guest/menu/:token` */
export interface GuestMenu {
  restaurant: { id: string; name: string; logoUrl?: string | null };
  currency: string;
  hideUnavailableItems: boolean;
  categories: GuestMenuCategory[];
}

export interface GuestOrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: string;
  stationType: "KITCHEN" | "BAR";
  modifiers: { id: string; name: string; priceDelta: number }[];
}

export interface GuestOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  guestSessionId: string | null;
  placedAt: string;
  subtotal: number;
  discountAmount: number;
  serviceCharge: number;
  taxAmount: number;
  tipAmount: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  items: GuestOrderItem[];
}

export interface GuestPerson {
  id: string;
  displayName?: string | null;
  isHostGuest: boolean;
  status: string;
  contact?: string;
  orders: GuestOrder[];
  owed: number;
  paid: number;
  balance: number;
}

/** `GET /guest/tab` */
export interface GuestTab {
  currency: string;
  allowSplitBill: boolean;
  me: GuestPerson;
  guests: GuestPerson[];
  table: { id: string; label: string; serviceStatus: string };
  branch: { id: string; name: string };
  session: {
    id: string;
    joinCode?: string | null;
    status: string;
    partySize?: number | null;
    startedAt: string;
  };
  tableTotals: { subtotal: number; paid: number; outstanding: number };
}

/** `POST /guest/table/:token/otp/verify` */
export interface GuestVerification {
  accessToken: string;
  guest: { id: string; displayName?: string | null; isHostGuest: boolean };
  tableSession: { id: string; joinCode?: string | null; status: string; guestCount: number };
  table: { id: string; label: string };
  branch: { id: string; name: string };
  restaurant: { id: string; name: string };
}

/** Result shape every server action returns to its form. */
export interface ActionResult {
  success: boolean;
  message: string;
}
