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
  follow_up_challenge: string; // the customer pushes back, in character
  graded_by: "claude" | "mock";
};

export type FollowUpResult = {
  satisfied: boolean;
  score_delta: number; // -5..+8 applied to the level score
  customer_reaction: string;
  reviewer_note: string;
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
- follow_up_challenge: ONE pointed follow-up the customer fires back, in character, pressing the weakest or riskiest spot in this specific submission (1-2 sentences, ends with a question). The candidate will answer it live.

Respond with ONLY a single JSON object, no prose before or after, no markdown fences. Shape:
{
  "overall_score": <int 0-100>,
  "verdict": "shipped" | "needs_revision" | "rejected",
  "customer_reaction": "<string>",
  "reviewer_summary": "<string>",
  "dimensions": [{ "name": "<short dimension name>", "score": <int>, "feedback": "<1-2 sentences>" }],
  "strengths": ["<string>", ...],
  "red_flags": ["<string>", ...],
  "portfolio_summary": "<string>",
  "follow_up_challenge": "<string>"
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
    follow_up_challenge: misses.length
      ? `Hold on — one thing still worries me. ${misses[0].redFlag} Convince me that won't bite us after you're gone.`
      : "Last question before I sign off: it's 2am three months from now and this thing breaks while you're off the project. Who notices, how, and what do they do?",
    graded_by: "mock",
  };
}

// --- Follow-up defense judging -------------------------------------------

function followUpSystemPrompt(scenario: Scenario): string {
  return `You are still playing ${scenario.slack.from} at ${scenario.customer}, plus the senior FDE reviewer, continuing the same engagement review. You fired a follow-up challenge at the candidate; they just answered it live. Judge the defense.

SCENARIO CONTEXT:
${scenario.graderBrief}

JUDGING:
- satisfied: did the answer concretely address YOUR challenge (not a generic deflection)?
- score_delta: integer from -5 to +8. +5..+8 = a sharp, specific defense that genuinely de-risks the concern; +1..+4 = adequate; 0 = neither helped nor hurt; negative = evasive, hand-wavy, or made you trust them less.
- customer_reaction: 1-2 sentences, in character.
- reviewer_note: 1-2 sentences from the senior FDE on the quality of the defense.

Respond with ONLY a JSON object:
{ "satisfied": <bool>, "score_delta": <int>, "customer_reaction": "<string>", "reviewer_note": "<string>" }`;
}

export async function judgeFollowUp(
  scenario: Scenario,
  challenge: string,
  reply: string,
  originalScore: number,
): Promise<FollowUpResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return mockFollowUp(reply);

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system: followUpSystemPrompt(scenario),
    messages: [
      {
        role: "user",
        content: `Your challenge to the candidate (their original score was ${originalScore}/100):\n"${challenge}"\n\nTheir live answer:\n${reply.trim()}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No text block");
  const parsed = extractJson(textBlock.text) as Omit<FollowUpResult, "graded_by">;
  // Clamp the delta so a single follow-up can't swing the score wildly.
  parsed.score_delta = Math.max(-5, Math.min(8, Math.round(parsed.score_delta)));
  return { ...parsed, graded_by: "claude" };
}

export function mockFollowUp(reply: string): FollowUpResult {
  const text = reply.toLowerCase();
  const concrete = ["monitor", "alert", "runbook", "test", "metric", "owner", "log", "page", "threshold", "review", "audit", "document"].filter(
    (k) => text.includes(k),
  ).length;
  const len = reply.trim().length;
  const delta = len < 60 ? -2 : Math.min(8, 1 + concrete * 2);
  const satisfied = delta >= 3;
  return {
    satisfied,
    score_delta: delta,
    customer_reaction: satisfied
      ? "Okay — that's the kind of specific I needed to hear."
      : "Hmm. That still sounds like hope rather than a plan.",
    reviewer_note:
      "Heuristic judgment (no ANTHROPIC_API_KEY set). Concrete mechanisms (monitors, owners, runbooks, tests) are what win follow-up defenses.",
    graded_by: "mock",
  };
}
