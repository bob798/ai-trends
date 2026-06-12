import Link from "next/link";

export const metadata = {
  title: "FDE Job Radar — who's hiring Forward Deployed Engineers (2026)",
  description:
    "A curated radar of companies hiring Forward Deployed Engineers in 2026: frontier labs, enterprise AI, and vertical AI startups — with comp bands and where to apply.",
};

type Company = {
  name: string;
  tier: "frontier" | "enterprise" | "vertical";
  roles: string;
  comp: string;
  note: string;
  careers: string;
};

const COMPANIES: Company[] = [
  {
    name: "Anthropic",
    tier: "frontier",
    roles: "Forward Deployed Engineer, Applied AI",
    comp: "$500K–$785K+ (senior)",
    note: "FDE unit embedding Claude inside financial-services and enterprise customers.",
    careers: "https://www.anthropic.com/careers",
  },
  {
    name: "OpenAI",
    tier: "frontier",
    roles: "Forward Deployed Engineer (The Deployment Company)",
    comp: "$500K–$785K+ (senior)",
    note: "Dedicated FDE business unit launched May 2026 with $4B+ in enterprise commitments.",
    careers: "https://openai.com/careers",
  },
  {
    name: "Palantir",
    tier: "enterprise",
    roles: "Forward Deployed Software Engineer (Delta)",
    comp: "~$215K median total comp",
    note: "The company that invented the role. Highest FDE headcount in the industry; the classic training ground.",
    careers: "https://www.palantir.com/careers",
  },
  {
    name: "Mistral",
    tier: "frontier",
    roles: "Applied AI Engineer / FDE",
    comp: "competitive EU + US bands",
    note: "European frontier lab building out enterprise deployment teams.",
    careers: "https://mistral.ai/careers",
  },
  {
    name: "Cohere",
    tier: "frontier",
    roles: "Member of Technical Staff, Deployment",
    comp: "$300K–$450K (mid)",
    note: "Enterprise-focused lab; deployments concentrated in regulated industries.",
    careers: "https://cohere.com/careers",
  },
  {
    name: "Sierra",
    tier: "vertical",
    roles: "Agent Engineer (forward deployed)",
    comp: "$300K–$450K (mid)",
    note: "Customer-service agents; agent engineers embed with each enterprise account.",
    careers: "https://sierra.ai/careers",
  },
  {
    name: "Harvey",
    tier: "vertical",
    roles: "Forward Deployed Engineer, Legal AI",
    comp: "$300K–$450K (mid)",
    note: "Legal AI deployed inside top law firms — heavy on trust, citations, and white-glove rollout.",
    careers: "https://www.harvey.ai/careers",
  },
  {
    name: "Scale AI",
    tier: "enterprise",
    roles: "Forward Deployed Engineer, GenAI",
    comp: "$300K–$450K (mid)",
    note: "Enterprise + government GenAI programs; strong data-pipeline flavor.",
    careers: "https://scale.com/careers",
  },
  {
    name: "Glean",
    tier: "vertical",
    roles: "Solutions / Deployment Engineer",
    comp: "$250K–$400K",
    note: "Enterprise search + RAG over messy corpora — the Level 1 skillset, professionally.",
    careers: "https://www.glean.com/careers",
  },
  {
    name: "Databricks",
    tier: "enterprise",
    roles: "Resident Solutions Architect / AI FDE",
    comp: "$250K–$400K",
    note: "Data-platform deployments with a fast-growing GenAI practice.",
    careers: "https://www.databricks.com/company/careers",
  },
];

const tierStyle: Record<Company["tier"], { label: string; cls: string }> = {
  frontier: { label: "frontier lab", cls: "text-violet-300 border-violet-500/40 bg-violet-500/10" },
  enterprise: { label: "enterprise AI", cls: "text-sky-300 border-sky-500/40 bg-sky-500/10" },
  vertical: { label: "vertical AI", cls: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10" },
};

export default function Jobs() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mono text-xs uppercase tracking-widest text-amber-400/80">
        Job radar · June 2026
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        Who&apos;s hiring Forward Deployed Engineers
      </h1>
      <p className="mt-3 text-zinc-400">
        A curated radar across the three tiers that hire FDEs — frontier labs,
        enterprise AI, and vertical AI startups. 224+ open roles were tracked
        across the industry this spring; these are the anchor companies.
      </p>

      <div className="mt-8 space-y-4">
        {COMPANIES.map((c) => (
          <div
            key={c.name}
            className="rounded-xl border border-zinc-800 bg-[var(--panel)] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{c.name}</h2>
              <span
                className={`mono rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${tierStyle[c.tier].cls}`}
              >
                {tierStyle[c.tier].label}
              </span>
            </div>
            <p className="mono mt-1 text-sm text-zinc-400">{c.roles}</p>
            <p className="mt-2 text-sm text-zinc-400">{c.note}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="mono text-sm font-semibold text-emerald-300">{c.comp}</span>
              <a
                href={c.careers}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-amber-400 underline-offset-2 hover:underline"
              >
                careers page →
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-zinc-600">
        Comp bands aggregate published 2026 reports (see{" "}
        <Link href="/market" className="underline-offset-2 hover:text-zinc-400 hover:underline">
          market sources
        </Link>
        ) and vary by location, level, and equity. Careers links go to company
        pages — listings change weekly.
      </p>

      <section className="mt-10 rounded-xl border border-amber-400/30 bg-amber-400/5 p-6">
        <h2 className="text-xl font-semibold">Before you apply</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Every loop on this page asks variations of the same six questions —
          and expects you to have done the job before you've had the job. Walk
          in with reps and a portfolio instead of enthusiasm:
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/interview"
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
          >
            Drill the interview →
          </Link>
          <Link
            href="/sandbox"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
          >
            Build the portfolio →
          </Link>
        </div>
      </section>
    </main>
  );
}
