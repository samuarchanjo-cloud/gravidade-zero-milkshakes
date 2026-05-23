import type {
  CartItem,
  Flavor,
  ModifierGroup,
  SelectedModifier,
  SizeOption,
} from "./types";

export function formatMoney(value: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency === "BRL" ? "BRL" : currency,
  }).format(value);
}

export function getFlavorSizePrice(
  flavor: Flavor,
  sizeId: string,
  sizes: SizeOption[]
): number {
  const custom = flavor.customPrices?.[sizeId];
  if (custom != null && custom > 0) return custom;
  return sizes.find((s) => s.id === sizeId)?.price ?? 0;
}

export function minFlavorPrice(flavor: Flavor, sizes: SizeOption[]): number {
  if (sizes.length === 0) return 0;
  return Math.min(...sizes.map((s) => getFlavorSizePrice(flavor, s.id, sizes)));
}

/** @deprecated use minFlavorPrice(flavor, sizes) */
export function minFlavorPriceFromSizes(sizes: SizeOption[]): number {
  if (sizes.length === 0) return 0;
  return Math.min(...sizes.map((s) => s.price));
}

export function calcUnitPrice(
  flavor: Flavor,
  size: SizeOption,
  sizes: SizeOption[],
  modifiers: SelectedModifier[]
): number {
  const base = getFlavorSizePrice(flavor, size.id, sizes);
  const extras = modifiers.reduce((sum, m) => sum + m.price, 0);
  return base + extras;
}

export function buildDisplayName(
  flavor: Flavor,
  size: SizeOption,
  modifiers: SelectedModifier[]
): string {
  const parts = [`${flavor.name} ${size.label}`];
  if (modifiers.length > 0) {
    parts.push(modifiers.map((m) => m.name).join(", "));
  }
  return parts.join(" · ");
}

export function validateModifierSelection(
  groups: ModifierGroup[],
  selected: SelectedModifier[]
): string | null {
  for (const group of groups) {
    const count = selected.filter((s) => s.groupId === group.id).length;
    if (group.required && count < group.min) {
      return `Escolha uma opção em "${group.name}".`;
    }
    if (count > group.max) {
      return `Máximo de ${group.max} em "${group.name}".`;
    }
  }
  return null;
}

export function cartLineTotal(item: CartItem): number {
  return item.unitPrice * item.quantity;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + cartLineTotal(i), 0);
}
