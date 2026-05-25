import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { StoreConfig } from "@/lib/types";

export const runtime = "nodejs";

function logApiError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(context, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return;
  }

  console.error(context, error);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    console.warn("[admin/config] GET sem sessao valida.");
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    const config = await readStore();
    return NextResponse.json(config);
  } catch (error) {
    logApiError("[admin/config] Erro ao ler configuracao:", error);
    return NextResponse.json(
      { error: "Nao foi possivel carregar a configuracao." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return saveConfig(request, "PUT");
}

export async function POST(request: Request) {
  return saveConfig(request, "POST");
}

async function saveConfig(request: Request, method: "PUT" | "POST") {
  if (!(await isAuthenticated())) {
    console.warn(`[admin/config] ${method} sem sessao valida.`);
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as StoreConfig;
    if (
      !body.branding ||
      !body.theme ||
      !body.business ||
      !body.texts ||
      !body.flavors?.length ||
      !body.sizes?.length
    ) {
      console.warn(`[admin/config] ${method} recebeu configuracao invalida.`);
      return NextResponse.json(
        { error: "Configuracao invalida." },
        { status: 400 }
      );
    }

    await writeStore(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logApiError(
      `[admin/config] Erro ao salvar configuracao via ${method}:`,
      error
    );
    return NextResponse.json(
      {
        error:
          "Nao foi possivel salvar a configuracao no servidor. Verifique os logs da API /api/admin/config.",
      },
      { status: 500 }
    );
  }
}
