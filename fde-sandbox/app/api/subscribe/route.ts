import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// MVP storage: append-only JSONL on disk (data/ is gitignored). Swap for a
// real ESP (Resend/Loops/Mailchimp) before launch traffic.
export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "subscribers.jsonl"),
      JSON.stringify({ email, at: new Date().toISOString() }) + "\n",
      "utf8",
    );
  } catch (err) {
    console.error("subscribe write failed:", err);
    return NextResponse.json(
      { error: "Could not save your subscription — try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
