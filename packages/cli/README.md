# musashi-receipt

Terminal trading receipts for the [Musashi API](https://musashi-api.vercel.app).

Run it after a trading window and you get a colored signal-receipt printout in your terminal — markets scanned, sentiment, confidence, edge per signal, and a summary of $ recovered from the latest API.

## Install

```bash
npx musashi-receipt --demo
```

No install needed — that runs the bundled fixture so you can see the output.

## Usage

```bash
# one-off run for the last 30 minutes of trading
npx musashi-receipt

# auto-print every hour, forever
npx musashi-receipt --every 1h

# also publish each receipt to a shareable web page
npx musashi-receipt --every 1h --web
# → 🧾  receipt: https://r.musashi.bot/r/abc123

# replay a saved Receipt JSON
npx musashi-receipt --from-file session.json
```

## Flags

| Flag | Default | What it does |
| --- | --- | --- |
| `--every <30m\|1h\|2h>` | off | re-runs on a cadence; prints a fresh receipt each time |
| `--window <30m\|1h\|2h>` | `30m` | how far back to summarize trading |
| `--base <url>` | `https://musashi-api.vercel.app` | Musashi API base URL |
| `--web` | off | publishes the receipt to the web and prints a share URL |
| `--web-base <url>` | `https://r.musashi.bot` | web receipt base URL |
| `--unit-size <n>` | `1` | $ multiplier per signal edge |
| `--json` | off | emit `Receipt` JSON instead of pretty output |
| `--from-file <path>` | — | read a Receipt JSON from disk |
| `--demo` | off | render bundled fixture (no API call) |

## License

MIT
