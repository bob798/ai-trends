import { describe, expect, it } from "vitest";
import { QUESTIONS, getQuestion } from "./interview";

describe("interview question bank", () => {
  it("has unique ids and well-formed entries", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of QUESTIONS) {
      expect(q.question.length).toBeGreaterThan(20);
      expect(q.graderBrief.length).toBeGreaterThan(40);
      expect(q.mockChecks.length).toBeGreaterThan(0);
      for (const c of q.mockChecks) {
        expect(c.keywords.length).toBeGreaterThan(0);
        expect(c.strength.length).toBeGreaterThan(0);
        expect(c.gap.length).toBeGreaterThan(0);
      }
    }
  });

  it("covers all five FDE domains", () => {
    const cats = new Set(QUESTIONS.map((q) => q.category));
    for (const c of ["scoping", "technical", "incident", "judgment", "security"]) {
      expect(cats.has(c as never)).toBe(true);
    }
  });

  it("getQuestion resolves known ids and rejects unknown", () => {
    expect(getQuestion(QUESTIONS[0].id)?.id).toBe(QUESTIONS[0].id);
    expect(getQuestion("does-not-exist")).toBeUndefined();
  });
});
