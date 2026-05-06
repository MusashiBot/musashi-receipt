import { NextResponse } from "next/server";
import type { Receipt } from "@musashi/receipt-core";
import { putReceipt } from "@/lib/store";

const BASE = process.env.NEXT_PUBLIC_RECEIPT_BASE ?? "https://musashi.bot";
const newId = () => Math.random().toString(36).slice(2, 8);

export async function POST(req: Request) {
  let body: Receipt;
  try {
    body = (await req.json()) as Receipt;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !Array.isArray(body.signals)) {
    return NextResponse.json({ error: "not a Receipt" }, { status: 400 });
  }

  const id = body.id && /^[a-zA-Z0-9-]{3,32}$/.test(body.id) ? body.id : newId();
  const receipt: Receipt = { ...body, id };
  await putReceipt(id, receipt);

  return NextResponse.json({
    id,
    url: `${BASE}/r/${id}`,
  });
}
