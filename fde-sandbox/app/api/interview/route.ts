import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getQuestion, type InterviewQuestion } from "@/lib/interview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InterviewResult = {
  verdict: "strong_hire" | "hire" | "lean_no_hire" | "no_hire";
  score: number; // 0-100
  feedback: string;
  follow_up: string; // the follow-up question a real interviewer would ask next
  strengths: string[];
  gaps: string[];
  graded_by: "claude" | "mock";
};

const MODEL = "claude-opus-4-8";

function systemPrompt(q: InterviewQuestion): string {
  return `You are a senior Forward Deployed Engineer who runs FDE hiring loops at a frontier AI lab. You are interviewing a candidate. You are warm in tone but hold a high, calibrated bar — this role pays $300K-$450K and the candidate will be alone in front of customers.

THE QUESTION YOU ASKED:
"${q.question}"

WHAT YOU ARE PROBING FOR:
${q.graderBrief}

CALIBRATION:
- strong_hire (85-100): the answer would impress you in a real loop — specific, sequenced, engages the hard parts unprompted.
- hire (70-84): solid; covers most of what you probe for; a real loop would pass them with minor notes.
- lean_no_hire (45-69): generic or missing a load-bearing element; coachable but wouldn't pass today.
- no_hire (<45): hand-waving, wrong sequencing, or dangerous judgment.
- Generic consultant-speak that never touches the question's specifics caps at lean_no_hire.

Also produce the FOLLOW-UP question you would actually ask next in the interview — pick the weakest spot in their answer and press on it, the way a real interviewer would.

Respond with ONLY a single JSON object, no prose, no fences:
{
  "verdict": "strong_hire" | "hire" | "lean_no_hire" | "no_hire",
  "score": <int 0-100>,
  "feedback": "<2-4 sentences, in your interviewer voice, addressed to the candidate>",
  "follow_up": "<the one follow-up question you'd ask next>",
  "strengths": ["<short, specific>", ...],
  "gaps": ["<short, specific>", ...]
}`;
}

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function mockResult(q: InterviewQuestion, answer: string): InterviewResult {
  const text = answer.toLowerCase();
  const hits = q.mockChecks.filter((c) => c.keywords.some((k) => text.includes(k)));
  const misses = q.mockChecks.filter((c) => !c.keywords.some((k) => text.includes(k)));
  const lenBonus = Math.min(10, Math.floor(answer.trim().length / 120));
  const score = Math.min(95, Math.round(30 + (hits.length / q.mockChecks.length) * 55 + lenBonus));
  const verdict: InterviewResult["verdict"] =
    score >= 85 ? "strong_hire" : score >= 70 ? "hire" : score >= 45 ? "lean_no_hire" : "no_hire";
  return {
    verdict,
    score,
    feedback:
      "Heuristic review (no ANTHROPIC_API_KEY set). " +
      (misses.length
        ? `The area a real interviewer would press on: ${misses[0].gap}`
        : "You touched every area this question probes — set an API key for a calibrated interview review."),
    follow_up: misses.length
      ? `Let's dig into the part you didn't cover: ${misses[0].gap.replace(/\.$/, "")} — how would you handle that?`
      : "If I cut your timeline in half, what would you drop first and why?",
    strengths: hits.map((h) => h.strength),
    gaps: misses.map((m) => m.gap),
    graded_by: "mock",
  };
}

export async function POST(req: Request) {
  let questionId = "";
  let answer = "";
  try {
    const body = await req.json();
    questionId = String(body.questionId ?? "");
    answer = String(body.answer ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const q = getQuestion(questionId);
  if (!q) return NextResponse.json({ error: "Unknown question" }, { status: 404 });

  if (answer.trim().length < 30) {
    return NextResponse.json(
      { error: "Give a real answer first (30+ characters)." },
      { status: 400 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json(mockResult(q, answer));

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      system: systemPrompt(q),
      messages: [
        {
          role: "user",
          content: `The candidate's answer:\n\n${answer.trim()}`,
        },
      ],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("No text block");
    const parsed = extractJson(textBlock.text) as Omit<InterviewResult, "graded_by">;
    return NextResponse.json({ ...parsed, graded_by: "claude" });
  } catch (err) {
    console.error("interview grade error, falling back to mock:", err);
    return NextResponse.json(mockResult(q, answer));
  }
}
