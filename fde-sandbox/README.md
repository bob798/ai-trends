# FDE Sandbox

A learning product for people who want to become **Forward Deployed Engineers** (FDE) —
the hottest, highest-paid role in AI right now. Everyone else *explains* the role;
this makes you **practice** it, then drills you for the interview and points you at
the jobs.

## The wedge

FDE postings are up 700%+ YoY; mid-level total comp ~$385K. The reason the role
exists: **~95% of enterprise AI pilots die at the "last mile"** — the gap between
a clean demo and a live customer system with messy data and a flaky API. You can't
learn that from a video, so this isn't a course — it's a **simulator**.

## The full loop

**Learn → Practice → Defend → Interview → Prove → Apply.**

### 1. Practice — four engagements (`/sandbox`)

Each level compresses one real FDE moment. You scope the ask, handle the mess, and
harden for production; **Claude grades in two voices** (the skeptical customer + a
senior FDE reviewer) on whether it survives production — not whether the demo runs.

| # | Level | The compressed FDE moment |
|---|-------|---------------------------|
| 0 | **The Discovery Call** *(warm-up)* | A COO wants "AI for everything". Pick one wedge from a five-item wishlist using data reality; define a measurable 6-week pilot |
| 1 | **Dirty Data RAG — The Last Mile** | Vague ask + filthy 2k-row ticket export (dupes, 4 date formats, PII, spam, Spanish) + rate-limited key-rotating API |
| 2 | **The Refund Bot vs. The Legacy API** | Real money. 2009 SOAP docs, undocumented ApprovalCode, sandbox ≠ prod, no idempotency keys, Finance audits everything |
| 3 | **It Worked in the Demo** | Production incident: your legal RAG hallucinated a precedent. Diagnose from the trace + metrics, mitigate today, prove it's fixed |

Each result ends with a **follow-up defense round**: the customer fires one pointed
challenge at your weakest spot and you answer live — a satisfied defense bumps your
saved score (`/api/followup`). A collapsible coaching panel scaffolds stuck learners
without giving the answer away.

### 2. Interview — mock FDE loop (`/interview`)

Six real loop questions (scoping, technical, incident, judgment). Claude plays a
frontier-lab hiring manager with a calibrated bar (`strong_hire` / `hire` /
`lean_no_hire` / `no_hire`), gives in-voice feedback, and asks the **follow-up it
would press on next** — revise and resubmit; that rep is the practice.

### 3. Prove & apply

- **Progress & drafts** — saved in localStorage (no account); best score + attempts
  per level *and* per interview question; answers autosave as you type.
- **Portfolio** (`/portfolio`) — best engagement results + interview drills rendered
  as résumé-ready markdown; copy or download `.md`.
- **Playbook** (`/learn`) — the four-part method the sandbox drills (SEO / top-of-funnel).
- **Market** (`/market`) — FDE comp by level, demand stats, who's hiring, with sources.
- **Job radar** (`/jobs`) — curated companies hiring FDEs across three tiers, with
  comp bands and careers links.
- **Email capture** (`/api/subscribe`) — appends to `data/subscribers.jsonl`
  (gitignored). Swap for a real ESP before launch traffic.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

### Grading

- **With `ANTHROPIC_API_KEY` set** → real grading by Claude (`claude-opus-4-8`,
  adaptive thinking), playing the dual customer + senior-FDE reviewer / hiring-manager
  personas per scenario and question.
- **Without a key** → deterministic per-scenario / per-question heuristic graders
  (keyword checks against each challenge's traps) so the whole flow is demoable offline.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export NEXT_PUBLIC_SITE_URL=https://your-domain   # for canonical URLs / sitemap
npm run dev
```

## Stack

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 + `@anthropic-ai/sdk`.
SEO: `app/sitemap.ts`, `app/robots.ts`, OpenGraph/Twitter metadata.

## Layout

```
app/
  page.tsx               landing (pitch + level cards)
  layout.tsx             shared nav (Engagements / Playbook / Interview / Market / Jobs)
  sandbox/page.tsx       level list with per-level progress + overall standing
  sandbox/[id]/page.tsx  level player (renders any scenario; drafts; follow-up defense)
  interview/page.tsx     mock-interview mode with per-question bests
  learn/page.tsx         the FDE Playbook (method content)
  market/page.tsx        salary dashboard + hiring + email capture
  jobs/page.tsx          FDE job radar
  portfolio/page.tsx     engagement + interview results → markdown export
  sitemap.ts, robots.ts  SEO
  api/grade/route.ts     POST {levelId, scope, approach, production} → Grade (+ follow-up challenge)
  api/followup/route.ts  POST {levelId, challenge, reply} → defense judgment
  api/interview/route.ts POST {questionId, answer} → interview review + next follow-up
  api/subscribe/route.ts POST {email} → data/subscribers.jsonl
lib/
  scenarios.ts           the 4 scenarios (artifacts, prompts, grader briefs, mock checks)
  interview.ts           6 interview questions with grading briefs
  grader.ts              scenario-aware Claude grader + follow-up judge + heuristic fallbacks
  progress.ts            localStorage progress (levels + interviews) + draft autosave
  site.ts                canonical site URL
```

## Verified each iteration

`npm run build` clean; all routes 200; grading differentiates strong (~85-93 shipped /
hire) vs weak (~30-40 rejected / no-hire) in heuristic mode; follow-up defense swings
the score within clamp; guards return 400/404 correctly. Claude mode adds calibrated
in-character review.

## Next (not yet built)

- Real in-browser code sandbox (WebContainer) so candidates *run* the pipeline.
- Accounts + server-side progress; Stripe for the paid tier ($29-49/mo full access).
- Live job-listing ingestion; multi-turn conversational engagements.
