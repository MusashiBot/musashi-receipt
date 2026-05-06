import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#efe8d8] px-8 py-16 text-center text-ink">
      <h1 className="text-[40px] font-bold tracking-[0.18em]">MUSASHI</h1>
      <p className="text-muted">
        free trading receipts · no rate limits · no keys
      </p>
      <Link
        href="/r/demo"
        className="rounded-full border border-ink/20 bg-paper px-5 py-2 text-[13px] hover:bg-white"
      >
        view a sample receipt →
      </Link>
    </main>
  );
}
