import type { AddOnOption, MenuItem } from "@/src/types/customer";
import type { GuestMenu, GuestMenuItem } from "@/src/lib/types";

/** Placeholder for menu items with no photo of their own. */
const FALLBACK_IMAGE = "/assets/costomerpages/restaurant-table-spread.jpg";

/**
 * Bridges the API's menu shape onto the one the customer components already
 * render.
 *
 * One deliberate simplification: `ItemDetailStep` shows add-ons as a flat list
 * of checkboxes, which cannot express "choose exactly one of Size". So required
 * groups are resolved here to their first option and carried on
 * `impliedModifierIds` — always sent with the order, never shown as a choice.
 * Optional groups become real, user-selectable add-ons.
 *
 * That means guests can't change size or spice level from this UI yet; doing so
 * needs the detail step to render groups properly.
 */
export function toMenuItem(item: GuestMenuItem, categoryId: string): MenuItem {
  const requiredModifiers = item.modifierGroups
    .filter((group) => group.isRequired)
    .map((group) => group.modifiers[0])
    .filter(Boolean);

  const optionalAddOns: AddOnOption[] = item.modifierGroups
    .filter((group) => !group.isRequired)
    .flatMap((group) =>
      group.modifiers.map((modifier) => ({
        id: modifier.id,
        name: group.name ? `${modifier.name}` : modifier.name,
        price: modifier.priceDelta,
      })),
    );

  return {
    id: item.id,
    name: item.name,
    // The category *id*, so the menu's category pills filter by it.
    category: categoryId,
    price: item.basePrice,
    rating: 0,
    reviewsCount: 0,
    image: item.imageUrl || FALLBACK_IMAGE,
    description: item.description ?? "",
    isVegetarian: item.isVegetarian,
    addOns: optionalAddOns,
    impliedModifierIds: requiredModifiers.map((modifier) => modifier.id),
  };
}

export interface AdaptedMenu {
  categories: { id: string; label: string }[];
  items: MenuItem[];
  /** Original API items, keyed by id — needed for images, modifiers and pricing. */
  byId: Map<string, GuestMenuItem>;
}

/** Flattens the API's grouped menu into the flat list the components expect. */
export function adaptMenu(menu: GuestMenu): AdaptedMenu {
  const categories: { id: string; label: string }[] = [];
  const items: MenuItem[] = [];
  const byId = new Map<string, GuestMenuItem>();

  for (const category of menu.categories) {
    categories.push({ id: category.id, label: category.name });
    for (const item of category.menuItems) {
      byId.set(item.id, item);
      items.push(toMenuItem(item, category.id));
    }
  }

  return { categories, items, byId };
}
