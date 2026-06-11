import Anthropic from "@anthropic-ai/sdk";
import { SCENARIO } from "./scenario";

export type DimensionGrade = {
  name: string;
  score: number; // 0-100
  feedback: string;
};

export type Grade = {
  overall_score: number; // 0-100
  verdict: "shipped" | "needs_revision" | "rejected";
  customer_reaction: string; // Dana, in character
  reviewer_summary: string; // senior FDE, in character
  dimensions: DimensionGrade[];
  strengths: string[];
  red_flags: string[];
  portfolio_summary: string; // one line the player can put on a resume
  graded_by: "claude" | "mock";
};

export type Submission = {
  scope: string;
  approach: string;
  production: string;
};

const DIMENSIONS = [
  "Requirement scoping (did they pin down the vague ask before coding?)",
  "Data handling (did they catch the specific dirty-data traps: dedup, mixed date formats, empties/spam, PII, non-English, missing resolutions?)",
  "Retrieval design (sensible chunking/what-gets-embedded, grounded answers, citations)",
  "Production readiness (rate limits/429, rotating key, 504s, no-match behavior, rollout/verification)",
  "Communication (would Dana understand it; did they ask the right question back?)",
];

const MODEL = "claude-opus-4-8";

function buildSystemPrompt(): string {
  return `You are grading a candidate Forward Deployed Engineer (FDE) on a realistic embedded-engagement exercise. You play TWO roles at once:

1. DANA OKAFOR — Acme Logistics' Head of Support. Non-technical, busy, pragmatic. You care about whether your agents will actually trust and use this, not about architecture buzzwords. React the way a real customer would — warm but skeptical, allergic to hand-waving.

2. A SENIOR FDE REVIEWER — you've shipped dozens of these embedded deployments. You know the difference between a demo and something that survives a live customer environment. You are tough but fair. You reward people who scoped the ambiguous ask before coding, who named the specific data traps in THIS dataset, and who planned for the messy reality of production. You penalize generic answers that could have been written without reading the scenario.

THE SCENARIO THE CANDIDATE WAS GIVEN:
- Customer: ${SCENARIO.customer}. The Head of Support sent a deliberately vague Slack ask: "${SCENARIO.slackMessage.text}"
- They got a messy ~2,000-row support-ticket export. Known traps: exact duplicate rows; at least 4 date formats including a raw unix timestamp; empty/spam/mis-routed tickets; free-text resolutions with some missing entirely; inline PII (emails, a card fragment); non-English (Spanish) bodies.
- They must integrate with "acme-support-api": rate-limited 5 req/s (429 on burst), an X-Acme-Key header that rotates daily, p95 ~800ms with occasional 504s, no pagination (max 50 rows/query).

GRADING DIMENSIONS (score each 0-100):
${DIMENSIONS.map((d, i) => `${i + 1}. ${d}`).join("\n")}

SCORING GUIDANCE:
- Be calibrated and stingy with high scores. A generic, plausible-sounding answer that ignores the specific traps in THIS scenario should land 40-60, not 80. Reserve 85+ for answers that demonstrably engaged with the concrete details (named the duplicates, the unix timestamp, the rotating key, the no-match UX, sent a real scoping question back to Dana).
- An answer that jumps straight to building without scoping the ask should be capped hard on "Requirement scoping" no matter how good the rest is.
- overall_score is your holistic weighting, not a strict average — production-readiness and scoping matter most for an FDE.
- verdict: "shipped" (>=80, you'd let this go live), "needs_revision" (50-79), "rejected" (<50).
- customer_reaction: 1-3 sentences as Dana, in character, reacting to what they'd actually experience.
- reviewer_summary: 2-4 sentences as the senior FDE — the single most important thing that would make this better.
- portfolio_summary: ONE resume-ready line describing what they demonstrated (honest — if they did poorly, it should reflect a learning attempt, not a triumph).
- strengths / red_flags: short, concrete, tied to what they actually wrote.

Respond with ONLY a single JSON object, no prose before or after, no markdown fences. Shape:
{
  "overall_score": <int 0-100>,
  "verdict": "shipped" | "needs_revision" | "rejected",
  "customer_reaction": "<string>",
  "reviewer_summary": "<string>",
  "dimensions": [{ "name": "<short dimension name>", "score": <int>, "feedback": "<1-2 sentences>" }],
  "strengths": ["<string>", ...],
  "red_flags": ["<string>", ...],
  "portfolio_summary": "<string>"
}`;
}

function buildUserPrompt(s: Submission): string {
  return `Here is the candidate's submission. Grade it.

=== 1. SCOPE THE ASK ===
${s.scope.trim() || "(left blank)"}

=== 2. DATA + PIPELINE ===
${s.approach.trim() || "(left blank)"}

=== 3. SURVIVE PRODUCTION ===
${s.production.trim() || "(left blank)"}`;
}

