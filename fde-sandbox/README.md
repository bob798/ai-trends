# FDE Sandbox

A learning product for people who want to become **Forward Deployed Engineers** (FDE) —
the hottest, highest-paid role in AI right now. Everyone else *explains* the role;
this makes you **practice** it.

## The wedge

FDE postings are up 700%+ YoY; mid-level total comp ~$385K. The reason the role
exists: **~95% of enterprise AI pilots die at the "last mile"** — the gap between
a clean demo and a live customer system with messy data and a flaky API. You can't
learn that from a video, so this isn't a course — it's a **simulator**.

## What's in this version (v0.2 — usable)

### Three engagements (`/sandbox`)

| # | Level | The compressed FDE moment |
|---|-------|---------------------------|
| 1 | **Dirty Data RAG — The Last Mile** | Vague ask + filthy 2k-row ticket export (dupes, 4 date formats, PII, spam, Spanish) + rate-limited key-rotating API |
| 2 | **The Refund Bot vs. The Legacy API** | Real money. 2009 SOAP docs, undocumented ApprovalCode, sandbox ≠ prod, no idempotency keys, Finance audits everything |
| 3 | **It Worked in the Demo** | Production incident: your legal RAG hallucinated a precedent. Diagnose from the retrieval trace + metrics, mitigate today, prove it's fixed |

Each level: scope the ask · handle the mess · survive production → **Claude grades
in two voices** (the skeptical customer + a senior FDE reviewer): score, per-dimension
feedback, red flags, and a **résumé-ready portfolio line**.

### Around the levels

- **Progress & drafts** — saved in localStorage (no account); best score + attempts
  per level; answers autosave as you type.
- **Portfolio** (`/portfolio`) — best results rendered as résumé-ready markdown;
  copy or download `.md`.
- **Market page** (`/market`) — FDE comp by level, demand stats, who's hiring,
  with sources. The SEO / top-of-funnel page.
- **Email capture** (`/api/subscribe`) — appends to `data/subscribers.jsonl`
  (gitignored). Swap for a real ESP before launch traffic.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

### Grading

- **With `ANTHROPIC_API_KEY` set** → real grading by Claude (`claude-opus-4-8`),
  playing the dual customer + senior-FDE reviewer persona per scenario.
- **Without a key** → a deterministic per-scenario heuristic grader (keyword
  checks against each level's traps) so the whole flow is demoable offline.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

## Stack

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 + `@anthropic-ai/sdk`.

## Layout

```
app/
  page.tsx               landing (pitch + level cards + market link)
  layout.tsx             shared nav (Engagements / Market / Portfolio)
  sandbox/page.tsx       level list with per-level progress
  sandbox/[id]/page.tsx  level player (renders any scenario; autosaves drafts)
  market/page.tsx        salary dashboard + hiring companies + email capture
  portfolio/page.tsx     best results → markdown export
  api/grade/route.ts     POST {levelId, scope, approach, production} → Grade
  api/subscribe/route.ts POST {email} → data/subscribers.jsonl
lib/
  scenarios.ts           the 3 scenarios (artifacts, prompts, grader briefs, mock checks)
  grader.ts              scenario-aware Claude grader + heuristic fallback
  progress.ts            localStorage progress + draft autosave
```

## Verified

- `npm run build` clean; all 7 routes render (200).
- Grading differentiates per level (strong ≈ 90 shipped / weak ≈ 35-40 rejected
  with red flags) in heuristic mode; Claude mode adds calibrated in-character review.
- Unknown level → 404; short submissions → 400; subscribe validates email and persists.

## Next (not in this version)

- Real in-browser code sandbox (WebContainer) so candidates *run* the pipeline.
- Accounts + server-side progress; Stripe for the paid tier ($29-49/mo full access).
- Job radar with live FDE listings; mock-interview mode.
