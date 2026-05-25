import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readOrders, updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";

const allowedStatuses: OrderStatus[] = [
  "Pedido recebido",
  "Pedido aceito",
  "Em preparo",
  "Saiu para entrega",
  "Finalizado",
];

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const orders = await readOrders();
  return NextResponse.json(
    [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; status?: OrderStatus };
  if (!body.id || !body.status || !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const order = await updateOrderStatus(body.id, body.status);
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  return NextResponse.json(order);
}
