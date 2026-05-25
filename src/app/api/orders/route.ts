import { NextResponse } from "next/server";
import { addOrder } from "@/lib/orders";
import type { CustomerOrder } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<
    CustomerOrder,
    "id" | "createdAt" | "status"
  >;

  if (
    !body.customerName?.trim() ||
    !body.customerPhone?.trim() ||
    !body.paymentMethod ||
    !body.items?.length ||
    !Number.isFinite(body.total)
  ) {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  if (body.fulfillment === "delivery" && !body.address?.trim()) {
    return NextResponse.json({ error: "Endereço obrigatório" }, { status: 400 });
  }

  const order = await addOrder({
    ...body,
    customerName: body.customerName.trim(),
    customerPhone: body.customerPhone.trim(),
    address: body.address?.trim() ?? "",
    reference: body.reference?.trim() ?? "",
    notes: body.notes?.trim() ?? "",
  });

  return NextResponse.json(order, { status: 201 });
}
