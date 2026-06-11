import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="mono text-xs uppercase tracking-widest text-amber-400/80">
        FDE Sandbox
      </p>
      <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
        Everyone <span className="text-zinc-500">explains</span> the
        forward-deployed engineer role.
        <br />
        Here you <span className="text-amber-400">practice</span> it.
      </h1>

      <p className="mt-6 text-lg text-zinc-300">
        FDE is the hottest, highest-paid role in AI right now — mid-level total
        comp around <span className="font-semibold text-white">$385K</span>,
        postings up <span className="font-semibold text-white">700%+</span> year
        over year. Why? Because{" "}
        <span className="text-white">
          95% of enterprise AI pilots die at the last mile
        </span>{" "}
        — the gap between a clean demo and a live customer system with messy
        data and a flaky API. Closing that gap is the whole job.{" "}
        <Link href="/market" className="text-amber-400 underline-offset-2 hover:underline">
          See the market data →
        </Link>
      </p>

      <p className="mt-4 text-lg text-zinc-300">
        You can&apos;t learn it from a video. So this isn&apos;t a course.
        It&apos;s a simulator that drops you into the messiest real moment and
        makes you ship — then a senior FDE and the (skeptical) customer grade
        whether your work survives production.
      </p>

      <div className="mt-10 space-y-4">
        {SCENARIOS.map((s, i) => (
          <Link
            key={s.id}
            href={`/sandbox/${s.id}`}
            className="block rounded-xl border border-zinc-800 bg-[var(--panel)] p-6 transition hover:border-amber-400/40"
          >
            <p className="mono text-xs uppercase tracking-widest text-zinc-500">
              Level {i + 1} · {s.customer}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{s.tagline}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/sandbox"
          className="rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
        >
          Start the first engagement →
        </Link>
        <Link
          href="/portfolio"
          className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-zinc-200 transition hover:border-zinc-500"
        >
          Your portfolio
        </Link>
      </div>

      <p className="mt-10 text-sm text-zinc-600">
        Your results become résumé-ready portfolio lines. No account needed —
        progress saves in your browser.
      </p>
    </main>
  );
}
