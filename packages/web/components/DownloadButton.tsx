"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

interface Props {
  /** id of the receipt element to capture */
  targetId: string;
  /** filename slug, e.g. "musashi-demo" */
  filename: string;
}

export function DownloadButton({ targetId, filename }: Props) {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    const node = document.getElementById(targetId);
    if (!node) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(node, {
        // 2× retina-quality
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#F5F1E8",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("download failed — try screenshotting the page instead");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="rounded-full border border-ink/20 bg-paper px-4 py-1.5 text-[12px] text-ink transition hover:bg-white disabled:opacity-50"
    >
      {busy ? "rendering…" : "download png"}
    </button>
  );
}
