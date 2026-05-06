export type Sentiment = "bull" | "bear" | "neut";

export interface SessionRow {
  /** 1-indexed row number as shown in the CLI table */
  index: number;
  /** Raw market title from the API */
  market: string;
  sentiment: Sentiment;
  /** 0..1 confidence the API assigned to its read */
  confidence: number;
  /** 0..1 current YES price */
  price: number;
  /** B column — passed the bullishness/bear gating check */
  bullPass: boolean;
  /** F column — flowed through the fixed (post-bug) pipeline */
  fixedPass: boolean;
  /** $ delta this signal contributes; 0 when gating drops it */
  deltaPnl: number;
}

export interface Signal {
  /** Display title (slugged for the receipt body) */
  title: string;
  /** $ edge contribution */
  edge: number;
}

export interface Arb {
  /** Display title (slugged) */
  title: string;
  /** Cents of spread between platforms */
  spreadCents: number;
  /** Free-form sub-line, e.g. "poly vs kalshi" */
  pair: string;
}

export interface Projections {
  daily: number;
  monthly: number;
  yearly: number;
}

export interface ReceiptHeader {
  /** APR 21  2026 */
  date: string;
  /** 19:38 UTC */
  time: string;
  /** 19:10 — 19:38 */
  window: string;
  marketsScanned: number;
  signalsGenerated: number;
}

export interface BeforeAfter {
  before: { trades: string; pnl: number };
  after: { trades: string; pnl: number };
  /** $ recovered = after.pnl - before.pnl */
  revenueRecovered: number;
  /** count of newly-executed trades */
  signalsUnlocked: number;
}

/** Everything either renderer needs to draw a receipt. */
export interface Receipt {
  id: string;
  header: ReceiptHeader;
  /** Per-market detail used by the CLI section table (image 5). */
  rows: SessionRow[];
  /** Top-level signals shown on the paper receipt body (image 6). */
  signals: Signal[];
  /** Arbitrage block (image 6). */
  arbitrage: Arb[];
  subtotal: number;
  /** Always 0 / "—" for now; kept so the line item renders. */
  tax: number | null;
  totalEdge: number;
  projections: Projections;
  /** CLI summary block. */
  summary: BeforeAfter;
  /** Window length in minutes — used for daily projection math. */
  windowMinutes: number;
}

/* ------------ Musashi API response slices we actually consume ------------ */

export interface MusashiMarket {
  id: string;
  platform: "polymarket" | "kalshi";
  title: string;
  yesPrice: number;
  noPrice?: number;
  volume24h?: number;
  url?: string;
  category?: string;
}

export interface MusashiArbOpportunity {
  polymarket: MusashiMarket;
  kalshi: MusashiMarket;
  spread: number;
  profitPotential: number;
  direction: "buy_poly_sell_kalshi" | "buy_kalshi_sell_poly";
  confidence: number;
  matchReason: string;
}

export interface MusashiMover {
  market: MusashiMarket;
  priceChange1h: number;
  priceChange24h?: number;
  previousPrice: number;
  currentPrice: number;
  direction: "up" | "down";
  timestamp: number;
}
