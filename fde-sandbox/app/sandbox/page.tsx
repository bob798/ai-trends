"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";
import { loadProgress, type Progress } from "@/lib/progress";

const diffStyle: Record<string, string> = {
  "warm-up": "text-sky-300 border-sky-500/40 bg-sky-500/10",
  core: "text-amber-300 border-amber-500/40 bg-amber-500/10",
  hard: "text-rose-300 border-rose-500/40 bg-rose-500/10",
};

export default function Levels() {
  const [progress, setProgress] = useState<Progress>({});
  useEffect(() => setProgress(loadProgress()), []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Engagements</h1>
      <p className="mt-2 text-zinc-400">
        Each level is a compressed real FDE moment. A senior FDE and the
        customer grade your work on whether it survives production — not
        whether the demo runs.
      </p>

      <div className="mt-8 space-y-5">
        {SCENARIOS.map((s, i) => {
          const p = progress[s.id];
          return (
            <Link
              key={s.id}
              href={`/sandbox/${s.id}`}
              className="block rounded-xl border border-zinc-800 bg-[var(--panel)] p-5 transition hover:border-amber-400/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="mono text-xs uppercase tracking-widest text-zinc-500">
                  Level {i + 1} · {s.customer}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`mono rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${diffStyle[s.difficulty]}`}
                  >
                    {s.difficulty}
                  </span>
                  {p && (
                    <span className="mono rounded border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                      best {p.bestScore}/100 · {p.attempts}{" "}
                      {p.attempts === 1 ? "attempt" : "attempts"}
                    </span>
                  )}
                </div>
              </div>
              <h2 className="mt-2 text-xl font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-zinc-400">{s.tagline}</p>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-zinc-600">
        Your best results feed your{" "}
        <Link href="/portfolio" className="text-amber-400/90 underline-offset-2 hover:underline">
          portfolio
        </Link>{" "}
        — copy it straight into FDE applications.
      </p>
    </main>
  );
}
