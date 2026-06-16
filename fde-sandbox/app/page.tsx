import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";
import { QUESTIONS } from "@/lib/interview";

const LOOP: { step: string; title: string; body: string; href: string; cta: string }[] = [
  {
    step: "01",
    title: "Learn the method",
    body: "The repeatable four moves behind every successful engagement — scope, survive the data, harden, communicate.",
    href: "/learn",
    cta: "The playbook",
  },
  {
    step: "02",
    title: "Practice the reps",
    body: `${SCENARIOS.length} simulated engagements. Ship under a vague ask, messy data, and a flaky API — then defend your work when the customer pushes back.`,
    href: "/sandbox",
    cta: "Engagements",
  },
  {
    step: "03",
    title: "Drill the interview",
    body: `${QUESTIONS.length} real FDE-loop questions, graded by a frontier-lab hiring manager who asks the follow-up they'd actually press on.`,
    href: "/interview",
    cta: "Mock interview",
  },
  {
    step: "04",
    title: "Prove it, then apply",
    body: "Your best results become a résumé-ready portfolio and an interview-readiness score. Then take it to the companies hiring.",
    href: "/jobs",
    cta: "Job radar",
  },
];

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

      {/* The full loop */}
      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          The loop
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {LOOP.map((l) => (
            <Link
              key={l.step}
              href={l.href}
              className="group rounded-xl border border-zinc-800 bg-[var(--panel)] p-5 transition hover:border-amber-400/40"
            >
              <div className="flex items-baseline gap-2">
                <span className="mono text-sm font-bold text-amber-400/70">
                  {l.step}
                </span>
                <h3 className="font-semibold">{l.title}</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{l.body}</p>
              <p className="mt-3 text-sm font-semibold text-amber-400 group-hover:underline">
                {l.cta} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* The engagements */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          The engagements
        </h2>
        <div className="mt-4 space-y-3">
          {SCENARIOS.map((s, i) => (
            <Link
              key={s.id}
              href={`/sandbox/${s.id}`}
              className="block rounded-xl border border-zinc-800 bg-[var(--panel)] p-5 transition hover:border-amber-400/40"
            >
              <p className="mono text-xs uppercase tracking-widest text-zinc-500">
                Level {i} · {s.customer}
              </p>
              <h3 className="mt-1.5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-zinc-400">{s.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 text-sm text-zinc-600">
        Your results become résumé-ready portfolio lines and an
        interview-readiness score. No account needed — progress saves in your
        browser.
      </p>
    </main>
  );
}
