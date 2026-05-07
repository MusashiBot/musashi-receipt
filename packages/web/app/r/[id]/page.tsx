import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { DownloadButton } from "@/components/DownloadButton";
import { ReceiptCard } from "@/components/Receipt";
import { getReceipt } from "@/lib/store";

const BASE = process.env.NEXT_PUBLIC_RECEIPT_BASE ?? "https://musashi.bot";

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const receipt = await getReceipt(params.id);
  if (!receipt) notFound();

  const shareUrl = `${BASE}/r/${receipt.id}`;
  const qrSvg = await QRCode.toString(shareUrl, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#1a1a1a", light: "#F5F1E800" },
  });

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#efe8d8] py-12">
      <div className="flex flex-col items-center gap-4">
        <ReceiptCard receipt={receipt} qrSvg={qrSvg} shareUrl={shareUrl} />
        <div className="flex items-center gap-3">
          <DownloadButton targetId="receipt" filename={`musashi-${receipt.id}`} />
          <ShareBar shareUrl={shareUrl} />
        </div>
      </div>
    </main>
  );
}

function ShareBar({ shareUrl }: { shareUrl: string }) {
  const x = `https://x.com/intent/tweet?text=${encodeURIComponent(
    "my musashi signal receipt:",
  )}&url=${encodeURIComponent(shareUrl)}`;
  return (
    <div className="flex gap-2 text-[12px] text-muted">
      <a className="hover:text-ink" href={shareUrl}>
        copy link
      </a>
      <span>·</span>
      <a className="hover:text-ink" href={x} target="_blank" rel="noreferrer">
        share on x
      </a>
    </div>
  );
}
