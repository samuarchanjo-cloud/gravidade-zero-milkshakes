"use client";

import type { CustomerOrder } from "./types";

const ORDERS_KEY = "gz_orders_v1";

export function loadClientOrders(): CustomerOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomerOrder[];
    return Array.isArray(parsed) ? parsed.filter((order) => order.id) : [];
  } catch {
    return [];
  }
}

export function saveClientOrder(order: CustomerOrder): void {
  if (typeof window === "undefined") return;
  const existing = loadClientOrders();
  const next = [order, ...existing.filter((item) => item.id !== order.id)];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
}

export function saveClientOrders(orders: CustomerOrder[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function buildClientOrder(
  order: Omit<CustomerOrder, "id" | "createdAt" | "status">
): CustomerOrder {
  const createdAt = new Date().toISOString();
  const stamp = createdAt.replace(/\D/g, "").slice(2, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return {
    ...order,
    id: `gz-local-${stamp}-${suffix}`,
    createdAt,
    status: "Pedido recebido",
  };
}
