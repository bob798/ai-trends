"use client";

import { useState } from "react";
import Link from "next/link";
import { SCENARIO } from "@/lib/scenario";
import type { Grade } from "@/lib/grader";

const verdictStyle: Record<Grade["verdict"], { label: string; cls: string }> = {
  shipped: { label: "SHIPPED ✓", cls: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
  needs_revision: { label: "NEEDS REVISION", cls: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
  rejected: { label: "NOT SHIPPABLE", cls: "text-rose-400 border-rose-500/40 bg-rose-500/10" },
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-400" : score >= 50 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
      <div className={`h-full ${color}`} style={{ width: `${Math.max(3, score)}%` }} />
    </div>
  );
}

export default function Sandbox() {
  const [scope, setScope] = useState("");
  const [approach, setApproach] = useState("");
  const [production, setProduction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setGrade(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, approach, production }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed");
      setGrade(data as Grade);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const p = SCENARIO.prompts;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/" className="mono text-xs text-zinc-500 hover:text-zinc-300">
        ← FDE Sandbox
      </Link>

      <h1 className="mt-4 text-3xl font-bold">
        Level 1 · Dirty Data RAG — The Last Mile
      </h1>
      <p className="mt-2 text-zinc-400">{SCENARIO.role}</p>

      {/* The vague ask */}
      <section className="mt-8 rounded-xl border border-zinc-800 bg-[var(--panel)] p-5">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          Slack · #support-eng
        </p>
        <div className="mt-3 flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/80 text-sm font-bold">
            {SCENARIO.slackMessage.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {SCENARIO.slackMessage.from}
            </p>
            <p className="mt-1 text-zinc-300">{SCENARIO.slackMessage.text}</p>
          </div>
        </div>
      </section>

      {/* The messy data */}
      <section className="mt-6 rounded-xl border border-zinc-800 bg-[var(--panel)] p-5">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          attached · support_export.csv (preview)
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="mono w-full min-w-[680px] text-left text-xs">
            <thead className="text-zinc-500">
              <tr className="border-b border-zinc-800">
                <th className="py-2 pr-3">id</th>
                <th className="py-2 pr-3">created</th>
                <th className="py-2 pr-3">subject</th>
                <th className="py-2 pr-3">body</th>
                <th className="py-2 pr-3">status</th>
                <th className="py-2 pr-3">resolution</th>
                <th className="py-2 pr-3">customer_email</th>
              </tr>
            </thead>
            <tbody className="align-top text-zinc-300">
              {SCENARIO.tickets.map((t, i) => (
                <tr key={i} className="border-b border-zinc-900">
                  <td className="py-2 pr-3 whitespace-nowrap text-amber-300/80">{t.id}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-rose-300/70">{t.created}</td>
                  <td className="py-2 pr-3 max-w-[120px] truncate">{t.subject || <span className="text-zinc-600">∅</span>}</td>
                  <td className="py-2 pr-3 max-w-[220px] truncate">{t.body}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">{t.status}</td>
                  <td className="py-2 pr-3 max-w-[200px] truncate">{t.resolution || <span className="text-zinc-600">∅</span>}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-zinc-500">{t.customer_email ?? <span className="text-zinc-600">null</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 grid gap-1 text-sm text-zinc-400 sm:grid-cols-2">
          {SCENARIO.datasetNotes.map((n, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-rose-400/70">▸</span>
              {n}
            </li>
          ))}
        </ul>
      </section>

      {/* The API contract */}
      <section className="mt-6 rounded-xl border border-zinc-800 bg-[var(--panel)] p-5">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          you must integrate with · {SCENARIO.apiContract.name}
        </p>
        <ul className="mono mt-3 space-y-1 text-sm text-zinc-300">
          {SCENARIO.apiContract.notes.map((n, i) => (
            <li key={i}>· {n}</li>
          ))}
        </ul>
      </section>

      {/* The three answers */}
      <section className="mt-8 space-y-6">
        <Box label={p.scope.label} hint={p.scope.hint} placeholder={p.scope.placeholder} value={scope} onChange={setScope} />
        <Box label={p.approach.label} hint={p.approach.hint} placeholder={p.approach.placeholder} value={approach} onChange={setApproach} />
        <Box label={p.production.label} hint={p.production.hint} placeholder={p.production.placeholder} value={production} onChange={setProduction} />
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

      {grade && <Result grade={grade} />}
    </main>
  );
}

function Box({
  label,
  hint,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-lg font-semibold text-zinc-100">{label}</label>
      <p className="mt-1 text-sm text-zinc-400">{hint}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="mono mt-3 w-full resize-y rounded-lg border border-zinc-800 bg-[#0d1119] p-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-400/50"
      />
    </div>
  );
}

function Result({ grade }: { grade: Grade }) {
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
            Dana · Head of Support
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
              <li key={i} className="flex gap-2"><span className="text-emerald-400">+</span>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-rose-400">Red flags</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {grade.red_flags.length ? grade.red_flags.map((s, i) => (
              <li key={i} className="flex gap-2"><span className="text-rose-400">!</span>{s}</li>
            )) : <li className="text-zinc-500">None flagged.</li>}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-zinc-700 bg-[#0d1119] p-4">
        <p className="mono text-xs uppercase tracking-widest text-zinc-500">
          📋 portfolio line (copy into your résumé / FDE applications)
        </p>
        <p className="mt-2 text-sm text-zinc-200">{grade.portfolio_summary}</p>
      </div>
    </section>
  );
}
