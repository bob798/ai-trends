"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getScenario, SCENARIOS, type Artifact, type Scenario } from "@/lib/scenarios";
import type { FollowUpResult, Grade } from "@/lib/grader";
import { loadDraft, recordResult, saveDraft } from "@/lib/progress";

const verdictStyle: Record<Grade["verdict"], { label: string; cls: string }> = {
  shipped: { label: "SHIPPED ✓", cls: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
  needs_revision: { label: "NEEDS REVISION", cls: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
  rejected: { label: "NOT SHIPPABLE", cls: "text-rose-400 border-rose-500/40 bg-rose-500/10" },
};

export default function LevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const scenario = getScenario(id);

  if (!scenario) notFound();
  return <Player scenario={scenario} />;
}

function Player({ scenario }: { scenario: Scenario }) {
  const [scope, setScope] = useState("");
  const [approach, setApproach] = useState("");
  const [production, setProduction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const hydrated = useRef(false);

  // Restore draft once on mount.
  useEffect(() => {
    const d = loadDraft(scenario.id);
    if (d) {
      setScope(d.scope);
      setApproach(d.approach);
      setProduction(d.production);
    }
    hydrated.current = true;
  }, [scenario.id]);

  // Autosave draft (debounced).
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(
      () => saveDraft(scenario.id, { scope, approach, production }),
      600,
    );
    return () => clearTimeout(t);
  }, [scenario.id, scope, approach, production]);

  async function submit() {
    setLoading(true);
    setError(null);
    setGrade(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId: scenario.id, scope, approach, production }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed");
      const g = data as Grade;
      setGrade(g);
      recordResult(scenario.id, g.overall_score, g.verdict, g.portfolio_summary);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const p = scenario.prompts;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/sandbox" className="mono text-xs text-zinc-500 hover:text-zinc-300">
        ← all engagements
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{scenario.title}</h1>
      <p className="mt-2 text-zinc-400">{scenario.role}</p>

      {/* The vague ask */}
      <section className="mt-8 rounded-xl border border-zinc-800 bg-[var(--panel)] p-5">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          Slack · {scenario.customer}
        </p>
        <div className="mt-3 flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/80 text-sm font-bold">
            {scenario.slack.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">{scenario.slack.from}</p>
            <p className="mt-1 text-zinc-300">{scenario.slack.text}</p>
          </div>
        </div>
      </section>

      {scenario.artifacts.map((a, i) => (
        <ArtifactView key={i} artifact={a} />
      ))}

      <details className="group mt-8 rounded-xl border border-zinc-800 bg-[var(--panel)] p-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-300 transition hover:text-amber-300">
          <span className="mono text-amber-400/70">?</span> Stuck? What strong
          submissions tend to cover
          <span className="ml-1 text-zinc-600 group-open:hidden">(reveal)</span>
        </summary>
        <ul className="mt-3 space-y-1.5 text-sm text-zinc-400">
          {scenario.mockChecks.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amber-400/60">▸</span>
              {c.strength}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-zinc-600">
          These are directions, not answers — the reviewer rewards how
          specifically you engage with this scenario.
        </p>
      </details>

      <section className="mt-6 space-y-6">
        <Box box={p.scope} value={scope} onChange={setScope} />
        <Box box={p.approach} value={approach} onChange={setApproach} />
        <Box box={p.production} value={production} onChange={setProduction} />
      </section>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      <button
        onClick={submit}
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-amber-400 px-5 py-4 text-lg font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "The customer is reviewing your work…" : "Ship it for review →"}
      </button>

      {grade && (
        <Result
          grade={grade}
          scenario={scenario}
          next={SCENARIOS[SCENARIOS.findIndex((s) => s.id === scenario.id) + 1]}
        />
      )}
    </main>
  );
}

function ArtifactView({ artifact }: { artifact: Artifact }) {
  if (artifact.kind === "table") {
    return (
      <section className="mt-6 rounded-xl border border-zinc-800 bg-[var(--panel)] p-5">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          {artifact.label}
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="mono w-full min-w-[680px] text-left text-xs">
            <thead className="text-zinc-500">
              <tr className="border-b border-zinc-800">
                {artifact.columns.map((c) => (
                  <th key={c} className="py-2 pr-3">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="align-top text-zinc-300">
              {artifact.rows.map((row, i) => (
                <tr key={i} className="border-b border-zinc-900">
                  {row.map((cell, j) => (
                    <td key={j} className="max-w-[220px] truncate py-2 pr-3">
                      {cell === null || cell === "" ? (
                        <span className="text-zinc-600">∅</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {artifact.notes && (
          <ul className="mt-4 grid gap-1 text-sm text-zinc-400 sm:grid-cols-2">
            {artifact.notes.map((n, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-rose-400/70">▸</span>
                {n}
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  if (artifact.kind === "doc") {
    return (
      <section className="mt-6 rounded-xl border border-zinc-800 bg-[var(--panel)] p-5">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          {artifact.label}
        </p>
        <p className="mt-3 text-sm font-semibold text-zinc-200">{artifact.title}</p>
        <ul className="mono mt-2 space-y-1 text-sm text-zinc-300">
          {artifact.lines.map((n, i) => (
            <li key={i}>· {n}</li>
          ))}
        </ul>
      </section>
    );
  }

  // log
  return (
    <section className="mt-6 rounded-xl border border-zinc-800 bg-[var(--panel)] p-5">
      <p className="mono text-xs uppercase tracking-widest text-zinc-500">
        {artifact.label}
      </p>
      <pre className="mono mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[#0d1119] p-3 text-xs leading-relaxed text-zinc-300">
        {artifact.lines.join("\n")}
      </pre>
    </section>
  );
}

function Box({
  box,
  value,
  onChange,
}: {
  box: { label: string; hint: string; placeholder: string };
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-lg font-semibold text-zinc-100">{box.label}</label>
      <p className="mt-1 text-sm text-zinc-400">{box.hint}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={box.placeholder}
        rows={5}
        className="mono mt-3 w-full resize-y rounded-lg border border-zinc-800 bg-[#0d1119] p-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-400/50"
      />
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-400" : score >= 50 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
      <div className={`h-full ${color}`} style={{ width: `${Math.max(3, score)}%` }} />
    </div>
  );
}

function Result({
  grade,
  scenario,
  next,
}: {
  grade: Grade;
  scenario: Scenario;
  next?: Scenario;
}) {
  const customerFrom = scenario.slack.from;
  const v = verdictStyle[grade.verdict];
  return (
    <section className="mt-10 rounded-xl border border-zinc-700 bg-[var(--panel)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mono text-xs uppercase tracking-widest text-zinc-500">
            Review {grade.graded_by === "mock" && "· heuristic (no API key set)"}
          </p>
          <p className="mt-1 text-5xl font-bold">
            {grade.overall_score}
            <span className="text-2xl text-zinc-500">/100</span>
          </p>
        </div>
        <span className={`mono rounded-lg border px-4 py-2 text-sm font-bold ${v.cls}`}>
          {v.label}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-[#0d1119] p-4">
          <p className="mono text-xs uppercase tracking-widest text-indigo-400/80">
            {customerFrom}
          </p>
          <p className="mt-2 text-sm text-zinc-200">“{grade.customer_reaction}”</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-[#0d1119] p-4">
          <p className="mono text-xs uppercase tracking-widest text-amber-400/80">
            Senior FDE · review
          </p>
          <p className="mt-2 text-sm text-zinc-200">{grade.reviewer_summary}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {grade.dimensions.map((d, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-zinc-200">{d.name}</p>
              <p className="mono text-sm text-zinc-400">{d.score}</p>
            </div>
            <div className="mt-1.5">
              <ScoreBar score={d.score} />
            </div>
            <p className="mt-1.5 text-sm text-zinc-400">{d.feedback}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-emerald-400">What worked</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {grade.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-400">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-rose-400">Red flags</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {grade.red_flags.length ? (
              grade.red_flags.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-rose-400">!</span>
                  {s}
                </li>
              ))
            ) : (
              <li className="text-zinc-500">None flagged.</li>
            )}
          </ul>
        </div>
      </div>

      {grade.follow_up_challenge && (
        <FollowUpChallenge grade={grade} scenario={scenario} />
      )}

      <div className="mt-6 rounded-lg border border-dashed border-zinc-700 bg-[#0d1119] p-4">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          📋 portfolio line (saved to your portfolio)
        </p>
        <p className="mt-2 text-sm text-zinc-200">{grade.portfolio_summary}</p>
        <Link
          href="/portfolio"
          className="mt-3 inline-block text-sm font-semibold text-amber-400 hover:underline"
        >
          View your portfolio →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-5">
        <p className="text-sm text-zinc-400">
          {grade.verdict === "shipped"
            ? "Shipped. Edit your answers above to push the score higher, or take the next engagement."
            : "Edit your answers above and ship again — or move on and come back."}
        </p>
        {next ? (
          <Link
            href={`/sandbox/${next.id}`}
            className="shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
          >
            Next: {next.title} →
          </Link>
        ) : (
          <Link
            href="/sandbox"
            className="shrink-0 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
          >
            All engagements →
          </Link>
        )}
      </div>
    </section>
  );
}

function FollowUpChallenge({
  grade,
  scenario,
}: {
  grade: Grade;
  scenario: Scenario;
}) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FollowUpResult | null>(null);

  async function defend() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId: scenario.id,
          challenge: grade.follow_up_challenge,
          reply,
          originalScore: grade.overall_score,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Judging failed");
      const r = data as FollowUpResult;
      setResult(r);
      if (r.score_delta > 0) {
        const newScore = Math.min(100, grade.overall_score + r.score_delta);
        recordResult(scenario.id, newScore, grade.verdict, grade.portfolio_summary);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
      <p className="mono text-xs uppercase tracking-widest text-indigo-400/80">
        ⚡ the customer pushes back
      </p>
      <p className="mt-2 text-sm text-zinc-200">“{grade.follow_up_challenge}”</p>

      {result ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <span
              className={`mono rounded-lg border px-3 py-1 text-xs font-bold ${
                result.satisfied
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-400"
              }`}
            >
              {result.satisfied ? "DEFENDED" : "NOT CONVINCED"}
            </span>
            <span className="mono text-sm text-zinc-400">
              {result.score_delta > 0 ? `+${result.score_delta}` : result.score_delta} to
              your saved score
            </span>
          </div>
          <p className="text-sm text-zinc-200">“{result.customer_reaction}”</p>
          <p className="text-sm text-zinc-400">{result.reviewer_note}</p>
        </div>
      ) : (
        <>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Answer them directly — concrete mechanisms beat reassurance."
            rows={3}
            className="mono mt-3 w-full resize-y rounded-lg border border-zinc-800 bg-[#0d1119] p-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-indigo-400/50"
          />
          {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
          <button
            onClick={defend}
            disabled={loading}
            className="mt-3 rounded-lg bg-indigo-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-indigo-300 disabled:opacity-50"
          >
            {loading ? "They're weighing it…" : "Defend it →"}
          </button>
        </>
      )}
    </div>
  );
}
