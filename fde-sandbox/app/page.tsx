import Link from "next/link";

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
        comp around{" "}
        <span className="font-semibold text-white">$385K</span>, postings up{" "}
        <span className="font-semibold text-white">700%+</span> year over year.
        Why? Because <span className="text-white">95% of enterprise AI pilots
        die at the last mile</span> — the gap between a clean demo and a live
        customer system with messy data and a flaky API. Closing that gap is the
        whole job.
      </p>

      <p className="mt-4 text-lg text-zinc-300">
        You can&apos;t learn it from a video. So this isn&apos;t a course.
        It&apos;s a simulator that drops you into the messiest real moment and
        makes you ship.
      </p>

      <div className="mt-10 rounded-xl border border-zinc-800 bg-[var(--panel)] p-6">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          Level 1
        </p>
        <h2 className="mt-2 text-2xl font-semibold">
          Dirty Data RAG — The Last Mile
        </h2>
        <p className="mt-3 text-zinc-400">
          You&apos;re embedded with Acme Logistics&apos; support team. The Head
          of Support sends one vague Slack message and a 2,000-row export full
          of duplicates, broken dates, PII, and spam. Build something their
          agents can actually trust — and keep it alive against a rate-limited,
          key-rotating production API.
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          A senior FDE and the (skeptical) customer grade your work on whether
          it would survive production — not whether the demo runs.
        </p>
        <Link
          href="/sandbox"
          className="mt-6 inline-block rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
        >
          Enter the engagement →
        </Link>
      </div>

      <p className="mt-8 text-sm text-zinc-600">
        Others tell you what an FDE is. This makes you do the rep.
      </p>
    </main>
  );
}
