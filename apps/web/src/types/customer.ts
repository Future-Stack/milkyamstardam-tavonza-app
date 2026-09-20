import { StaticImageData } from "next/image";

export type FlowStep =
  | "scan"
  | "welcome"
  | "menu"
  | "detail"
  | "cart"
  | "orderPlaced"
  | "trackOrder"
  | "payment"
  | "confirmation"
  | "feedback"
  | "feedbackSuccess"
  | "aiChat";

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "steaks" | "starters" | "sides" | "drinks";
  price: number;
  rating: number;
  reviewsCount: number;
  image: StaticImageData | string;
  description: string;
  isVegetarian?: boolean;
  badge?: "Chef's Pick" | "Best Seller" | "Popular";
  allergens?: string;
  winePairing?: string;
  winePairingDesc?: string;
  prepTime?: string;
  calories?: string;
  addOns?: AddOnOption[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedAddOns: AddOnOption[];
  specialInstructions?: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  cardType: string;
  expiry: string;
  cvv: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "sofia";
  text: string;
}
