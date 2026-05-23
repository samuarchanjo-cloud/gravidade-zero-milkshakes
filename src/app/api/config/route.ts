import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";

export async function GET() {
  const config = await readStore();
  return NextResponse.json(config);
}
