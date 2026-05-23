import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { StoreConfig } from "@/lib/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const config = await readStore();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as StoreConfig;
  if (
    !body.branding ||
    !body.theme ||
    !body.business ||
    !body.texts ||
    !body.flavors?.length ||
    !body.sizes?.length
  ) {
    return NextResponse.json({ error: "Configuração inválida" }, { status: 400 });
  }

  await writeStore(body);
  return NextResponse.json({ ok: true });
}
