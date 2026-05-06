import type { Receipt } from "@musashi/receipt-core";
import { demoReceipt } from "@musashi/receipt-core/fixture";

/**
 * Receipt persistence. In production we read/write Vercel KV; in dev we keep
 * an in-memory map so the CLI's --web flag still round-trips.
 *
 * The `demo` id always resolves to the bundled fixture so the page works
 * out of the box without any storage configured.
 */
const memory = new Map<string, Receipt>();

let kv: { get: (k: string) => Promise<unknown>; set: (k: string, v: unknown, opts?: { ex?: number }) => Promise<unknown> } | null = null;
try {
  // Lazy: only require when the env vars are present.
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@vercel/kv");
    kv = mod.kv;
  }
} catch {
  kv = null;
}

const KEY = (id: string) => `musashi-receipt:${id}`;
const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function putReceipt(id: string, receipt: Receipt): Promise<void> {
  if (kv) {
    await kv.set(KEY(id), receipt, { ex: TTL_SECONDS });
    return;
  }
  memory.set(id, receipt);
}

export async function getReceipt(id: string): Promise<Receipt | null> {
  if (id === "demo") return demoReceipt;
  if (kv) {
    const v = (await kv.get(KEY(id))) as Receipt | null;
    return v ?? null;
  }
  return memory.get(id) ?? null;
}
