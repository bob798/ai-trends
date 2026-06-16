import { describe, expect, it } from "vitest";
import { SCENARIOS } from "./scenarios";
import { mockFollowUp, mockGrade, type Submission } from "./grader";

// Build a "strong" submission for a scenario by including one keyword from
// every mock check, so the heuristic grader should score it well.
function strongSubmission(scenarioIndex: number): Submission {
  const s = SCENARIOS[scenarioIndex];
  const kw = s.mockChecks.map((c) => c.keywords[0]).join(", ");
  const filler =
    " — with concrete mechanisms, a staged rollout, monitoring, and a clear owner so this survives in production after I am gone.";
  return {
    scope: `Scope: ${kw}.${filler}`,
    approach: `Approach: ${kw}.${filler}`,
    production: `Production: ${kw}.${filler}`,
  };
}

const EMPTY: Submission = { scope: "", approach: "", production: "" };

describe("mockGrade", () => {
  it("scores a keyword-complete answer higher than an empty one, for every scenario", () => {
    SCENARIOS.forEach((s, i) => {
      const strong = mockGrade(s, strongSubmission(i));
      const weak = mockGrade(s, EMPTY);
      expect(strong.overall_score).toBeGreaterThan(weak.overall_score);
      // strong should hit every check → no red flags; weak → all red flags
      expect(strong.red_flags.length).toBe(0);
      expect(weak.red_flags.length).toBe(s.mockChecks.length);
    });
  });

  it("clamps scores to 0..100 and always returns a follow-up challenge", () => {
    SCENARIOS.forEach((s, i) => {
      const g = mockGrade(s, strongSubmission(i));
      expect(g.overall_score).toBeGreaterThanOrEqual(0);
      expect(g.overall_score).toBeLessThanOrEqual(100);
      expect(g.follow_up_challenge.trim().length).toBeGreaterThan(0);
      expect(g.dimensions.length).toBe(s.dimensions.length);
      expect(["shipped", "needs_revision", "rejected"]).toContain(g.verdict);
      expect(g.graded_by).toBe("mock");
    });
  });

  it("uses the scenario's good portfolio line when shipped, learning line otherwise", () => {
    const s = SCENARIOS[0];
    const shipped = mockGrade(s, strongSubmission(0));
    const rejected = mockGrade(s, EMPTY);
    if (shipped.verdict === "shipped") {
      expect(shipped.portfolio_summary).toBe(s.portfolioLines.good);
    }
    expect(rejected.portfolio_summary).toBe(s.portfolioLines.learning);
  });
});

describe("mockFollowUp", () => {
  it("rewards concrete mechanisms with a positive, clamped delta", () => {
    const r = mockFollowUp(
      "We add a monitor with an alert on drift, a named owner with a runbook, and an audit log reviewed monthly.",
    );
    expect(r.satisfied).toBe(true);
    expect(r.score_delta).toBeGreaterThan(0);
    expect(r.score_delta).toBeLessThanOrEqual(8);
  });

  it("penalizes a short, vague defense", () => {
    const r = mockFollowUp("it will be fine");
    expect(r.satisfied).toBe(false);
    expect(r.score_delta).toBeLessThan(0);
    expect(r.score_delta).toBeGreaterThanOrEqual(-5);
  });
});
