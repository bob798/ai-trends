import Link from "next/link";
import { SubscribeForm } from "./subscribe-form";

export const metadata = {
  title: "FDE Market — salaries & demand for Forward Deployed Engineers (2026)",
  description:
    "How much do Forward Deployed Engineers make in 2026? Compensation by level, who's hiring, and why demand grew 700%+ — with sources.",
};

const COMP = [
  { level: "Entry / new-grad FDE", range: "$150K – $215K", note: "Palantir median total comp sits around $215K" },
  { level: "Mid-level FDE", range: "$300K – $450K", note: "2026 median mid-level total comp ≈ $385K" },
  { level: "Staff FDE", range: "$500K – $700K", note: "staff-level median ≈ $610K" },
  { level: "Senior FDE @ frontier labs", range: "$500K – $785K+", note: "OpenAI / Anthropic senior bands" },
  { level: "Principal FDE @ frontier labs", range: "$1M+", note: "principal-level packages clearing $1.2M" },
];

const DEMAND = [
  { stat: "729–800%", label: "year-over-year growth in FDE job postings (2025→2026)" },
  { stat: "224+", label: "open FDE roles tracked across 39+ AI companies" },
  { stat: "95%", label: "of enterprise GenAI pilots fail to reach production P&L impact (MIT) — the gap FDEs close" },
  { stat: "$4B+", label: "enterprise commitments behind OpenAI's dedicated FDE business unit" },
];

const HIRING = [
  "OpenAI", "Anthropic", "Palantir", "Mistral", "Cohere", "Scale AI",
  "Sierra", "Harvey", "Glean", "Databricks", "Datadog", "Retool",
];

const SOURCES = [
  { name: "Perspective AI — 2026 FDE Compensation Report (1,200 FDEs)", url: "https://getperspective.ai/blog/2026-forward-deployed-engineering-compensation-report-1200-fdes" },
  { name: "The New Stack — FDE is AI's hottest job", url: "https://thenewstack.io/forward-deployed-engineer-fde-openai-google/" },
  { name: "Pragmatic Engineer — What are Forward Deployed Engineers?", url: "https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers" },
  { name: "JobsByCulture — FDE boom: 224 open roles", url: "https://jobsbyculture.com/blog/forward-deployed-engineer-boom-2026" },
];

export default function Market() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mono text-xs uppercase tracking-widest text-amber-400/80">
        The market · June 2026
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        What Forward Deployed Engineers actually make
      </h1>
      <p className="mt-3 text-zinc-400">
        The role exists because demos don&apos;t survive contact with real
        customer systems. Companies pay for the people who make them survive.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {DEMAND.map((d) => (
          <div key={d.label} className="rounded-xl border border-zinc-800 bg-[var(--panel)] p-4">
            <p className="text-2xl font-bold text-amber-400">{d.stat}</p>
            <p className="mt-1 text-xs text-zinc-400">{d.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Total compensation by level</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--panel)] text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Total comp (US)</th>
                <th className="px-4 py-3 font-medium">Reference point</th>
              </tr>
            </thead>
            <tbody>
              {COMP.map((r) => (
                <tr key={r.level} className="border-t border-zinc-800">
                  <td className="px-4 py-3 text-zinc-200">{r.level}</td>
                  <td className="mono px-4 py-3 font-semibold text-emerald-300">{r.range}</td>
                  <td className="px-4 py-3 text-zinc-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-zinc-600">
          Figures aggregate published 2026 reports (see sources) — bands vary by
          location, equity, and company stage.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Who&apos;s hiring FDEs</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {HIRING.map((c) => (
            <span
              key={c}
              className="mono rounded-lg border border-zinc-800 bg-[var(--panel)] px-3 py-1.5 text-sm text-zinc-300"
            >
              {c}
            </span>
          ))}
          <span className="mono rounded-lg border border-dashed border-zinc-700 px-3 py-1.5 text-sm text-zinc-500">
            + dozens of vertical-AI startups
          </span>
        </div>
        <Link
          href="/jobs"
          className="mt-4 inline-block text-sm font-semibold text-amber-400 underline-offset-2 hover:underline"
        >
          See the full job radar with comp bands →
        </Link>
      </section>

      <section className="mt-10 rounded-xl border border-amber-400/30 bg-amber-400/5 p-6">
        <h2 className="text-xl font-semibold">The skill they all interview for</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Every FDE interview probes the same thing: can you take a vague ask,
          messy data, and a hostile production environment — and ship something
          the customer trusts? That&apos;s exactly what the sandbox makes you
          practice.
        </p>
        <Link
          href="/sandbox"
          className="mt-4 inline-block rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
        >
          Practice it now →
        </Link>
      </section>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-[var(--panel)] p-6">
        <h2 className="text-lg font-semibold">FDE market brief — monthly</h2>
        <p className="mt-1 text-sm text-zinc-400">
          New levels, fresh comp data, and open FDE roles. No spam.
        </p>
        <SubscribeForm />
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Sources
        </h2>
        <ul className="mt-3 space-y-1 text-sm">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 underline-offset-2 hover:text-amber-300 hover:underline"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
