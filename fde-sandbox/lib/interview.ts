// FDE mock-interview question bank. Each question carries its own grading
// brief (what a senior FDE interviewer probes for) and heuristic checks for
// offline mode.

export type InterviewQuestion = {
  id: string;
  category: "scoping" | "technical" | "incident" | "judgment";
  question: string;
  probes: string; // shown to the candidate as "what this tests"
  graderBrief: string;
  mockChecks: { keywords: string[]; strength: string; gap: string }[];
};

export const QUESTIONS: InterviewQuestion[] = [
  {
    id: "vague-automation",
    category: "scoping",
    question:
      "A customer tells you: “We want AI to automate our operations.” You have a 30-minute call with their COO tomorrow. Walk me through exactly how you'd run it.",
    probes: "Discovery method — can you turn a wish into a scoped, winnable pilot?",
    graderBrief: `A strong answer runs structured discovery rather than pitching solutions: asks about volume/frequency of candidate workflows, current baselines and pain metrics, where the data lives and who owns each workflow, what a visible win means to leadership and on what timeline; then converges on ONE wedge chosen by data-availability and measurable pain, explicitly defers the rest, and ends with concrete asks (data access, a champion, success criteria). Weak answers list AI capabilities, propose architecture on day one, or ask "what AI do you want?".`,
    mockChecks: [
      {
        keywords: ["volume", "how many", "baseline", "metric", "data", "who owns", "process", "today"],
        strength: "Probed volume, baselines, data reality, and ownership — real discovery.",
        gap: "Questions don't probe volume, baselines, or where the data lives.",
      },
      {
        keywords: ["one", "wedge", "single", "narrow", "defer", "not ", "phase"],
        strength: "Converged on one wedge and explicitly deferred the rest.",
        gap: "Never narrowed to a single winnable use case.",
      },
      {
        keywords: ["success", "win", "criteria", "access", "champion", "ask"],
        strength: "Ended with success criteria and concrete asks of the customer.",
        gap: "No success criteria or asks — the call ends with vibes.",
      },
    ],
  },
  {
    id: "wrong-solution-exec",
    category: "judgment",
    question:
      "The customer's CTO insists you build a fine-tuned model on their 300 support tickets, because the board 'wants us to have our own model'. You're confident RAG over their docs solves the actual problem better and cheaper. What do you do?",
    probes: "Customer judgment — pushing back without losing the room.",
    graderBrief: `A strong answer neither caves nor lectures: understands WHY the board wants "their own model" (optics, IP, vendor risk?), quantifies the trade-off concretely (300 tickets is far too little data to fine-tune anything useful; cost/time/maintenance vs RAG), proposes a path that serves the underlying need (e.g. ship RAG for the outcome now, frame it as 'their proprietary AI system built on their data', revisit fine-tuning when data volume justifies it), and ideally suggests a small experiment/eval to let evidence decide. Mentions making the recommendation in writing. Weak answers: just do what the CTO says, or refuse and argue, or fine-tune anyway "to keep them happy".`,
    mockChecks: [
      {
        keywords: ["why", "underlying", "board", "optics", "motivation", "goal"],
        strength: "Dug into why the board wants 'their own model' before arguing tech.",
        gap: "Argued the tech without understanding the board's actual motivation.",
      },
      {
        keywords: ["300", "too little", "not enough data", "overfit", "cost", "maintain", "cheaper"],
        strength: "Quantified the trade-off — 300 tickets can't support a useful fine-tune.",
        gap: "Didn't quantify why fine-tuning on 300 tickets fails.",
      },
      {
        keywords: ["eval", "experiment", "both", "compare", "evidence", "pilot", "measure", "writing", "document"],
        strength: "Let evidence decide (comparative eval) and put the recommendation in writing.",
        gap: "No experiment or written recommendation — it's opinion vs. authority.",
      },
    ],
  },
  {
    id: "rag-messy-docs",
    category: "technical",
    question:
      "Design a question-answering system over a client's 50,000 internal documents: scanned PDFs, Word files, wiki exports, some in German. What breaks first in production, and how do you build so it doesn't?",
    probes: "Technical depth — RAG beyond the tutorial, failure-mode thinking.",
    graderBrief: `A strong answer is organized around failure modes, not a happy-path architecture: OCR quality on scans (gate/score before indexing), dedup and near-dup handling, language detection and multilingual embeddings or translation, chunking that respects document structure, metadata/ACL filtering (who may see what — a classic enterprise breaker), retrieval-score thresholds with an abstain path, citations that must resolve to retrieved docs, eval set built from real user questions, and drift monitoring as the corpus changes. Recognizes ingestion is 80% of the work. Weak answers recite embed→vector-DB→LLM with no failure analysis.`,
    mockChecks: [
      {
        keywords: ["ocr", "scan", "quality", "dedup", "german", "language", "multiling", "translat"],
        strength: "Treated ingestion (OCR, dedup, language) as the real battlefield.",
        gap: "Skipped ingestion reality — scanned PDFs and German docs will wreck the index.",
      },
      {
        keywords: ["acl", "permission", "access control", "who can see", "authoriz"],
        strength: "Caught document-level permissions — the classic enterprise breaker.",
        gap: "Missed ACLs: the system will leak documents to people who shouldn't see them.",
      },
      {
        keywords: ["threshold", "abstain", "citation", "resolve", "hallucinat", "eval", "drift", "monitor"],
        strength: "Grounded answers with thresholds/citations and planned evals + drift monitoring.",
        gap: "No abstain path, citation enforcement, or evals — confident wrong answers ahead.",
      },
    ],
  },
  {
    id: "first-24-hours",
    category: "incident",
    question:
      "Your deployed assistant gave a customer's employee a confidently wrong answer that they acted on. The customer's exec is angry. Walk me through your first 24 hours.",
    probes: "Incident command — composure, sequencing, and honest comms under fire.",
    graderBrief: `A strong answer sequences correctly: contain first (guard or disable the affected path, interim guidance to users), diagnose from evidence (traces, logs, what changed recently), communicate early and honestly with the exec (acknowledge, timeline, what you know/don't know — no spin), then durable fix with proof (eval/regression, monitoring) and a written post-mortem. Distinguishes what's done today vs. this week. Owns the failure rather than blaming the model or the user. Weak answers jump straight to a technical fix with no containment or comms, or lead with excuses.`,
    mockChecks: [
      {
        keywords: ["disable", "guard", "contain", "pause", "interim", "stop"],
        strength: "Contained the blast radius before debugging.",
        gap: "No containment — the system keeps answering while you debug.",
      },
      {
        keywords: ["trace", "log", "evidence", "what changed", "root cause", "diagnos"],
        strength: "Diagnosed from traces and recent changes, not guesswork.",
        gap: "No evidence-based diagnosis — just vibes and patches.",
      },
      {
        keywords: ["tell", "communicat", "exec", "honest", "post-mortem", "postmortem", "write", "own"],
        strength: "Communicated early, honestly, and in writing — and owned it.",
        gap: "No comms plan — the exec hears silence, which reads as hiding.",
      },
    ],
  },
  {
    id: "rate-limit-wall",
    category: "technical",
    question:
      "The customer's internal API rate-limits you to 5 requests/second. Your pipeline needs the equivalent of 50/s at peak. The API team says the limit is non-negotiable. What are your options?",
    probes: "Constraint engineering — creativity inside someone else's rules.",
    graderBrief: `A strong answer generates multiple options and weighs them: client-side token bucket + queue with backpressure (smooth peaks vs. average), batching/coalescing requests if the API allows, caching + TTLs for repeated reads, precomputing/syncing data in off-peak windows (bulk export, CDC, nightly snapshot — change the shape of the problem), prioritization (which calls actually need real-time?), and—importantly—asking what the limit protects to negotiate a different interface (read replica, webhook push, bulk endpoint) rather than the same one faster. Mentions monitoring 429s and never hammering a legacy system into the ground. Weak answers: 'retry harder', 'run more workers', or treating it as unsolvable.`,
    mockChecks: [
      {
        keywords: ["queue", "token bucket", "backpressure", "batch", "coalesc", "cache", "priorit"],
        strength: "Engineered inside the limit: queueing, batching, caching, prioritization.",
        gap: "No client-side engineering — queueing/batching/caching unexplored.",
      },
      {
        keywords: ["off-peak", "export", "snapshot", "sync", "precompute", "nightly", "bulk", "webhook", "replica"],
        strength: "Changed the shape of the problem — bulk sync / push instead of 50/s pulls.",
        gap: "Never questioned whether you need 50/s of THIS api — bulk export or push would dissolve the problem.",
      },
      {
        keywords: ["why", "protect", "negotiate", "ask the", "what the limit"],
        strength: "Asked what the limit protects and negotiated a different interface.",
        gap: "Treated the limit as physics instead of asking what it protects.",
      },
    ],
  },
  {
    id: "usage-flatline",
    category: "judgment",
    question:
      "Six weeks after a successful launch demo, you check the dashboard: weekly active usage of your system at the customer is near zero. The renewal conversation is in a month. What do you do?",
    probes: "Adoption thinking — the deployment isn't done when the code ships.",
    graderBrief: `A strong answer treats this as a discovery problem, not a feature problem: go watch real users (shadow them, talk to the 2-3 who tried it and stopped), segment who never started vs. tried-and-dropped, find where it falls short of the existing workflow (trust? speed? access? wrong moment in the flow?), check whether the champion left or incentives are misaligned, then fix the adoption blocker (integration into the tool they already use, training, trust-building like citations) — and bring an honest usage story + plan to the renewal rather than hiding the number. Weak answers: add features blindly, email a survey and wait, or spin the dashboard.`,
    mockChecks: [
      {
        keywords: ["talk", "watch", "shadow", "interview", "ask the users", "sit with", "observe"],
        strength: "Went to watch real users instead of guessing from the dashboard.",
        gap: "Never talked to or observed the actual users.",
      },
      {
        keywords: ["workflow", "champion", "trust", "integrat", "where they already", "incentive", "habit", "friction"],
        strength: "Diagnosed adoption blockers: workflow fit, trust, champion, incentives.",
        gap: "No adoption diagnosis — usage didn't drop because of missing features.",
      },
      {
        keywords: ["renewal", "honest", "plan", "show", "metric", "baseline"],
        strength: "Walked into the renewal with the honest number and a credible plan.",
        gap: "No renewal strategy — the customer sees the same dashboard you do.",
      },
    ],
  },
];

export function getQuestion(id: string): InterviewQuestion | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
