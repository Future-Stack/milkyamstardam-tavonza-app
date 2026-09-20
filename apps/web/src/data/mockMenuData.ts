import { MenuItem } from "@/src/types/customer";

const customerPageIcon = "/assets/costomerpages/customer-page-icon.svg";
const steakRatingCard = "/assets/costomerpages/steak-rating-card.png";
const ribeyeSteakButter = "/assets/costomerpages/ribeye-steak-butter.png";
const tomahawkRibeyeSteak = "/assets/costomerpages/tomahawk-ribeye-steak.png";
const slicedFlankSteak = "/assets/costomerpages/sliced-flank-steak.png";
const filetMignonSteak = "/assets/costomerpages/filet-mignon-steak.png";
const restaurantTableSpread = "/assets/costomerpages/restaurant-table-spread.jpg";
const fineDiningWineTable = "/assets/costomerpages/fine-dining-wine-table.jpg";

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "arancini-1",
    name: "Arancini al Tartufo",
    category: "starters",
    price: 30.5,
    rating: 4.5,
    reviewsCount: 142,
    image: steakRatingCard,
    description: "Crispy black truffle risotto spheres stuffed with smoked mozzarella & served with aioli.",
    isVegetarian: true,
    badge: "Chef's Pick",
    allergens: "Gluten, Dairy, Nuts",
    winePairing: "Chardonnay",
    winePairingDesc: "Oaked Chardonnay echoes the truffle's earthy richness.",
    prepTime: "12 min",
    calories: "480 kcal",
    addOns: [
      { id: "parm", name: "Extra Parmigiano", price: 1.5 },
      { id: "butter", name: "Truffle Butter", price: 1.5 },
      { id: "fries", name: "Rosemary Fries", price: 1.5 }
    ]
  },
  {
    id: "truffle-2",
    name: "Truffle Margherita",
    category: "starters",
    price: 30.5,
    rating: 4.9,
    reviewsCount: 242,
    image: steakRatingCard,
    description: "Artisan sourdough crust topped with San Marzano tomatoes, fresh buffalo mozzarella, and shaved truffles.",
    isVegetarian: true,
    badge: "Best Seller",
    allergens: "Gluten, Dairy",
    winePairing: "Pinot Noir",
    winePairingDesc: "Light-bodied red elevates the savory herbs and truffle aroma.",
    prepTime: "15 min",
    calories: "520 kcal",
    addOns: [
      { id: "parm", name: "Extra Parmigiano", price: 1.5 },
      { id: "butter", name: "Truffle Butter", price: 1.5 }
    ]
  },
  {
    id: "ribeye-butter-3",
    name: "Ribeye Steak",
    category: "steaks",
    price: 26.5,
    rating: 4.5,
    reviewsCount: 98,
    image: ribeyeSteakButter,
    description: "Pan-seared prime ribeye steak served with melted herb garlic compound butter.",
    badge: "Popular",
    allergens: "Dairy",
    winePairing: "Cabernet Sauvignon",
    winePairingDesc: "Rich tannins complement the savory marbled beef fat.",
    prepTime: "18 min",
    calories: "680 kcal",
    addOns: [
      { id: "butter", name: "Truffle Butter", price: 1.5 },
      { id: "fries", name: "Rosemary Fries", price: 1.5 }
    ]
  },
  {
    id: "tomahawk-4",
    name: "Ribeye Steak",
    category: "steaks",
    price: 25.5,
    rating: 4.5,
    reviewsCount: 210,
    image: tomahawkRibeyeSteak,
    description: "Dry-aged bone-in Tomahawk ribeye grilled over open woodfire flame.",
    allergens: "None",
    winePairing: "Syrah / Shiraz",
    winePairingDesc: "Deep smoky wine flavors enhance char-broiled steak crust.",
    prepTime: "22 min",
    calories: "850 kcal",
    addOns: [
      { id: "parm", name: "Extra Parmigiano", price: 1.5 },
      { id: "butter", name: "Truffle Butter", price: 1.5 }
    ]
  },
  {
    id: "flank-5",
    name: "Ribeye Steak",
    category: "steaks",
    price: 20.5,
    rating: 4.5,
    reviewsCount: 76,
    image: slicedFlankSteak,
    description: "Sliced tender flank steak served on a wooden board with fresh green chimichurri.",
    allergens: "None",
    winePairing: "Malbec",
    winePairingDesc: "Classic Argentine Malbec pairs with fresh chimichurri acidity.",
    prepTime: "14 min",
    calories: "590 kcal",
    addOns: [
      { id: "fries", name: "Rosemary Fries", price: 1.5 }
    ]
  },
  {
    id: "filet-6",
    name: "Ribeye Steak",
    category: "steaks",
    price: 45.5,
    rating: 4.5,
    reviewsCount: 185,
    image: filetMignonSteak,
    description: "Center-cut tenderloin filet mignon seared medium-rare on a dark ceramic plate.",
    allergens: "Dairy",
    winePairing: "Bordeaux Red",
    winePairingDesc: "Smooth refined red wine balances delicate tenderloin texture.",
    prepTime: "16 min",
    calories: "540 kcal",
    addOns: [
      { id: "butter", name: "Truffle Butter", price: 1.5 }
    ]
  }
];
