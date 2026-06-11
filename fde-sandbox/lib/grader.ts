import Anthropic from "@anthropic-ai/sdk";
import type { Scenario } from "./scenarios";

export type DimensionGrade = {
  name: string;
  score: number; // 0-100
  feedback: string;
};

export type Grade = {
  overall_score: number; // 0-100
  verdict: "shipped" | "needs_revision" | "rejected";
  customer_reaction: string; // the customer, in character
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

const MODEL = "claude-opus-4-8";

function buildSystemPrompt(scenario: Scenario): string {
  return `You are grading a candidate Forward Deployed Engineer (FDE) on a realistic embedded-engagement exercise. You play TWO roles at once:

1. THE CUSTOMER — ${scenario.slack.from} at ${scenario.customer}. Non-technical (or only semi-technical), busy, pragmatic. You care about whether this actually works for your people, not architecture buzzwords. React the way a real customer would — direct, a little skeptical, allergic to hand-waving.

2. A SENIOR FDE REVIEWER — you've shipped dozens of embedded deployments. You know the difference between a demo and something that survives a live customer environment. You are tough but fair. You reward candidates who engaged with the SPECIFIC details of this scenario, and you penalize generic answers that could have been written without reading it.

THE SCENARIO THE CANDIDATE WAS GIVEN:
${scenario.graderBrief}

THE THREE SECTIONS THEY ANSWERED:
1. ${scenario.prompts.scope.label}: ${scenario.prompts.scope.hint}
2. ${scenario.prompts.approach.label}: ${scenario.prompts.approach.hint}
3. ${scenario.prompts.production.label}: ${scenario.prompts.production.hint}

GRADING DIMENSIONS (score each 0-100):
${scenario.dimensions.map((d, i) => `${i + 1}. ${d}`).join("\n")}

SCORING GUIDANCE:
- Be calibrated and stingy with high scores. A generic, plausible-sounding answer that ignores the specific traps in THIS scenario should land 40-60, not 80. Reserve 85+ for answers that demonstrably engaged with the concrete details of the scenario.
- overall_score is your holistic weighting, not a strict average — the dimensions that involve risk to the customer (production, money, incidents) matter most for an FDE.
- verdict: "shipped" (>=80, you'd let this go live / you'd keep the contract), "needs_revision" (50-79), "rejected" (<50).
- customer_reaction: 1-3 sentences as the customer, in character, reacting to what they'd actually experience.
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

function buildUserPrompt(scenario: Scenario, s: Submission): string {
  return `Here is the candidate's submission. Grade it.

=== ${scenario.prompts.scope.label} ===
${s.scope.trim() || "(left blank)"}

=== ${scenario.prompts.approach.label} ===
${s.approach.trim() || "(left blank)"}

=== ${scenario.prompts.production.label} ===
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

export async function gradeWithClaude(
  scenario: Scenario,
  s: Submission,
): Promise<Grade> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return mockGrade(scenario, s);

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system: buildSystemPrompt(scenario),
    messages: [{ role: "user", content: buildUserPrompt(scenario, s) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text block in Claude response");
  }

  const parsed = extractJson(textBlock.text) as Omit<Grade, "graded_by">;
  return { ...parsed, graded_by: "claude" };
}

// Deterministic heuristic grader so the app is fully demoable with no API key.
// Rewards engagement with the scenario's specific traps; intentionally shallow —
// the real signal comes from Claude.
export function mockGrade(scenario: Scenario, s: Submission): Grade {
  const text = `${s.scope} ${s.approach} ${s.production}`.toLowerCase();

  const hits = scenario.mockChecks.filter((c) =>
    c.keywords.some((k) => text.includes(k)),
  );
  const misses = scenario.mockChecks.filter(
    (c) => !c.keywords.some((k) => text.includes(k)),
  );

  const totalLen =
    s.scope.trim().length + s.approach.trim().length + s.production.trim().length;
  const lenBonus = Math.min(12, Math.floor(totalLen / 150));
  const ratio = hits.length / scenario.mockChecks.length;
  const overall = Math.min(95, Math.round(28 + ratio * 55 + lenBonus));

  const verdict: Grade["verdict"] =
    overall >= 80 ? "shipped" : overall >= 50 ? "needs_revision" : "rejected";

  return {
    overall_score: overall,
    verdict,
    customer_reaction:
      verdict === "shipped"
        ? "Okay — this is something my team could actually rely on. Ship it."
        : verdict === "needs_revision"
          ? "It's a start, but I don't trust it with my team (or my money) yet."
          : "I asked for something we could lean on — this isn't it yet.",
    reviewer_summary:
      "Heuristic grade (no ANTHROPIC_API_KEY set). " +
      (misses.length === 0
        ? "You engaged with every trap in the scenario — set an API key for a real calibrated review."
        : `Biggest gap: ${misses[0].redFlag}`),
    dimensions: scenario.dimensions.map((name) => ({
      name,
      score: overall,
      feedback: "Heuristic estimate — set ANTHROPIC_API_KEY for a real review.",
    })),
    strengths: hits.length
      ? hits.map((h) => h.strength)
      : ["You showed up and shipped an attempt."],
    red_flags: misses.map((m) => m.redFlag),
    portfolio_summary:
      verdict === "shipped"
        ? scenario.portfolioLines.good
        : scenario.portfolioLines.learning,
    graded_by: "mock",
  };
}