function extractJson(text: string): unknown {
  // Be forgiving: strip ``` fences and grab the outermost {...}.
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function gradeWithClaude(s: Submission): Promise<Grade> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return mockGrade(s);

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(s) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text block in Claude response");
  }

  const parsed = extractJson(textBlock.text) as Omit<Grade, "graded_by">;
  return { ...parsed, graded_by: "claude" };
}

// Deterministic heuristic grader so the app is fully demoable with no API key.
// Rewards length + engagement with the specific traps; it is intentionally
// shallow — the real signal comes from Claude.
export function mockGrade(s: Submission): Grade {
  const text = `${s.scope} ${s.approach} ${s.production}`.toLowerCase();
  const hit = (kw: string[]) => kw.some((k) => text.includes(k));

  const signals = {
    scoped: hit(["not building", "out of scope", "ask dana", "question for", "clarify", "scope"]),
    dedup: hit(["dedup", "duplicate"]),
    dates: hit(["timestamp", "date format", "unix", "iso", "normalize date"]),
    pii: hit(["pii", "redact", "card", "email"]),
    noise: hit(["spam", "empty", "mis-rout", "misrout", "test ticket"]),
    lang: hit(["spanish", "language", "non-english", "translate", "multiling"]),
    rate: hit(["429", "rate limit", "rate-limit", "backoff", "retry"]),
    key: hit(["rotat", "key", "auth", "header"]),
    nomatch: hit(["no match", "no good", "i don't know", "fallback", "abstain", "hallucinat"]),
    cite: hit(["citation", "cite", "source", "ticket id", "link to"]),
  };

  const dim = (name: string, keys: (keyof typeof signals)[], base: number) => {
    const hits = keys.filter((k) => signals[k]).length;
    const score = Math.min(95, base + hits * 18);
    return { name, score, hits };
  };

  const lenBonus = Math.min(15, Math.floor((s.scope.length + s.approach.length + s.production.length) / 120));

  const d = [
    dim("Requirement scoping", ["scoped"], 35 + (signals.scoped ? lenBonus : 0)),
    dim("Data handling", ["dedup", "dates", "pii", "noise", "lang"], 25),
    dim("Retrieval design", ["cite", "nomatch"], 40),
    dim("Production readiness", ["rate", "key", "nomatch"], 28),
    dim("Communication", ["scoped"], 40 + lenBonus),
  ];

  const overall = Math.round(d.reduce((a, b) => a + b.score, 0) / d.length);
  const verdict: Grade["verdict"] =
    overall >= 80 ? "shipped" : overall >= 50 ? "needs_revision" : "rejected";

  const strengths: string[] = [];
  if (signals.scoped) strengths.push("Scoped the ask before jumping into code.");
  if (signals.dedup || signals.dates) strengths.push("Caught concrete data-cleaning traps.");
  if (signals.rate || signals.key) strengths.push("Planned for the flaky API contract.");
  if (signals.nomatch) strengths.push("Handled the no-good-match case instead of trusting the model blindly.");

  const red_flags: string[] = [];
  if (!signals.scoped) red_flags.push("Didn't pin down the vague ask or send a question back to Dana.");
  if (!signals.dedup && !signals.dates && !signals.pii) red_flags.push("Glossed over the messy data — the duplicates, mixed dates, and PII are still in there.");
  if (!signals.rate && !signals.key) red_flags.push("No plan for rate limits or the rotating key — this falls over in production.");
  if (!signals.nomatch) red_flags.push("No abstain/fallback path — agents will get confidently wrong answers.");

  return {
    overall_score: overall,
    verdict,
    customer_reaction:
      verdict === "shipped"
        ? "Okay, my agents could actually use this — and it won't make stuff up. Ship it."
        : verdict === "needs_revision"
          ? "It's a start, but I don't trust it to give my agents the right answer yet."
          : "I asked for something my team could lean on — this isn't it yet.",
    reviewer_summary:
      "Heuristic grade (no ANTHROPIC_API_KEY set). " +
      (signals.scoped
        ? "You scoped well — push harder on the production failure modes."
        : "Biggest gap: you started solving before scoping the ask. That's the #1 FDE skill."),
    dimensions: d.map(({ name, score }) => ({
      name,
      score,
      feedback: "Heuristic estimate — set ANTHROPIC_API_KEY for a real review.",
    })),
    strengths: strengths.length ? strengths : ["You showed up and shipped an attempt."],
    red_flags,
    portfolio_summary:
      verdict === "shipped"
        ? "Scoped and shipped a production-aware retrieval-Q&A over messy support data in an Acme Logistics FDE simulation."
        : "Practiced the FDE last-mile: scoping a vague ask and hardening a RAG pipeline against dirty data and a flaky API.",
    graded_by: "mock",
  };
}
