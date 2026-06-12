"use client";

import { useState } from "react";
import { QUESTIONS, type InterviewQuestion } from "@/lib/interview";

type InterviewResult = {
  verdict: "strong_hire" | "hire" | "lean_no_hire" | "no_hire";
  score: number;
  feedback: string;
  follow_up: string;
  strengths: string[];
  gaps: string[];
  graded_by: "claude" | "mock";
};

const verdictStyle: Record<InterviewResult["verdict"], { label: string; cls: string }> = {
  strong_hire: { label: "STRONG HIRE", cls: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10" },
  hire: { label: "HIRE", cls: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" },
  lean_no_hire: { label: "LEAN NO-HIRE", cls: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
  no_hire: { label: "NO HIRE", cls: "text-rose-400 border-rose-500/40 bg-rose-500/10" },
};

const catLabel: Record<InterviewQuestion["category"], string> = {
  scoping: "scoping",
  technical: "technical",
  incident: "incident",
  judgment: "judgment",
};

export default function Interview() {
  const [selected, setSelected] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewResult | null>(null);

  function pick(q: InterviewQuestion) {
    setSelected(q);
    setAnswer("");
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: selected.id, answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");
      setResult(data as InterviewResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mono text-xs uppercase tracking-widest text-amber-400/80">
        Interview sprint
      </p>
      <h1 className="mt-3 text-3xl font-bold">FDE mock interview</h1>
      <p className="mt-2 text-zinc-400">
        Real FDE loop questions. Answer one; a senior-FDE hiring manager reviews
        it against the actual bar — then asks the follow-up they&apos;d ask you
        in the room.
      </p>

      {selected ? (
        <section className="mt-8">
          <button
            onClick={() => setSelected(null)}
            className="mono text-xs text-zinc-500 hover:text-zinc-300"
          >
            ← all questions
          </button>
          <div className="mt-4 rounded-xl border border-zinc-800 bg-[var(--panel)] p-5">
            <p className="mono text-xs uppercase tracking-widest text-zinc-500">
              {catLabel[selected.category]} · interviewer asks
            </p>
            <p className="mt-2 text-lg text-zinc-100">{selected.question}</p>
            <p className="mt-3 text-xs text-zinc-500">Tests: {selected.probes}</p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer the way you would out loud — structure beats polish. Aim for the hard parts."
            rows={9}
            className="mono mt-4 w-full resize-y rounded-lg border border-zinc-800 bg-[#0d1119] p-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-400/50"
          />

          {error && (
            <p className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-amber-400 px-5 py-4 text-lg font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Interviewer is taking notes…" : "Submit answer →"}
          </button>

          {result && (
            <div className="mt-8 rounded-xl border border-zinc-700 bg-[var(--panel)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-4xl font-bold">
                  {result.score}
                  <span className="text-xl text-zinc-500">/100</span>
                </p>
                <span
                  className={`mono rounded-lg border px-4 py-2 text-sm font-bold ${verdictStyle[result.verdict].cls}`}
                >
                  {verdictStyle[result.verdict].label}
                </span>
              </div>
              {result.graded_by === "mock" && (
                <p className="mono mt-2 text-xs text-zinc-600">
                  heuristic review (no API key set)
                </p>
              )}
              <p className="mt-4 text-sm text-zinc-200">{result.feedback}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Landed</p>
                  <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                    {result.strengths.length ? (
                      result.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-emerald-400">+</span>
                          {s}
                        </li>
                      ))
                    ) : (
                      <li className="text-zinc-500">—</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-rose-400">
                    Where I&apos;d press
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                    {result.gaps.length ? (
                      result.gaps.map((g, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-rose-400">!</span>
                          {g}
                        </li>
                      ))
                    ) : (
                      <li className="text-zinc-500">Nothing major.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4">
                <p className="mono text-xs uppercase tracking-widest text-amber-400/80">
                  the follow-up they&apos;d ask next
                </p>
                <p className="mt-2 text-sm text-zinc-200">{result.follow_up}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  Edit your answer above to address it, then submit again — that
                  rep is the practice.
                </p>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-8 space-y-3">
          {QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => pick(q)}
              className="block w-full rounded-xl border border-zinc-800 bg-[var(--panel)] p-5 text-left transition hover:border-amber-400/40"
            >
              <p className="mono text-xs uppercase tracking-widest text-zinc-500">
                {catLabel[q.category]}
              </p>
              <p className="mt-2 text-zinc-100">{q.question}</p>
              <p className="mt-2 text-xs text-zinc-500">Tests: {q.probes}</p>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
