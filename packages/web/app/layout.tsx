import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Musashi · signal receipt",
  description: "Free trading receipts powered by the Musashi API.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
