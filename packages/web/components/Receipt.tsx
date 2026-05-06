import type { Receipt } from "@musashi/receipt-core";

function fmtMoney(n: number, opts: { sign?: boolean; integer?: boolean } = {}) {
  const value = n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.integer ? 0 : 2,
    maximumFractionDigits: opts.integer ? 0 : 2,
  });
  if (!opts.sign) return value;
  return `${n >= 0 ? "+" : ""}${value}`;
}

function Rule({ thick = false }: { thick?: boolean }) {
  return <div className={`dashed-rule ${thick ? "thick" : ""}`} aria-hidden />;
}

function HeaderRow({ left, right }: { left: string; right: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function SignalRow({ title, edge }: { title: string; edge: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <span>{title}</span>
      <span>{fmtMoney(edge, { sign: true })}</span>
    </div>
  );
}

function ArbRow({ title, pair, spreadCents }: { title: string; pair: string; spreadCents: number }) {
  return (
    <div className="flex items-start justify-between">
      <span className="flex flex-col leading-tight">
        <span>{title}</span>
        <span className="text-[11px] text-muted">{pair}</span>
      </span>
      <span>{spreadCents}¢</span>
    </div>
  );
}

interface Props {
  receipt: Receipt;
  qrSvg: string;
  shareUrl: string;
}

export function ReceiptCard({ receipt, qrSvg, shareUrl }: Props) {
  const r = receipt;
  return (
    <article
      className="relative w-[420px] bg-paper px-9 pb-0 pt-10 text-[13px] leading-[1.55] text-ink shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ fontFamily: "JetBrains Mono, ui-monospace, monospace" }}
    >
      {/* title */}
      <header className="text-center">
        <h1 className="text-[36px] font-bold tracking-[0.18em]">MUSASHI</h1>
        <p className="mt-1 text-[12px] text-muted">signal receipt</p>
      </header>

      <div className="mt-6">
        <Rule />
      </div>

      {/* date + window + counts */}
      <section className="mt-4 space-y-1.5">
        <HeaderRow left={r.header.date} right={r.header.time} />
        <HeaderRow left="window" right={r.header.window} />
        <HeaderRow left="markets scanned" right={r.header.marketsScanned} />
        <HeaderRow left="signals generated" right={r.header.signalsGenerated} />
      </section>

      <div className="mt-4">
        <Rule />
      </div>

      {/* signals */}
      <section className="mt-4">
        <div className="flex items-baseline justify-between font-semibold">
          <span>SIGNALS</span>
          <span>EDGE</span>
        </div>
        <div className="mt-2 space-y-1">
          {r.signals.map((s) => (
            <SignalRow key={s.title} title={s.title} edge={s.edge} />
          ))}
        </div>
      </section>

      <div className="mt-4">
        <Rule />
      </div>

      {/* arbitrage */}
      <section className="mt-4">
        <div className="flex items-baseline justify-between font-semibold">
          <span>ARBITRAGE</span>
          <span>SPREAD</span>
        </div>
        <div className="mt-2 space-y-2">
          {r.arbitrage.map((a) => (
            <ArbRow key={a.title} title={a.title} pair={a.pair} spreadCents={a.spreadCents} />
          ))}
        </div>
      </section>

      <div className="mt-4">
        <Rule />
      </div>

      {/* subtotal / tax */}
      <section className="mt-3 space-y-1">
        <HeaderRow left="SUBTOTAL" right={fmtMoney(r.subtotal)} />
        <HeaderRow left="TAX" right={r.tax == null ? "—" : fmtMoney(r.tax)} />
      </section>

      <div className="mt-3">
        <Rule thick />
      </div>

      {/* total edge */}
      <section className="mt-3">
        <div className="flex items-baseline justify-between text-[20px] font-bold">
          <span>TOTAL EDGE</span>
          <span className="text-edge">{fmtMoney(r.totalEdge)}</span>
        </div>
      </section>

      <div className="mt-3">
        <Rule thick />
      </div>

      {/* projections */}
      <section className="mt-4 text-[12px]">
        <p className="text-center text-muted">projected @ 24/7 runtime</p>
        <div className="mt-3 space-y-1 pl-6 pr-1">
          <HeaderRow left="daily" right={fmtMoney(r.projections.daily, { integer: true })} />
          <HeaderRow left="monthly" right={fmtMoney(r.projections.monthly, { integer: true })} />
          <HeaderRow left="yearly" right={fmtMoney(r.projections.yearly, { integer: true })} />
        </div>
      </section>

      <div className="mt-4">
        <Rule />
      </div>

      {/* footer */}
      <section className="mt-5 flex flex-col items-center gap-3 pb-2 text-center text-[12px]">
        <p>
          thank you for trading
          <br />
          with musashi
        </p>
        <p>
          <span className="text-violet">free api</span>
          <span className="mx-2 text-muted">·</span>
          <span className="text-violet">musashi.bot</span>
        </p>
        <p className="text-[11px] text-muted">no rate limits · no keys</p>

        <div
          className="mt-1 h-[120px] w-[120px]"
          aria-label={`QR code linking to ${shareUrl}`}
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
        <p className="text-[11px] text-muted">musashi.bot</p>
      </section>

      {/* zigzag bottom edge */}
      <ZigZag />
    </article>
  );
}

function ZigZag() {
  // 26 teeth across the 420px-wide receipt
  const teeth = 26;
  const w = 420;
  const tooth = w / teeth;
  const points: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = i * tooth;
    const y = i % 2 === 0 ? 0 : 12;
    points.push(`${x},${y}`);
  }
  return (
    <svg
      className="-mx-9 mt-4 block w-[calc(100%+4.5rem)]"
      viewBox={`0 0 ${w} 14`}
      preserveAspectRatio="none"
      style={{ height: 14 }}
    >
      <polyline
        points={`0,0 ${points.join(" ")} ${w},0`}
        fill="#F5F1E8"
        stroke="none"
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#1a1a1a"
        strokeOpacity="0.18"
      />
    </svg>
  );
}
