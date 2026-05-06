# musashi-receipt

Trading receipts for the [Musashi API](https://github.com/MusashiBot/musashi-api).

Two surfaces:

- **CLI** — `npx musashi-receipt` prints a colored terminal session of the markets your bot just scanned, with sentiment / confidence / price / edge unlock / ΔPnL columns and a BEFORE/AFTER summary.
- **Web** — publishes the same session as a paper-style receipt at `musashi.bot/r/<id>`, ready to screenshot or share.

## Packages

| Package | Purpose |
| --- | --- |
| `@musashi/receipt-core` | Shared types, Musashi API client, session aggregator, formatters |
| `@musashi/receipt-cli`  | Terminal renderer (image-5 style) |
| `@musashi/receipt-web`  | Next.js app for the public paper receipt (image-6 style) |

## Quickstart

```bash
pnpm install
pnpm demo:cli       # terminal demo against fixture data
pnpm dev:web        # web demo at http://localhost:3000/r/demo
```

## Live usage

```bash
npx musashi-receipt --window 30m --base https://musashi-api.vercel.app --web
```

Drops you a share link like `https://musashi.bot/r/abc123`.

## License

MIT
