# FDE Sandbox — MVP

A learning product for people who want to become **Forward Deployed Engineers** (FDE) —
the hottest, highest-paid role in AI right now. Everyone else *explains* the role;
this makes you **practice** it.

## The wedge

FDE postings are up 700%+ YoY; mid-level comp ~$385K. The reason the role exists:
**~95% of enterprise AI pilots die at the "last mile"** — the gap between a clean
demo and a live customer system with messy data and a flaky API. You can't learn
that from a video, so this isn't a course — it's a **simulator**.

## What's in this MVP: the killer sandbox level

**Level 1 · "Dirty Data RAG — The Last Mile"** (`/sandbox`)

You're embedded with Acme Logistics' support team. The challenge compresses the
hardest real FDE moment into one exercise:

1. **A vague ask** — the Head of Support sends one hand-wavy Slack message.
2. **Messy data** — a support-ticket export with exact duplicates, 4 date formats
   (incl. a raw unix timestamp), empty/spam/mis-routed rows, inline PII, and
   non-English bodies.
3. **A flaky production API** — rate-limited (429 on burst), a daily-rotating auth
   key, occasional 504s, no pagination.

You answer three boxes that mirror the real job — **scope the ask · handle the
data + pipeline · survive production** — then **Claude grades you in two voices**:
the skeptical customer (Dana) and a senior FDE reviewer, scoring whether your work
would survive production, not whether the demo runs. You get a score, per-dimension
feedback, red flags, and a **résumé-ready portfolio line**.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

### Grading

- **With `ANTHROPIC_API_KEY` set** → real grading by Claude (`claude-opus-4-8`),
  playing the dual customer + senior-FDE reviewer persona.
- **Without a key** → a deterministic heuristic grader runs so the whole flow is
  demoable offline. Set the key for the real experience:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4
- `@anthropic-ai/sdk` — grading via `/api/grade` (Node runtime), `claude-opus-4-8`
  with adaptive thinking, JSON-only structured review output, mock fallback.

## Layout

```
app/
  page.tsx              landing (the pitch + CTA)
  sandbox/page.tsx      the level: ask + data + API contract + 3 answers + result
  api/grade/route.ts    POST → grade (Claude, falls back to heuristic)
lib/
  scenario.ts           the scenario data (Slack msg, messy tickets, API contract)
  grader.ts             Claude grader (dual persona) + heuristic fallback
```

## What's deliberately NOT in the MVP (next)

- A real in-browser code sandbox (WebContainer/cloud) so candidates *run* the pipeline.
- More levels (the flaky-legacy-API level, the modeling level).
- Salary dashboard + FDE job radar (SEO/top-of-funnel), saved progress, portfolio export.
