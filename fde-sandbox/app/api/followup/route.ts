import { NextResponse } from "next/server";
import { judgeFollowUp, mockFollowUp } from "@/lib/grader";
import { getScenario } from "@/lib/scenarios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let levelId = "";
  let challenge = "";
  let reply = "";
  let originalScore = 0;
  try {
    const body = await req.json();
    levelId = String(body.levelId ?? "");
    challenge = String(body.challenge ?? "");
    reply = String(body.reply ?? "");
    originalScore = Number(body.originalScore ?? 0);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const scenario = getScenario(levelId);
  if (!scenario) return NextResponse.json({ error: "Unknown level" }, { status: 404 });

  if (reply.trim().length < 20) {
    return NextResponse.json(
      { error: "Give a real answer to the challenge first (20+ characters)." },
      { status: 400 },
    );
  }

  try {
    const result = await judgeFollowUp(scenario, challenge, reply, originalScore);
    return NextResponse.json(result);
  } catch (err) {
    console.error("followup error, falling back to mock:", err);
    return NextResponse.json(mockFollowUp(reply));
  }
}
