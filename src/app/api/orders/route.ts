import { NextResponse } from "next/server";
import { addOrder } from "@/lib/orders";
import type {
  CustomerOrder,
  FulfillmentType,
  OrderPaymentMethod,
  OrderItem,
} from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CustomerOrder> & {
      paymentMethod?: string;
    };
    const items = normalizeItems(body.items);
    const fulfillment = normalizeFulfillment(body.fulfillment);
    const subtotal = numberOrZero(body.subtotal);
    const deliveryFee = numberOrZero(body.deliveryFee);
    const paymentFee = numberOrZero(body.paymentFee);
    const total = numberOrZero(body.total) || subtotal + deliveryFee;
    const paymentMethod = normalizePaymentMethod(body.paymentMethod);

    if (!body.customerName?.trim() || !items.length || !paymentMethod || total <= 0) {
      return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
    }

    const order = await addOrder({
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone?.trim() ?? "",
      fulfillment,
      address: fulfillment === "delivery" ? body.address?.trim() ?? "" : "",
      reference: body.reference?.trim() ?? "",
      paymentMethod,
      items,
      subtotal,
      deliveryFee,
      paymentFee,
      total,
      notes: body.notes?.trim() ?? "",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao registrar pedido" },
      { status: 500 }
    );
  }
}

function normalizeFulfillment(value: unknown): FulfillmentType {
  return value === "delivery" ? "delivery" : "pickup";
}

function normalizePaymentMethod(value: unknown): OrderPaymentMethod | null {
  if (value === "Pix" || value === "pix") return "Pix";
  if (value === "Dinheiro" || value === "dinheiro") return "Dinheiro";
  if (value === "Cartão" || value === "Cartao" || value === "cartao") {
    return "Cartão";
  }
  if (value === "Débito" || value === "Debito" || value === "debito") return "Débito";
  if (value === "Crédito" || value === "Credito" || value === "credito") return "Crédito";
  return null;
}

function normalizeItems(items: unknown): OrderItem[] {
  if (!Array.isArray(items)) return [];

  const normalized: OrderItem[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Partial<OrderItem> & {
      flavorName?: unknown;
      sizeLabel?: unknown;
    };
    const quantity = numberOrZero(raw.quantity) || 1;
    const unitPrice = numberOrZero(raw.unitPrice);
    const total = numberOrZero(raw.total) || unitPrice * quantity;

    normalized.push({
      flavorName: String(raw.flavorName ?? "Item"),
      sizeLabel: String(raw.sizeLabel ?? ""),
      quantity,
      unitPrice,
      total,
      modifiers: Array.isArray(raw.modifiers) ? raw.modifiers : [],
      observation:
        typeof raw.observation === "string" ? raw.observation : undefined,
    });
  }

  return normalized;
}

function numberOrZero(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
