import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";

export const metadata = {
  title: "The FDE Playbook — how Forward Deployed Engineers ship the last mile",
  description:
    "The repeatable method behind every successful forward-deployed engagement: scope the ambiguous ask, survive the messy data, harden for production, and communicate like the customer's on the hook. With practice drills.",
};

type Section = {
  n: string;
  title: string;
  lede: string;
  points: { h: string; b: string }[];
};

const SECTIONS: Section[] = [
  {
    n: "01",
    title: "Scope the ambiguous ask",
    lede: "Customers never hand you a spec. They hand you a wish. The first deliverable is a sharper version of the question — not code.",
    points: [
      {
        h: "Translate wishes into a wedge",
        b: "“Make the AI do it” is five projects. Your job is to pick the one with the highest pain, the most volume, and data that already exists — and defer the rest out loud, with reasons.",
      },
      {
        h: "Ask the question that changes the build",
        b: "Good discovery questions probe volume, baselines, where the data lives, and who owns the workflow. Send one real question back before you write a line.",
      },
      {
        h: "Write down what you are NOT building",
        b: "An explicit non-goals list is the cheapest way to prevent a death-march pilot. It also signals seniority to the customer.",
      },
    ],
  },
  {
    n: "02",
    title: "Survive the messy data",
    lede: "The demo dataset is clean. The customer's export is not. The gap between them is where most pilots quietly die.",
    points: [
      {
        h: "Assume every trap is present",
        b: "Duplicates, four date formats, a raw unix timestamp, empty/spam rows, inline PII, non-English text, missing fields. Name each one and say what you do about it.",
      },
      {
        h: "Redact before you index",
        b: "PII that lands in an embedding store is a liability you created. Strip it at ingestion, not after an incident.",
      },
      {
        h: "Ground answers; let the system abstain",
        b: "A retrieval score threshold plus an honest “I can't find a source” beats a confident hallucination every time. Citations must resolve to documents you actually retrieved.",
      },
    ],
  },
  {
    n: "03",
    title: "Harden for production",
    lede: "It worked on your laptop. Now it's live against a rate-limited, key-rotating, occasionally-500ing customer API while real money or real decisions move.",
    points: [
      {
        h: "Design for the API contract you were given",
        b: "Backoff on 429s, refresh the rotating key, retry 504s with a budget, respect the no-pagination cap. The contract is the spec — read it like one.",
      },
      {
        h: "Never blind-retry a mutation",
        b: "A timeout is not a failure — it's an unknown. For anything that moves money or state, use an idempotency ledger and reconcile before you resend.",
      },
      {
        h: "Ship with a kill switch and a staged rollout",
        b: "Shadow mode → low-risk slice → expand. Add caps, circuit breakers, an append-only audit trail, and monitoring on the metrics that drift before the incident does.",
      },
    ],
  },
  {
    n: "04",
    title: "Communicate like you're on the hook",
    lede: "You are embedded. The customer judges the engagement on whether they trust the result — and on how you handle the moment it breaks.",
    points: [
      {
        h: "Set expectations about what the AI won't do",
        b: "Naming the limits up front buys you trust later. Human-in-the-loop is a feature you sell, not an apology you make.",
      },
      {
        h: "Prove it, don't promise it",
        b: "Before/after numbers against a baseline, an eval suite that runs on every change, a written incident timeline. Evidence is the deliverable executives remember.",
      },
      {
        h: "When it breaks, lead with the root cause",
        b: "Diagnose from traces and metrics, mitigate today, and show the durable fix. Blaming the model and stopping there ends contracts.",
      },
    ],
  },
];

export default function Learn() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="mono text-xs uppercase tracking-widest text-amber-400/80">
        The playbook
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        How Forward Deployed Engineers ship the last mile
      </h1>
      <p className="mt-4 text-lg text-zinc-300">
        FDE work looks like chaos from the outside — every customer, dataset, and
        API is different. But the method underneath is repeatable. These four
        moves are what separate a demo from something a customer trusts in
        production, and they&apos;re exactly what the{" "}
        <Link href="/sandbox" className="text-amber-400 underline-offset-2 hover:underline">
          sandbox
        </Link>{" "}
        drills.
      </p>

      <nav className="mt-8 grid gap-2 rounded-xl border border-zinc-800 bg-[var(--panel)] p-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <a
            key={s.n}
            href={`#${s.n}`}
            className="flex items-baseline gap-2 text-sm text-zinc-300 transition hover:text-amber-300"
          >
            <span className="mono text-amber-400/70">{s.n}</span>
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-14">
        {SECTIONS.map((s) => (
          <section key={s.n} id={s.n} className="scroll-mt-20">
            <div className="flex items-baseline gap-3">
              <span className="mono text-2xl font-bold text-amber-400/80">{s.n}</span>
              <h2 className="text-2xl font-semibold">{s.title}</h2>
            </div>
            <p className="mt-2 text-zinc-400">{s.lede}</p>
            <div className="mt-5 space-y-4">
              {s.points.map((p) => (
                <div
                  key={p.h}
                  className="rounded-lg border border-zinc-800 bg-[var(--panel)] p-4"
                >
                  <p className="font-semibold text-zinc-100">{p.h}</p>
                  <p className="mt-1 text-sm text-zinc-400">{p.b}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 rounded-xl border border-amber-400/30 bg-amber-400/5 p-6">
        <h2 className="text-xl font-semibold">Now do the reps</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Reading the method is the easy part. Each engagement drops you into a
          real version of these four moves and grades whether your work survives
          production.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {SCENARIOS.map((s, i) => (
            <Link
              key={s.id}
              href={`/sandbox/${s.id}`}
              className="rounded-lg border border-zinc-800 bg-[#0d1119] p-3 text-sm transition hover:border-amber-400/40"
            >
              <span className="mono text-xs text-zinc-500">Level {i}</span>
              <p className="mt-0.5 font-medium text-zinc-200">{s.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
