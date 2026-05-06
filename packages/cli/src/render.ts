import chalk from "chalk";
import stringWidth from "string-width";
import type { Receipt, SessionRow } from "@musashi/receipt-core";

/* ---------- column widths chosen to mirror image 5 ---------- */
const COL = {
  num: 4,       // "1   "
  market: 50,   // truncated
  sent: 6,
  conf: 6,
  price: 6,
  bull: 5,
  fixed: 5,
  pnl: 9,
} as const;

const HR_LIGHT = chalk.gray("─".repeat(86));

function pad(s: string, width: number, side: "L" | "R" = "L"): string {
  const w = stringWidth(s);
  if (w >= width) return truncate(s, width);
  const filler = " ".repeat(width - w);
  return side === "L" ? s + filler : filler + s;
}

function truncate(s: string, width: number): string {
  let out = "";
  let acc = 0;
  for (const ch of s) {
    const w = stringWidth(ch);
    if (acc + w > width) break;
    out += ch;
    acc += w;
  }
  while (acc < width) {
    out += " ";
    acc += 1;
  }
  return out;
}

function colorSent(s: SessionRow["sentiment"]): string {
  if (s === "bull") return chalk.green("bull");
  if (s === "bear") return chalk.red("bear");
  return chalk.gray("neut");
}

function check(ok: boolean): string {
  return ok ? chalk.green("✓") : chalk.red("✗");
}

function colorPnl(n: number): string {
  const txt = `$${n.toFixed(2)}`;
  if (n > 0) return chalk.green(`+${txt}`);
  return chalk.dim(txt);
}

/* ---------------------- header bar ---------------------- */

export function renderSectionHeader(title: string): string {
  const bar = chalk.cyan("━".repeat(86));
  const inner = chalk.cyan.bold(title);
  return `${bar}\n${inner}\n${bar}\n`;
}

/* ---------------------- status lines ---------------------- */

export function renderStatus(receipt: Receipt): string {
  const fetching = chalk.cyan(`Fetching live Polymarket markets from Musashi API…`);
  const loaded = `${chalk.green("✓")} ${chalk.green(`${receipt.rows.length} live markets loaded`)}  ${chalk.gray(`(window: ${receipt.header.time})`)}`;
  return `${fetching}\n${loaded}\n`;
}

/* ---------------------- signal table ---------------------- */

export function renderTable(rows: SessionRow[]): string {
  const head =
    chalk.bold(pad("#", COL.num)) +
    chalk.bold(pad("Market", COL.market)) +
    chalk.bold(pad("Sent", COL.sent)) +
    chalk.bold(pad("Conf", COL.conf, "R")) + " " +
    chalk.bold(pad("P", COL.price, "R")) + "  " +
    chalk.bold(pad("B", COL.bull, "R")) +
    chalk.bold(pad("F", COL.fixed, "R")) +
    chalk.bold(pad("ΔPnL", COL.pnl, "R"));

  const rule = chalk.gray("─".repeat(86));

  const body = rows
    .map((r) => {
      const sent = colorSent(r.sentiment);
      const sentCell = sent + " ".repeat(Math.max(0, COL.sent - 4)); // visible width 4
      return (
        pad(String(r.index), COL.num) +
        pad(r.market, COL.market) +
        sentCell +
        pad(r.confidence.toFixed(2), COL.conf, "R") + " " +
        pad(r.price.toFixed(2), COL.price, "R") + "  " +
        pad(r.bullPass ? "✓" : "✗", COL.bull, "R").replace(
          /[✓✗]/,
          (m) => (m === "✓" ? chalk.green(m) : chalk.red(m)),
        ) +
        pad(r.fixedPass ? "✓" : "✗", COL.fixed, "R").replace(
          /[✓✗]/,
          (m) => (m === "✓" ? chalk.green(m) : chalk.red(m)),
        ) +
        pad(`$${r.deltaPnl.toFixed(2)}`, COL.pnl, "R").replace(
          /\$[\d.]+/,
          (m) => (r.deltaPnl > 0 ? chalk.green(`+${m}`) : chalk.dim(m)),
        )
      );
    })
    .join("\n");

  return `${head}\n${rule}\n${body}\n`;
}

/* ---------------------- section results / boxes ---------------------- */

export function renderSectionResults(receipt: Receipt): string {
  const label = chalk.green.bold(
    `SECTION 1 RESULTS  (${receipt.header.window.replace(" — ", "–")} UTC, 0s, n=${receipt.rows.length})`,
  );
  return `\n${label}\n`;
}

/**
 * Two side-by-side boxes:
 *   ┌────────────────────────┐  ┌────────────────────────┐
 *   │ BEFORE  (buggy API)    │  │ AFTER   (fixed API)    │
 *   │                        │  │                        │
 *   │ Trades :  8/28         │  │ Trades : 10/28         │
 *   │ PnL    :  $ 13.58      │  │ PnL    :  $ 19.67      │
 *   └────────────────────────┘  └────────────────────────┘
 */
export function renderBeforeAfter(receipt: Receipt): string {
  const W = 38;
  const top = "┌" + "─".repeat(W - 2) + "┐";
  const mid = "│" + " ".repeat(W - 2) + "│";
  const bot = "└" + "─".repeat(W - 2) + "┘";

  const inner = (left: string) => "│ " + pad(left, W - 4) + " │";

  const beforeLines = [
    top,
    inner(chalk.bold("BEFORE  (buggy API)")),
    mid,
    inner(`Trades : ${chalk.red(`  ${receipt.summary.before.trades}`)}`),
    inner(`PnL    : ${chalk.red(`$ ${receipt.summary.before.pnl.toFixed(2)}`)}`),
    bot,
  ];
  const afterLines = [
    top,
    inner(chalk.bold("AFTER   (fixed API)")),
    mid,
    inner(`Trades : ${chalk.green(`  ${receipt.summary.after.trades}`)}`),
    inner(`PnL    : ${chalk.green(`$ ${receipt.summary.after.pnl.toFixed(2)}`)}`),
    bot,
  ];

  const out: string[] = [];
  for (let i = 0; i < beforeLines.length; i++) {
    out.push(`${beforeLines[i]}  ${afterLines[i]}`);
  }
  return "\n" + out.join("\n") + "\n";
}

export function renderFooter(receipt: Receipt): string {
  const recov = chalk.green.bold(
    `Revenue recovered : +$${receipt.summary.revenueRecovered.toFixed(2)}  ` +
    chalk.green(`over ${receipt.rows.length} real-priced signals`),
  );
  const unlock = chalk.cyan(
    `Signals unlocked  : ${receipt.summary.signalsUnlocked} previously rejected trades now execute`,
  );
  return `\n${recov}\n${unlock}\n`;
}

/* ---------------------- top-level ---------------------- */

export function renderReceipt(receipt: Receipt): string {
  const parts = [
    renderSectionHeader("SECTION 1 — Bugs 1 & 2: Edge Calculation & Direction"),
    renderStatus(receipt),
    renderTable(receipt.rows),
    renderSectionResults(receipt),
    renderBeforeAfter(receipt),
    renderFooter(receipt),
  ];
  return parts.join("");
}

export { HR_LIGHT };
