import type { Receipt, SessionRow } from "./types.js";

/**
 * Hard-coded fixture matching the design mockup (APR 21 2026, 19:38 UTC,
 * $19.67 subtotal, 28 markets, 10 signals). Used by `pnpm demo:cli` and the
 * /r/demo page so designers can iterate without hitting the live API.
 */
const rows: SessionRow[] = [
  ["Strait of Hormuz traffic returns to normal by end of Apr", "bear", 0.77, 0.24, false, false, 0.0],
  ["Will France win the 2026 FIFA World Cup?", "bull", 0.91, 0.16, true, true, 0.2],
  ["US x Iran permanent peace deal by April 22, 2026?", "neut", 0.69, 0.17, false, false, 0.0],
  ["Will Spain win the 2026 FIFA World Cup?", "bull", 0.83, 0.16, true, true, 0.35],
  ["Will Chelsea FC win on 2026-04-18?", "bull", 0.81, 0.41, true, false, 0.0],
  ["Will Roberto Sánchez Palomino win the 2026 Peruvian pres", "bull", 0.64, 0.23, true, true, 1.56],
  ["Will Club Atlético de Madrid win on 2026-04-18?", "bull", 0.61, 0.43, false, false, 0.0],
  ["Will the U.S. invade Iran before 2027?", "neut", 0.72, 0.34, false, false, 0.0],
  ["Starmer out by April 30, 2026?", "neut", 0.73, 0.06, false, false, 0.0],
  ["Will the US confirm that aliens exist before 2027?", "neut", 0.86, 0.2, false, false, 0.0],
  ["Will Atletico Madrid win the 2025-26 Champions League?", "bull", 0.87, 0.12, true, true, 0.28],
  ["US x Iran permanent peace deal by April 30, 2026?", "bear", 0.9, 0.36, false, false, 0.0],
  ["Will Manchester United FC win on 2026-04-18?", "bull", 0.64, 0.28, false, false, 0.0],
  ["Iran x Israel/US conflict ends by April 7?", "bull", 0.78, 0.8, false, false, 0.0],
  ["Will the San Antonio Spurs win the 2026 NBA Finals?", "bull", 0.86, 0.15, true, true, 0.29],
  ["Will Kevin Warsh be confirmed as Fed Chair?", "bull", 0.88, 0.94, false, false, 0.0],
  ["US obtains Iranian enriched uranium by May 31?", "neut", 0.88, 0.23, false, false, 0.0],
  ["Will the Iranian regime fall by June 30?", "neut", 0.78, 0.07, false, false, 0.0],
  ["Will Lille OSC win on 2026-04-18?", "bull", 0.67, 0.61, false, false, 0.0],
  ["Will the Boston Celtics win the 2026 NBA Finals?", "bull", 0.77, 0.12, true, true, 0.47],
  ["Will China invade Taiwan by end of 2026?", "neut", 0.88, 0.09, false, false, 0.0],
  ["Will Gavin Newsom win the 2028 Democratic presidential n", "bull", 0.62, 0.27, false, false, 0.0],
  ["Trump announces end of military operations against Iran", "bull", 0.73, 0.14, true, true, 1.96],
  ["Will Marco Rubio win the 2028 US Presidential Election?", "bull", 0.76, 0.11, true, true, 0.49],
  ["Will Roberto Sánchez Palomino finish in second place in", "neut", 0.87, 0.79, false, false, 0.0],
  ["Will Chelsea FC vs. Manchester United FC end in a draw?", "bull", 0.92, 0.29, true, true, 0.14],
  ["Iran x Israel/US conflict ends by April 15?", "bear", 0.82, 0.8, true, true, 0.34],
  ["Will the Oklahoma City Thunder win the 2026 NBA Finals?", "bear", 0.86, 0.47, false, false, 0.0],
].map(
  ([market, sentiment, confidence, price, bullPass, fixedPass, deltaPnl], idx) => ({
    index: idx + 1,
    market: market as string,
    sentiment: sentiment as "bull" | "bear" | "neut",
    confidence: confidence as number,
    price: price as number,
    bullPass: bullPass as boolean,
    fixedPass: fixedPass as boolean,
    deltaPnl: deltaPnl as number,
  }),
);

export const demoReceipt: Receipt = {
  id: "demo",
  header: {
    date: "APR 21  2026",
    time: "19:38 UTC",
    window: "19:10 — 19:38",
    marketsScanned: 28,
    signalsGenerated: 10,
  },
  rows,
  signals: [
    { title: "trump iran ops",       edge: 1.96 },
    { title: "sanchez peru 2026",    edge: 1.56 },
    { title: "vance 2028 gop",       edge: 0.49 },
    { title: "rubio 2028 us",        edge: 0.49 },
    { title: "boston celtics nba",   edge: 0.47 },
    { title: "spain world cup 2026", edge: 0.35 },
    { title: "iran x israel apr 15", edge: 0.34 },
    { title: "spurs 2026 nba",       edge: 0.29 },
    { title: "atletico madrid ucl",  edge: 0.28 },
    { title: "france world cup 2026",edge: 0.20 },
  ],
  arbitrage: [
    { title: "btc < 60k by apr 30", spreadCents: 6, pair: "poly vs kalshi" },
    { title: "spain world cup winner", spreadCents: 4, pair: "poly vs kalshi" },
    { title: "nba finals boston", spreadCents: 3, pair: "poly vs kalshi" },
  ],
  subtotal: 19.67,
  tax: null,
  totalEdge: 19.67,
  projections: { daily: 2461, monthly: 73830, yearly: 898165 },
  summary: {
    before: { trades: "8/28", pnl: 13.58 },
    after:  { trades: "10/28", pnl: 19.67 },
    revenueRecovered: 6.09,
    signalsUnlocked: 2,
  },
  windowMinutes: 30,
};
