import { describe, expect, it } from "vitest";
import { POST as grade } from "./grade/route";
import { POST as followup } from "./followup/route";
import { POST as interview } from "./interview/route";
import { POST as subscribe } from "./subscribe/route";

function post(body: unknown): Request {
  return new Request("http://test.local/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// These tests exercise the routes' validation guards. With no ANTHROPIC_API_KEY
// the grading routes use their heuristic fallbacks, so no network is hit.

describe("/api/grade", () => {
  it("400s a too-short submission", async () => {
    const res = await grade(post({ levelId: "dirty-data-rag", scope: "a", approach: "b", production: "c" }));
    expect(res.status).toBe(400);
  });
  it("404s an unknown level", async () => {
    const res = await grade(post({ levelId: "nope", scope: "x".repeat(60), approach: "y", production: "z" }));
    expect(res.status).toBe(404);
  });
  it("200s a real submission and returns a graded shape", async () => {
    const res = await grade(
      post({
        levelId: "dirty-data-rag",
        scope: "Scope: dedup duplicates, normalize the unix timestamp, redact PII, ask Dana a scoping question, defer out of scope work.",
        approach: "Approach: handle 429 with backoff, rotate the key, abstain on no match with citations.",
        production: "Production: rate limit backoff, rotating key refresh, no-match fallback, rollout verification.",
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.overall_score).toBe("number");
    expect(["shipped", "needs_revision", "rejected"]).toContain(body.verdict);
    expect(typeof body.follow_up_challenge).toBe("string");
  });
});

describe("/api/followup", () => {
  it("400s a too-short reply", async () => {
    const res = await followup(post({ levelId: "dirty-data-rag", challenge: "c", reply: "ok", originalScore: 60 }));
    expect(res.status).toBe(400);
  });
  it("404s an unknown level", async () => {
    const res = await followup(post({ levelId: "nope", challenge: "c", reply: "a".repeat(40), originalScore: 60 }));
    expect(res.status).toBe(404);
  });
});

describe("/api/interview", () => {
  it("400s a too-short answer", async () => {
    const res = await interview(post({ questionId: "rate-limit-wall", answer: "retry" }));
    expect(res.status).toBe(400);
  });
  it("404s an unknown question", async () => {
    const res = await interview(post({ questionId: "nope", answer: "a".repeat(40) }));
    expect(res.status).toBe(404);
  });
});

describe("/api/subscribe", () => {
  it("400s an invalid email", async () => {
    const res = await subscribe(post({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });
});
