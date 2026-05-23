"use client";

import type { CartItem } from "./types";
import { cartLineTotal } from "./pricing";

const CART_KEY = "gz_cart_v2";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return parsed.filter((i) => i.lineId && i.displayName);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export { cartSubtotal, cartLineTotal } from "./pricing";

export function addCartLine(cart: CartItem[], line: CartItem): CartItem[] {
  const existing = cart.find((c) => c.lineId === line.lineId);
  if (existing) {
    return cart.map((c) =>
      c.lineId === line.lineId ? { ...c, quantity: c.quantity + line.quantity } : c
    );
  }
  return [...cart, line];
}

export function updateLineQuantity(
  cart: CartItem[],
  lineId: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return cart.filter((c) => c.lineId !== lineId);
  }
  return cart.map((c) => (c.lineId === lineId ? { ...c, quantity } : c));
}
