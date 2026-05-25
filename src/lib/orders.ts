import { promises as fs } from "fs";
import path from "path";
import type { CustomerOrder, OrderStatus } from "./types";

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

async function ensureOrdersFile(): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  try {
    await fs.access(ORDERS_PATH);
  } catch {
    await fs.writeFile(ORDERS_PATH, "[]", "utf-8");
  }
}

export async function readOrders(): Promise<CustomerOrder[]> {
  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as CustomerOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeOrders(orders: CustomerOrder[]): Promise<void> {
  await ensureOrdersFile();
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

export async function addOrder(
  order: Omit<CustomerOrder, "id" | "createdAt" | "status">
): Promise<CustomerOrder> {
  const orders = await readOrders();
  const createdAt = new Date().toISOString();
  const savedOrder: CustomerOrder = {
    ...order,
    id: buildOrderId(createdAt),
    createdAt,
    status: "Pedido recebido",
  };
  await writeOrders([savedOrder, ...orders]);
  return savedOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<CustomerOrder | null> {
  const orders = await readOrders();
  let updatedOrder: CustomerOrder | null = null;
  const nextOrders = orders.map((order) => {
    if (order.id !== orderId) return order;
    updatedOrder = { ...order, status };
    return updatedOrder;
  });

  if (!updatedOrder) return null;

  await writeOrders(nextOrders);
  return updatedOrder;
}

function buildOrderId(createdAt: string): string {
  const stamp = createdAt.replace(/\D/g, "").slice(2, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `gz-${stamp}-${suffix}`;
}
