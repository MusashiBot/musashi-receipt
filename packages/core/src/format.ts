/**
 * Title slugger — turns "Will Spain win the 2026 FIFA World Cup?" into
 * "spain world cup 2026" so the paper receipt body stays compact.
 *
 * Strategy: drop question scaffolding ("will", "the", "win", "?"), lowercase,
 * collapse whitespace, then truncate to a sensible width.
 */
const STOPWORDS = new Set([
  "will",
  "the",
  "a",
  "an",
  "be",
  "is",
  "are",
  "in",
  "on",
  "of",
  "by",
  "for",
  "vs",
  "vs.",
  "to",
  "win",
  "wins",
  "won",
  "ends",
  "end",
  "fc",
  "fifa",
]);

export function slugTitle(raw: string, maxLen = 26): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[?!.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = cleaned.split(" ").filter((t) => t && !STOPWORDS.has(t));
  let out = tokens.join(" ");
  if (out.length > maxLen) out = out.slice(0, maxLen - 1).trimEnd() + "…";
  return out;
}

export function fmtUsd(amount: number, withSign = false): string {
  const abs = Math.abs(amount);
  const body = abs.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (!withSign) return amount < 0 ? `-${body}` : body;
  return `${amount >= 0 ? "+" : "-"}${body}`;
}

export function fmtUsdInt(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function fmtCents(spread: number): string {
  const cents = Math.round(spread * 100);
  return `${cents}¢`;
}

export function fmtConf(n: number): string {
  return n.toFixed(2);
}

/**
 * Project subtotal earned in `windowMinutes` over a 24/7 runtime.
 * 30-minute window with $19.67 subtotal → daily ≈ $19.67 × 48 ≈ $944
 * (mockup uses larger numbers because it assumes higher volume; we just
 * scale linearly off whatever the real session produced).
 */
export function projectFromWindow(
  subtotal: number,
  windowMinutes: number,
): { daily: number; monthly: number; yearly: number } {
  const windowsPerDay = (60 * 24) / Math.max(1, windowMinutes);
  const daily = subtotal * windowsPerDay;
  return {
    daily,
    monthly: daily * 30,
    yearly: daily * 365,
  };
}

export function formatDateHeader(d: Date): { date: string; time: string } {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const date = `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}  ${d.getUTCFullYear()}`;
  const time = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
  return { date, time };
}

export function formatWindow(start: Date, end: Date): string {
  const s = `${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")}`;
  const e = `${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}`;
  return `${s} — ${e}`;
}
