#!/usr/bin/env node
import { runSession, type Receipt } from "@musashi/receipt-core";
import { demoReceipt } from "@musashi/receipt-core/fixture";
import { readFile } from "node:fs/promises";
import { renderReceipt } from "./render.js";

interface Args {
  demo: boolean;
  json: boolean;
  web: boolean;
  base?: string;
  windowMinutes: number;
  unitSize: number;
  fromFile?: string;
  webBase: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    demo: false,
    json: false,
    web: false,
    windowMinutes: 30,
    unitSize: 1,
    webBase: process.env.MUSASHI_WEB_BASE ?? "https://musashi-receipt.vercel.app",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--demo": args.demo = true; break;
      case "--json": args.json = true; break;
      case "--web": args.web = true; break;
      case "--base": args.base = next(); break;
      case "--web-base": args.webBase = next(); break;
      case "--window": args.windowMinutes = parseWindow(next()); break;
      case "--unit-size": args.unitSize = Number(next()); break;
      case "--from-file": args.fromFile = next(); break;
      case "-h":
      case "--help":
        printHelp();
        process.exit(0);
    }
  }
  return args;
}

function parseWindow(input: string | undefined): number {
  if (!input) return 30;
  const m = /^(\d+)([smh])?$/.exec(input.trim());
  if (!m) return Number(input) || 30;
  const v = Number(m[1]);
  const unit = m[2] ?? "m";
  if (unit === "s") return Math.max(1, Math.round(v / 60));
  if (unit === "h") return v * 60;
  return v;
}

function printHelp() {
  process.stdout.write(`musashi-receipt — terminal trading receipts\n
Usage:
  musashi-receipt [--window 30m] [--base URL] [--web]
  musashi-receipt --demo                    # render fixture
  musashi-receipt --from-file session.json  # replay a saved Receipt

Flags:
  --window <30m|2h|45>    window length (default 30m)
  --base <url>            Musashi API base (default https://musashi-api.vercel.app)
  --web                   publish to web receipt and print share URL
  --web-base <url>        web receipt base (default placeholder Vercel URL)
  --unit-size <n>         $ multiplier per signal edge (default 1)
  --json                  emit Receipt JSON instead of pretty output
  --from-file <path>      read a Receipt JSON from disk
  --demo                  render the bundled fixture (no API call)
  -h, --help              show this help
`);
}

async function loadReceipt(args: Args): Promise<Receipt> {
  if (args.demo) return demoReceipt;
  if (args.fromFile) {
    const raw = await readFile(args.fromFile, "utf8");
    return JSON.parse(raw) as Receipt;
  }
  return runSession({
    baseUrl: args.base,
    windowMinutes: args.windowMinutes,
    unitSize: args.unitSize,
  });
}

async function publishWeb(receipt: Receipt, base: string): Promise<string> {
  const res = await fetch(`${base.replace(/\/$/, "")}/api/receipt`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(receipt),
  });
  if (!res.ok) throw new Error(`publish failed: ${res.status}`);
  const data = (await res.json()) as { url: string };
  return data.url;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const receipt = await loadReceipt(args);

  if (args.json) {
    process.stdout.write(JSON.stringify(receipt, null, 2) + "\n");
    return;
  }

  process.stdout.write(renderReceipt(receipt));

  if (args.web) {
    try {
      const url = await publishWeb(receipt, args.webBase);
      process.stdout.write(`\n🧾  receipt: ${url}\n`);
    } catch (err) {
      process.stderr.write(`\nweb publish failed: ${(err as Error).message}\n`);
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  process.stderr.write(`musashi-receipt: ${(err as Error).message}\n`);
  process.exit(1);
});
