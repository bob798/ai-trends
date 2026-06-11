import { NextResponse } from "next/server";
import { gradeWithClaude, mockGrade, type Submission } from "@/lib/grader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Partial<Submission>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const submission: Submission = {
    scope: String(body.scope ?? ""),
    approach: String(body.approach ?? ""),
    production: String(body.production ?? ""),
  };

  const total =
    submission.scope.trim().length +
    submission.approach.trim().length +
    submission.production.trim().length;

  if (total < 40) {
    return NextResponse.json(
      { error: "Write a real attempt in each box before submitting (40+ chars total)." },
      { status: 400 },
    );
  }

  try {
    const grade = await gradeWithClaude(submission);
    return NextResponse.json(grade);
  } catch (err) {
    // If Claude grading fails for any reason, fall back to the heuristic
    // grader so the candidate still gets feedback rather than an error wall.
    console.error("grade error, falling back to mock:", err);
    const grade = mockGrade(submission);
    return NextResponse.json(grade);
  }
}
