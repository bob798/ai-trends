// Client-side progress persistence (localStorage). No account needed for MVP.

export type LevelProgress = {
  bestScore: number;
  verdict: string;
  portfolioLine: string;
  attempts: number;
  lastPlayedAt: string; // ISO
};

export type Progress = Record<string, LevelProgress>;

const KEY = "fde-sandbox-progress-v1";
const DRAFT_KEY = "fde-sandbox-drafts-v1";

export function loadProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Progress;
  } catch {
    return {};
  }
}

export function recordResult(
  levelId: string,
  score: number,
  verdict: string,
  portfolioLine: string,
): Progress {
  const all = loadProgress();
  const prev = all[levelId];
  const improved = !prev || score >= prev.bestScore;
  all[levelId] = {
    bestScore: improved ? score : prev.bestScore,
    verdict: improved ? verdict : prev.verdict,
    portfolioLine: improved ? portfolioLine : prev.portfolioLine,
    attempts: (prev?.attempts ?? 0) + 1,
    lastPlayedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export type Draft = { scope: string; approach: string; production: string };

export function loadDraft(levelId: string): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const all = JSON.parse(
      window.localStorage.getItem(DRAFT_KEY) ?? "{}",
    ) as Record<string, Draft>;
    return all[levelId] ?? null;
  } catch {
    return null;
  }
}

export function saveDraft(levelId: string, draft: Draft) {
  try {
    const all = JSON.parse(
      window.localStorage.getItem(DRAFT_KEY) ?? "{}",
    ) as Record<string, Draft>;
    all[levelId] = draft;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
  } catch {
    // best-effort
  }
}
