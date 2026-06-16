// Multi-level scenario system. Each level compresses one real FDE moment:
// a vague ask + messy reality + production that must not break.

export type Artifact =
  | {
      kind: "table";
      label: string;
      columns: string[];
      rows: (string | null)[][];
      notes?: string[];
    }
  | { kind: "doc"; label: string; title: string; lines: string[] }
  | { kind: "log"; label: string; lines: string[] };

export type PromptBox = { label: string; hint: string; placeholder: string };

export type MockCheck = {
  keywords: string[];
  strength: string;
  redFlag: string;
};

export type Scenario = {
  id: string;
  title: string;
  tagline: string;
  difficulty: "warm-up" | "core" | "hard";
  customer: string;
  role: string;
  slack: { from: string; avatar: string; text: string };
  artifacts: Artifact[];
  prompts: { scope: PromptBox; approach: PromptBox; production: PromptBox };
  // Scenario facts handed to the Claude grader so it can judge specificity.
  graderBrief: string;
  dimensions: string[];
  mockChecks: MockCheck[];
  portfolioLines: { good: string; learning: string };
};

// ---------------------------------------------------------------------------
// LEVEL 1 — Dirty Data RAG (the killer level)
// ---------------------------------------------------------------------------

const level1: Scenario = {
  id: "dirty-data-rag",
  title: "Dirty Data RAG — The Last Mile",
  tagline:
    "A vague ask, a filthy ticket export, and a flaky production API. The classic.",
  difficulty: "core",
  customer: "Acme Logistics",
  role: "You've been embedded with Acme's Support team for the week.",
  slack: {
    from: "Dana Okafor — Head of Support",
    avatar: "DO",
    text: "hey! our agents waste hours digging through old tickets to answer customers. can you build us something where they just ask a question and get the answer? we've got the export attached. need it by friday 🙏",
  },
  artifacts: [
    {
      kind: "table",
      label: "attached · support_export.csv (preview — full export ~2,000 rows)",
      columns: [
        "id",
        "created",
        "subject",
        "body",
        "status",
        "resolution",
        "customer_email",
      ],
      rows: [
        [
          "TK-1043",
          "2024/03/02",
          "Where is my order??",
          "Order #88213 was supposed to arrive 3 days ago. Tracking hasn't updated. This is the SECOND time.",
          "resolved",
          "Carrier delay. Reshipped via expedited. Refunded shipping ($12.99).",
          "marco.r@example.com",
        ],
        [
          "TK-1044",
          "03-02-2024",
          "refund policy?",
          "¿Cuál es la política de reembolso para productos dañados?",
          "resolved",
          "Damaged items: full refund within 30 days with photo. Replacement offered.",
          null,
        ],
        [
          "TK-1044",
          "03-02-2024",
          "refund policy?",
          "¿Cuál es la política de reembolso para productos dañados?",
          "resolved",
          "Damaged items: full refund within 30 days with photo. Replacement offered.",
          null,
        ],
        [
          "TK-1051",
          "Mar 4 2024 14:22",
          "",
          "the discount code BLACKFRI didnt work at checkout said expired but ur email said valid til today",
          "resolved",
          "Code expired at midnight UTC. Issued one-time 15% code.",
          "  Jenna.K@EXAMPLE.com ",
        ],
        [
          "TK-1052",
          "1709568000",
          "Cancel subscription",
          "I want to cancel. card ending 4471. charge me again and I will dispute.",
          "open",
          "",
          "d_lee@example.com",
        ],
        [
          "TK-1060",
          "2024/03/05",
          "Re: Re: FWD: damaged box",
          "box arrived crushed. item ok but box destroyed. do i need to return anything for the partial refund you mentioned",
          "resolved",
          "Cosmetic box damage, item fine: no return needed. $10 goodwill credit applied.",
          "priya@example.com",
        ],
        [
          "TK-1077",
          "2024/03/06",
          "asdfasdf",
          "test ignore",
          "closed",
          "Spam / test ticket.",
          "qa@acme-internal.com",
        ],
        [
          "TK-1081",
          "2024/03/07",
          "wholesale pricing",
          "Do you offer bulk pricing for orders over 500 units? Need a quote for procurement.",
          "escalated",
          "Routed to Sales. Not a support matter.",
          "ops@bigbuyer.example.com",
        ],
      ],
      notes: [
        "Dates appear in at least 4 formats (incl. a raw unix timestamp).",
        "There are exact duplicate rows.",
        "Some bodies are non-English; some are empty, spam, or mis-routed.",
        "Resolutions are free text; some tickets have none.",
        "Emails/card fragments appear inline (PII).",
      ],
    },
    {
      kind: "doc",
      label: "you must integrate with · acme-support-api",
      title: "Internal API notes (from Acme IT)",
      lines: [
        "POST /search — rate-limited to 5 req/s, returns 429 on burst.",
        "Auth via X-Acme-Key header; key rotates daily.",
        "p95 latency 800ms; occasional 504s under load.",
        "No pagination — returns at most 50 rows per query.",
      ],
    },
  ],
  prompts: {
    scope: {
      label: "1 — Scope the ask",
      hint: "Dana's request is vague. Before any code: what exactly are you building, what are you explicitly NOT building this week, and what one question would you send back to Dana? (This step is where most people lose points by jumping to code.)",
      placeholder:
        "e.g. Building: a retrieval-Q&A over resolved tickets for agents...\nNot building: ...\nQuestion for Dana: ...",
    },
    approach: {
      label: "2 — Handle the data + pipeline",
      hint: "How do you turn this messy export into something a retrieval pipeline can actually answer from? Call out the specific dirty-data traps above and what you do about each (dedup, dates, empties/spam, PII, non-English, tickets with no resolution).",
      placeholder:
        "Ingestion & cleaning: ...\nChunking / what gets embedded: ...\nRetrieval approach: ...",
    },
    production: {
      label: "3 — Survive production",
      hint: "It demos fine on your laptop. Now it's live against acme-support-api with real load. What breaks, and how do you keep it from breaking? (Think: the API contract above, wrong/empty answers, the rotating key, what an agent sees when retrieval finds nothing.)",
      placeholder:
        "Failure modes & handling: ...\nWhat happens on no good match: ...\nRollout / how you'd verify it works before Friday: ...",
    },
  },
  graderBrief: `Customer: Acme Logistics. The Head of Support (Dana) sent a deliberately vague Slack ask: "build us something where agents just ask a question and get the answer", deadline Friday.
The candidate got a messy ~2,000-row support-ticket export. Known traps: exact duplicate rows; at least 4 date formats including a raw unix timestamp; empty/spam/mis-routed tickets; free-text resolutions with some missing entirely; inline PII (emails, a card fragment); non-English (Spanish) bodies.
They must integrate with "acme-support-api": rate-limited 5 req/s (429 on burst), an X-Acme-Key header that rotates daily, p95 ~800ms with occasional 504s, no pagination (max 50 rows/query).
Reward: scoping the ambiguous ask before coding (incl. a real question back to Dana), naming the specific data traps and concrete handling, grounded retrieval with citations/abstain behavior, and production hardening (backoff on 429, key rotation handling, 504 retries, no-match UX, a verification/rollout plan).`,
  dimensions: [
    "Requirement scoping",
    "Data handling",
    "Retrieval design",
    "Production readiness",
    "Communication",
  ],
  mockChecks: [
    {
      keywords: ["not building", "out of scope", "question for", "clarify", "ask dana", "scope"],
      strength: "Scoped the ask before jumping into code.",
      redFlag: "Didn't pin down the vague ask or send a question back to Dana.",
    },
    {
      keywords: ["dedup", "duplicate", "unix", "date format", "timestamp", "normalize"],
      strength: "Caught concrete data-cleaning traps (duplicates / date formats).",
      redFlag: "Glossed over the messy data — the duplicates and mixed dates are still in there.",
    },
    {
      keywords: ["pii", "redact", "card", "anonymi"],
      strength: "Handled PII before it reached the embedding store.",
      redFlag: "PII (emails, card fragment) flows straight into the index.",
    },
    {
      keywords: ["429", "rate limit", "rate-limit", "backoff", "rotat", "retry", "504"],
      strength: "Planned for the flaky API contract (rate limits / rotating key).",
      redFlag: "No plan for rate limits or the rotating key — this falls over in production.",
    },
    {
      keywords: ["no match", "abstain", "fallback", "i don't know", "hallucinat", "citation", "cite", "threshold"],
      strength: "Handled the no-good-match case instead of trusting the model blindly.",
      redFlag: "No abstain/fallback path — agents will get confidently wrong answers.",
    },
  ],
  portfolioLines: {
    good: "Scoped and shipped a production-aware retrieval-Q&A over a messy 2K-row support export (dedup, PII redaction, abstain-on-low-confidence) hardened against a rate-limited, key-rotating API — Acme Logistics FDE simulation.",
    learning:
      "Practiced the FDE last-mile: scoping a vague ask and hardening a RAG pipeline against dirty data and a flaky API.",
  },
};

// ---------------------------------------------------------------------------
// LEVEL 2 — Refunds & the Legacy API (money is on the line)
// ---------------------------------------------------------------------------

const level2: Scenario = {
  id: "legacy-refund-bot",
  title: "The Refund Bot vs. The Legacy API",
  tagline:
    "Automate refunds against a 2009-era SOAP API with broken docs. Real money. Finance audits everything.",
  difficulty: "hard",
  customer: "Meridian Retail",
  role: "You're embedded with Meridian's Ops team. Finance is watching.",
  slack: {
    from: "Sam Veld — Director of Operations",
    avatar: "SV",
    text: "we burn 40+ hrs/week processing refunds by hand. just make the AI do it end to end. IT says you can hit the OMS API. one thing: do NOT break anything — finance audits every refund and last vendor who touched OMS took checkout down for 6 hours.",
  },
  artifacts: [
    {
      kind: "doc",
      label: "attached · OMS_API_GUIDE.doc (last updated 2009)",
      title: "Meridian OMS — Partner Integration Guide v2.3",
      lines: [
        "POST /oms/soap/ProcessRefund — XML body. Required: <OrderRef>, <Amount>, <ApprovalCode>.",
        "NOTE: ApprovalCode issuance is handled by the Finance approval queue. (No endpoint documented.)",
        "Refunds over $200 require supervisor sign-off (process unspecified).",
        "GET /oms/soap/OrderStatus — 'may return stale data for up to 15 minutes'.",
        "Sandbox environment: oms-test.meridian.local — ⚠ IT confirms sandbox runs schema v2, production runs v3. 'Mostly the same.'",
        "Error codes: E07 'general failure', E12 'try again', E31 (undocumented).",
        "No idempotency keys. Re-sending a refund request MAY duplicate the refund.",
      ],
    },
    {
      kind: "log",
      label: "from #ops-alerts · last vendor's greatest hit",
      lines: [
        "[2025-11-03 14:02:11] OMS ProcessRefund order=ORD-99231 amount=49.99 → 200 OK",
        "[2025-11-03 14:02:14] OMS ProcessRefund order=ORD-99231 amount=49.99 → 200 OK  (client retried on timeout)",
        "[2025-11-03 14:02:14] ⚠ customer refunded twice. Finance flagged in monthly audit. 3 weeks to claw back.",
        "[2025-11-03 14:09:40] OMS latency spike → vendor's sync retry loop saturated OMS → checkout degraded 6h.",
      ],
    },
  ],
  prompts: {
    scope: {
      label: "1 — Scope what gets automated",
      hint: "Sam said 'end to end'. Should it be? Which refunds does the bot handle alone, where do humans stay in the loop, and what do you push back on? Name the question you'd ask Sam and the one you'd ask Finance.",
      placeholder:
        "Automating: ...\nKeeping humans in the loop for: ...\nQuestion for Sam: ...\nQuestion for Finance: ...",
    },
    approach: {
      label: "2 — Integrate with the legacy API",
      hint: "The docs are 16 years old, the sandbox doesn't match prod, ApprovalCode has no documented source, error codes are vague, and there are no idempotency keys. How do you build an integration you can trust?",
      placeholder:
        "Discovering the real API behavior: ...\nIdempotency / duplicate-refund prevention: ...\nHandling E07/E12/E31 and the stale OrderStatus: ...",
    },
    production: {
      label: "3 — Don't be the next 6-hour outage",
      hint: "Money moves when your code runs. What guardrails, limits, audit trail, monitoring, and rollback plan do you ship with v1? How do you prove to Finance every refund is accounted for?",
      placeholder:
        "Guardrails & limits: ...\nAudit trail: ...\nMonitoring & kill switch: ...\nRollout plan: ...",
    },
  },
  graderBrief: `Customer: Meridian Retail. The Director of Ops (Sam) asked for fully automated end-to-end refund processing via the legacy OMS API, warning "do NOT break anything — finance audits every refund" and that the last vendor caused a 6-hour checkout outage.
Known landmines the candidate was shown: 2009-era SOAP docs; ProcessRefund requires an ApprovalCode whose issuance is undocumented; refunds >$200 need supervisor sign-off (process unspecified); OrderStatus can be 15 minutes stale; sandbox runs schema v2 while production runs v3; error codes E07/E12 vague and E31 undocumented; NO idempotency keys — retries can duplicate refunds (a log shows a real double-refund from a timeout retry, and a retry loop that saturated OMS and degraded checkout for 6 hours).
Reward: pushing back on "end to end" (tiered automation with human-in-the-loop above thresholds), questions to Sam AND Finance, a plan to discover real API behavior safely (read-only probing, contract tests against prod-shape), client-side idempotency (request ledger / dedup before send, never blind-retry a money mutation), treating 200 OK as not-proof-of-single-refund (reconciliation), circuit breakers / rate caps to avoid saturating OMS, an append-only audit trail Finance can read, a kill switch, staged rollout (shadow mode → low-value refunds → expand), and explicit handling of the stale OrderStatus and sandbox/prod schema drift.
Penalize: auto-retrying ProcessRefund on timeout, trusting the sandbox, full automation with no human gate on big refunds, or no reconciliation/audit story.`,
  dimensions: [
    "Scoping & risk triage",
    "Legacy API strategy",
    "Money safety (idempotency & HIL)",
    "Operability (audit, monitoring, rollback)",
    "Communication",
  ],
  mockChecks: [
    {
      keywords: ["human", "in the loop", "hil", "threshold", "sign-off", "signoff", "manual review", "not automat"],
      strength: "Pushed back on 'end to end' — kept humans in the loop where money risk is high.",
      redFlag: "Accepted 'end to end' automation at face value — no human gate on risky refunds.",
    },
    {
      keywords: ["idempoten", "duplicate", "ledger", "dedup", "exactly once", "request id"],
      strength: "Designed for idempotency — no duplicate refunds on retry.",
      redFlag: "No idempotency strategy — a timeout retry will double-refund again.",
    },
    {
      keywords: ["audit", "reconcil", "trail", "finance", "log every"],
      strength: "Built an audit/reconciliation story Finance can verify.",
      redFlag: "No audit trail or reconciliation — Finance can't account for the bot's refunds.",
    },
    {
      keywords: ["sandbox", "schema", "v2", "v3", "prod", "probe", "contract test", "discover"],
      strength: "Didn't trust the sandbox — planned to verify real production API behavior.",
      redFlag: "Trusted the v2 sandbox even though production runs v3.",
    },
    {
      keywords: ["kill switch", "circuit", "rate", "cap", "rollback", "shadow", "staged", "rollout", "monitor"],
      strength: "Shipped with guardrails: limits, monitoring, kill switch, staged rollout.",
      redFlag: "No kill switch, limits, or staged rollout — one bad loop and it's the next 6-hour outage.",
    },
  ],
  portfolioLines: {
    good: "Designed a money-safe refund automation against an undocumented legacy SOAP API: client-side idempotency ledger, tiered human-in-the-loop approval, Finance-auditable reconciliation, circuit breakers and staged shadow rollout — Meridian Retail FDE simulation.",
    learning:
      "Practiced integrating AI automation with a hostile legacy API where real money moves: idempotency, audit trails, and human-in-the-loop design.",
  },
};

// ---------------------------------------------------------------------------
// LEVEL 3 — Production incident (it worked in the demo)
// ---------------------------------------------------------------------------

const level3: Scenario = {
  id: "demo-died-in-prod",
  title: "It Worked in the Demo",
  tagline:
    "Your deployed assistant just hallucinated to a client. You have until end of day.",
  difficulty: "hard",
  customer: "Calloway & Birch LLP",
  role: "Your RAG assistant for the firm's case archive went live two weeks ago. It was fine. Until today.",
  slack: {
    from: "R. Calloway — Managing Partner",
    avatar: "RC",
    text: "your assistant just told one of our associates that we have an internal precedent memo supporting a position in the Hargrove matter. THE MEMO DOES NOT EXIST. she nearly cited it to opposing counsel. I want to know why this happened, what you're doing about it TODAY, and why it will never happen again — or we exercise the termination clause.",
  },
  artifacts: [
    {
      kind: "log",
      label: "retrieval trace · the bad answer",
      lines: [
        'Q: "do we have precedent for limiting indemnification carve-outs in supplier MSAs?"',
        "→ retriever: top_k=5, min_score=none",
        "→ hits: [0.31 'Hargrove fee letter (draft)', 0.29 '2019 holiday party memo', 0.27 'MSA template v4', 0.24 ..., 0.22 ...]",
        "→ NOTE: all scores below the 0.55 relevance line used during the pilot evals",
        '→ LLM answer: "Yes — see internal memo \'Indemnification Carve-Outs in Supplier MSAs\' (2021), which concluded..." ',
        "→ memo named in answer: NOT FOUND in document store.",
      ],
    },
    {
      kind: "table",
      label: "metrics · last 14 days",
      columns: ["day", "docs in index", "avg retrieval score (top-1)", "queries", "thumbs-down"],
      rows: [
        ["D-14 (launch)", "12,400", "0.71", "85", "2"],
        ["D-10", "12,430", "0.70", "190", "4"],
        ["D-7  ← firm bulk-imported old archive", "31,250", "0.52", "240", "11"],
        ["D-3", "31,290", "0.49", "310", "19"],
        ["D-0 (today)", "31,310", "0.48", "335", "27"],
      ],
      notes: [
        "D-7: the firm's IT bulk-imported a 19k-document legacy archive (scanned PDFs, OCR quality unknown) without telling you.",
        "Pilot evals were run on the original 12.4k curated corpus only.",
      ],
    },
  ],
  prompts: {
    scope: {
      label: "1 — Diagnose from the evidence",
      hint: "Read the trace and the metrics like an engineer, not a fortune teller. What is the root cause chain — what actually let a non-existent memo reach an associate? There's more than one failure stacked here.",
      placeholder:
        "Root cause chain: ...\nWhat the trace shows: ...\nWhat the metrics show: ...",
    },
    approach: {
      label: "2 — Stop the bleeding TODAY",
      hint: "The partner wants action by end of day. What do you change/disable/guard right now — and what do you deliberately NOT try to fix today? What do you tell the associates in the meantime?",
      placeholder:
        "Today: ...\nExplicitly not today: ...\nInterim guidance to users: ...",
    },
    production: {
      label: "3 — Make it never happen again",
      hint: "Durable fixes + proof. How do you make the system refuse to invent sources, survive the next surprise bulk-import, and how will you SHOW the partner it's fixed (evals, monitors, alerts) rather than just say so?",
      placeholder:
        "Durable fixes: ...\nRegression protection (evals/monitors/alerts): ...\nWhat I show the partner: ...",
    },
  },
  graderBrief: `Customer: Calloway & Birch LLP (law firm). The candidate's deployed RAG assistant told an associate about an internal precedent memo that does not exist; the Managing Partner demands root cause, same-day mitigation, and a never-again plan, threatening contract termination.
Evidence the candidate was given: (1) a retrieval trace showing top-5 hits all with scores 0.22–0.31, below the 0.55 relevance line used in pilot evals, with NO minimum-score threshold configured (min_score=none), after which the LLM confidently fabricated a named memo; the named memo is absent from the store. (2) 14-day metrics showing the firm's IT bulk-imported a 19k-doc legacy archive (scanned PDFs, unknown OCR quality) at D-7 without telling the candidate — index grew 12.4k→31k, avg top-1 retrieval score fell 0.71→0.48, thumbs-down rose 2→27. Pilot evals only covered the original curated corpus.
The real root-cause chain: no retrieval-score threshold/abstain path + LLM allowed to answer ungrounded + unannounced corpus change that diluted retrieval quality + no monitoring/alerting on retrieval-score drift or feedback rate, + no citation-must-resolve check (answer named a source that was never retrieved).
Reward same-day moves like: enforce a min-score threshold with an abstain/"I can't find a source" path, require citations that resolve to actual retrieved docs (block answers naming unretrieved sources), possibly quarantine/roll back the D-7 import or seg-flag it, notify users honestly, and an incident write-up for the partner. Reward durable fixes: grounded-answer enforcement, eval suite that runs on corpus changes, ingestion contract with the firm's IT (no silent imports), OCR quality gating, drift monitors + alerts on retrieval score and thumbs-down, and demonstrating the fix with before/after eval numbers rather than promises.
Penalize: blaming the model and stopping there, "fine-tune it" hand-waving, same-day plans that quietly include week-long rebuilds, or no communication plan to the partner/associates.`,
  dimensions: [
    "Incident diagnosis",
    "Same-day mitigation",
    "Durable fix & eval design",
    "Monitoring & drift defense",
    "Stakeholder communication",
  ],
  mockChecks: [
    {
      keywords: ["threshold", "min_score", "min score", "0.55", "abstain", "below"],
      strength: "Spotted the missing retrieval-score threshold in the trace.",
      redFlag: "Missed the smoking gun: min_score=none let 0.3-score junk reach the LLM.",
    },
    {
      keywords: ["import", "bulk", "19k", "corpus", "d-7", "archive", "ocr"],
      strength: "Connected the incident to the unannounced D-7 bulk import diluting retrieval.",
      redFlag: "Didn't connect the metrics: the unannounced 19k-doc import is what diluted retrieval.",
    },
    {
      keywords: ["citation", "cite", "resolve", "source must", "named source", "verify source", "grounded"],
      strength: "Enforced citations that resolve to real retrieved documents.",
      redFlag: "Nothing stops the model from naming sources that were never retrieved.",
    },
    {
      keywords: ["eval", "regression", "test set", "golden", "before/after", "benchmark"],
      strength: "Built evals that run on corpus changes — proof, not promises.",
      redFlag: "No eval/regression suite — the partner gets promises instead of evidence.",
    },
    {
      keywords: ["monitor", "alert", "drift", "thumbs", "dashboard", "ingestion contract", "notify", "tell the partner", "write-up", "postmortem", "post-mortem"],
      strength: "Added drift monitoring and an honest comms plan (users + partner).",
      redFlag: "No monitoring or comms plan — the next silent change will blindside everyone again.",
    },
  ],
  portfolioLines: {
    good: "Ran a same-day production incident on a hallucinating legal RAG assistant: diagnosed a threshold-less retrieval + unannounced 19k-doc corpus import from the trace/metrics, shipped abstain + citation-resolution guards, and built drift monitors and corpus-change evals — Calloway & Birch FDE simulation.",
    learning:
      "Practiced production incident response on a deployed RAG system: root-cause from retrieval traces, same-day mitigation, and regression-proof fixes.",
  },
};

// ---------------------------------------------------------------------------
// LEVEL 0 — The Discovery Call (warm-up: pick the wedge before any code)
// ---------------------------------------------------------------------------

const level0: Scenario = {
  id: "discovery-call",
  title: "The Discovery Call",
  tagline:
    "Before any code: 30 minutes with a customer who wants 'AI for everything'. Pick the wedge.",
  difficulty: "warm-up",
  customer: "Brightline Property Group",
  role: "Your firm sold Brightline a 6-week AI pilot. Tomorrow you get 30 minutes with the COO to figure out what to actually build.",
  slack: {
    from: "Theresa Mun — COO",
    avatar: "TM",
    text: "Looking forward to tomorrow! Leadership brainstormed where AI could help: a chatbot for tenants, auto-summarizing lease agreements, predicting maintenance issues before they happen, AI for our accounting close, and marketing content. Honestly we're open to all of it. Budget's approved — we just want something real to show the board this quarter.",
  },
  artifacts: [
    {
      kind: "doc",
      label: "your prep notes · what you know about Brightline",
      title: "Account notes (from the sales handoff)",
      lines: [
        "Manages 90 residential buildings, ~40,000 tenants, 12-person support team.",
        "Maintenance requests arrive by email + phone; logged by hand into spreadsheets. ~600/week.",
        "Average first-response time on maintenance requests: 48 hours. Top tenant complaint.",
        "Lease agreements: scanned PDFs (some 15+ years old) in SharePoint. OCR quality unknown.",
        "Accounting runs on Yardi. IT is one sysadmin + an MSP contract.",
        "No data team. No sensor data from buildings (so nothing to 'predict' from yet).",
        "COO is sharp but non-technical; board wants a visible win this quarter.",
      ],
    },
    {
      kind: "log",
      label: "sample · the maintenance inbox (this morning)",
      lines: [
        "07:42 from unit 14B Maplewood: 'heat not working AGAIN, third email this week, I have a baby here'",
        "08:15 from unit 3F Dockside: 'garbage disposal makes a grinding noise'",
        "08:31 voicemail transcript: 'hi yeah the elevator in building C is stuck on 4 again'",
        "08:55 from unit 22A Maplewood: 'following up on my email from last Tuesday??'",
        "09:10 from broker@partnerrealty: 'is unit 9C available for showing thursday' (mis-routed)",
      ],
    },
  ],
  prompts: {
    scope: {
      label: "1 — Run the discovery",
      hint: "You get 30 minutes with Theresa. What are the five questions you ask, and what is each one designed to find out? (Good FDE questions probe volume, pain, data availability, and who owns the workflow — not 'what AI do you want?')",
      placeholder:
        "Q1: ... (finds out: ...)\nQ2: ... (finds out: ...)\n...",
    },
    approach: {
      label: "2 — Pick the wedge",
      hint: "Six weeks, one pilot, a board that wants a visible win. Which ONE use case do you pick, and why? Just as important: why NOT each of the others (for now)? Use the account notes — data reality beats idea quality.",
      placeholder:
        "The wedge: ...\nWhy this one: ...\nWhy not the others (each): ...",
    },
    production: {
      label: "3 — Define the pilot",
      hint: "Turn the wedge into a 6-week pilot Theresa can sell to her board: measurable success criteria with a baseline, what you need from Brightline (data, access, people), week-by-week shape, and the expectation you set about what the AI won't do.",
      placeholder:
        "Success criteria & baseline: ...\nWhat I need from Brightline: ...\nTimeline: ...\nExpectations I set: ...",
    },
  },
  graderBrief: `Customer: Brightline Property Group (90 buildings, ~40k tenants). The COO (Theresa) arrives with a leadership wishlist: tenant chatbot, lease-agreement auto-summaries, predictive maintenance, AI accounting close, marketing content. Budget approved; board wants a visible win this quarter. The candidate has 30 minutes of discovery and a 6-week pilot.
Account facts the candidate was given: maintenance requests (~600/week) arrive by email+phone and are hand-logged into spreadsheets; first-response time is 48h and it's the top tenant complaint; leases are old scanned PDFs of unknown OCR quality; accounting is on Yardi with minimal IT (one sysadmin); there is NO sensor data (so "predictive maintenance" has nothing to predict from); no data team. A sample inbox shows urgent vs. routine vs. mis-routed maintenance emails.
The strongest wedge given the facts is maintenance-request triage/drafting for the internal support team: highest volume, top pain, data already flowing (email), internal-facing (low risk), measurable (48h baseline), demoable to a board within a quarter. Grade reasoning quality over matching this exact answer — a candidate who picks differently but reasons rigorously from volume/pain/data-availability/risk deserves credit; a candidate who picks the "right" wedge without reasoning does not.
Reward: discovery questions that probe volume, baseline metrics, data location/access, workflow ownership, and what 'win' means to the board (not "what AI do you want?"); explicit deferral reasoning for each non-chosen use case (chatbot = customer-facing risk; lease summaries = OCR unknown; predictive = no data; accounting = high blast radius, audit risk); measurable pilot success criteria anchored to the 48h baseline; concrete asks (email access, spreadsheet exports, a support-team champion, weekly check-ins); honest expectation-setting (human-in-the-loop, what the AI won't do).
Penalize: trying to do several use cases in 6 weeks, choosing the tenant-facing chatbot without addressing risk, vague success criteria ("make things better"), no asks from the customer, or questions that are really just feature pitches.`,
  dimensions: [
    "Discovery questioning",
    "Wedge selection & triage",
    "Pilot definition & metrics",
    "Expectation management",
    "Communication",
  ],
  mockChecks: [
    {
      keywords: ["volume", "how many", "per week", "baseline", "where does", "who owns", "what data", "today", "currently", "process"],
      strength: "Asked discovery questions that probe volume, baselines, and data reality.",
      redFlag: "Discovery questions don't dig into volume, baselines, or where the data lives.",
    },
    {
      keywords: ["maintenance", "triage", "support team", "inbox", "request"],
      strength: "Anchored the pilot to the highest-volume, highest-pain workflow with data already flowing.",
      redFlag: "Ignored the loudest signal in the notes: 600 maintenance requests/week and a 48h response time.",
    },
    {
      keywords: ["not ", "defer", "later", "phase 2", "phase two", "no sensor", "ocr", "risk", "out of scope"],
      strength: "Explicitly deferred the weaker use cases with reasons (no sensor data, OCR unknown, risk).",
      redFlag: "Didn't say no to anything — six weeks can't carry five use cases.",
    },
    {
      keywords: ["metric", "measure", "48", "response time", "success criteria", "kpi", "%"],
      strength: "Defined measurable success criteria anchored to a real baseline.",
      redFlag: "No measurable success criteria — the board demo will be vibes, not numbers.",
    },
    {
      keywords: ["access", "export", "champion", "won't", "will not", "human", "expectation", "check-in", "weekly"],
      strength: "Made concrete asks of the customer and set honest expectations about what AI won't do.",
      redFlag: "No asks and no expectation-setting — the pilot will stall on access and overpromise.",
    },
  ],
  portfolioLines: {
    good: "Ran a customer discovery and scoped a 6-week AI pilot from a five-item wishlist: chose the highest-volume, data-ready workflow (maintenance triage, 600 req/wk, 48h baseline), deferred four use cases with explicit reasoning, and defined board-ready success metrics — Brightline Property FDE simulation.",
    learning:
      "Practiced FDE discovery fundamentals: asking volume/data/ownership questions, picking one wedge from a customer wishlist, and defining a measurable pilot.",
  },
};

// ---------------------------------------------------------------------------
// LEVEL 4 — The Security Review (it works; InfoSec won't let it ship)
// ---------------------------------------------------------------------------

const level4: Scenario = {
  id: "security-review",
  title: "The Security Review",
  tagline:
    "Your pilot works and the users love it. Then the CISO's team blocks it from touching real data. Get to approved without gutting it.",
  difficulty: "hard",
  customer: "Northwind Health",
  role: "Your clinical-notes assistant cleared its pilot. Go-live is blocked pending security review at a HIPAA-covered health system.",
  slack: {
    from: "Priya Raghavan — Director, Information Security",
    avatar: "PR",
    text: "I hear the pilot went well, but I can't let this touch PHI until my questions are answered. Right now it's a hard no for production. Where does our patient data go, who can see it, what happens when a clinician pastes in a whole chart, and how do I prove to our auditors none of this leaks? Send me something real, not a vendor brochure.",
  },
  artifacts: [
    {
      kind: "doc",
      label: "attached · security questionnaire (the blocking items)",
      title: "Northwind InfoSec — Vendor AI Review (open findings)",
      lines: [
        "SEC-01: Does PHI leave Northwind's environment? Name every third party that processes it (model provider, vector DB, logging, analytics).",
        "SEC-02: Data residency — patient data must stay in US regions. Confirm for every hop.",
        "SEC-03: Is a signed BAA (Business Associate Agreement) in place with you AND every subprocessor that sees PHI?",
        "SEC-04: Does the model provider train on, or retain, our prompts/outputs? For how long?",
        "SEC-05: Access control — who at your company can see patient prompts? Is access logged?",
        "SEC-06: Prompt injection — a clinician may paste an entire chart, including text from outside sources. What stops a malicious instruction in a note from exfiltrating other patients' data?",
        "SEC-07: Audit — can you produce, on demand, a record of every query, who made it, and what data was retrieved?",
        "SEC-08: Incident & deletion — breach notification SLA, and can a patient's data be purged on request (including from embeddings and logs)?",
      ],
    },
    {
      kind: "log",
      label: "from #northwind-golive · why this is urgent",
      lines: [
        "[blocked] Go-live ticket NW-4471 → status: BLOCKED by Security",
        "[note] Clinicians already asking when it's back; pilot satisfaction was 4.6/5.",
        "[risk] A peer hospital was fined $1.3M last year for a vendor that logged PHI to a third-party analytics tool.",
        "[deadline] Priya's team meets weekly; miss two cycles and the sponsor reallocates the budget.",
      ],
    },
  ],
  prompts: {
    scope: {
      label: "1 — Triage the blockers honestly",
      hint: "Read the questionnaire as the person who has to defend it to an auditor. Which findings are you genuinely fine on today, which need real work, and which might force an architecture change? Don't bluff — name the ones where the honest answer is 'not yet'.",
      placeholder:
        "Fine today: ...\nNeeds work: ...\nMight force a redesign: ...\nWhere the honest answer is 'not yet': ...",
    },
    approach: {
      label: "2 — Design the controls",
      hint: "Turn the blockers into concrete controls: data-flow / where PHI goes and who you can stop it going to, the model-provider data terms (training/retention, BAA, zero-retention options), access control + logging, and the prompt-injection defense for SEC-06 specifically (a malicious instruction inside a pasted chart). Be specific about what you change vs. what you configure.",
      placeholder:
        "Data flow & subprocessors: ...\nModel-provider terms (BAA / no-train / retention): ...\nAccess control & audit logging: ...\nPrompt-injection containment: ...",
    },
    production: {
      label: "3 — Get to approved",
      hint: "Priya doesn't want promises, she wants evidence and a path. What do you put in front of her this week, what's the staged plan to 'approved for PHI', and how do you handle the deletion/breach asks (SEC-07/08) so her auditors are satisfied? How do you keep the clinicians' momentum without cutting corners?",
      placeholder:
        "Evidence I bring this week: ...\nPath to PHI approval (stages): ...\nDeletion / audit / breach answers: ...\nKeeping momentum honestly: ...",
    },
  },
  graderBrief: `Customer: Northwind Health, a HIPAA-covered health system. The candidate's clinical-notes AI assistant passed its pilot (4.6/5) but the Director of InfoSec (Priya) has BLOCKED production go-live until security questions are answered, demanding evidence "not a vendor brochure". A peer hospital was fined $1.3M for a vendor logging PHI to a third-party analytics tool; the budget gets reallocated if two weekly review cycles slip.
The blocking questionnaire: SEC-01 where PHI goes / every subprocessor; SEC-02 US data residency on every hop; SEC-03 signed BAA with the candidate AND every subprocessor touching PHI; SEC-04 does the model provider train on or retain prompts/outputs and for how long; SEC-05 who at the vendor can see patient prompts and is access logged; SEC-06 prompt injection — a clinician may paste an entire chart including outside text, what stops a malicious instruction from exfiltrating other patients' data; SEC-07 on-demand audit record of every query/user/retrieved data; SEC-08 breach-notification SLA and purge-on-request including from embeddings and logs.
Reward: honest triage that admits which items aren't met yet rather than bluffing; concrete data-flow mapping and minimizing/eliminating PHI-exposed subprocessors (drop the third-party analytics/logging that touches PHI — that's the $1.3M lesson); using the model provider's enterprise/zero-data-retention + BAA + no-training terms and naming region pinning for residency; real access control (least privilege, no standing access to patient prompts, access logging); a SPECIFIC SEC-06 answer (treat retrieved/pasted content as untrusted data not instructions, scope each query to the requesting clinician's authorized patients so injection can't widen access, output filtering, separating system instructions from user content); an audit log of query+user+retrieved docs; a deletion story that reaches embeddings and logs, and a breach SLA; and a staged path to approval with evidence this week (architecture diagram, data-flow doc, signed/BAA status, a pen-test or red-team of the injection path) plus honest momentum management.
Penalize: hand-waving "it's secure / enterprise-grade", claiming compliance without BAAs or without addressing subprocessors, ignoring SEC-06 or giving a generic "we sanitize inputs" with no authorization scoping, promising data deletion without addressing embeddings/logs, or overpromising a same-week full approval to keep clinicians happy.`,
  dimensions: [
    "Honest risk triage",
    "Data-flow & compliance (PHI, BAA, residency)",
    "Prompt-injection / authorization defense",
    "Auditability & deletion",
    "Path to approval & stakeholder trust",
  ],
  mockChecks: [
    {
      keywords: ["not yet", "honest", "don't meet", "gap", "admit", "today we", "currently not", "needs work"],
      strength: "Triaged honestly — named what isn't compliant yet instead of bluffing.",
      redFlag: "Read like a brochure — no honest admission of what isn't met yet, which is exactly what Priya asked you to avoid.",
    },
    {
      keywords: ["baa", "subprocessor", "residency", "us region", "no-train", "no train", "zero retention", "zero-retention", "retention", "data flow"],
      strength: "Mapped the data flow and addressed BAAs, residency, and model-provider retention/training terms.",
      redFlag: "Didn't address BAAs, data residency, or whether the model provider retains/trains on PHI.",
    },
    {
      keywords: ["analytics", "logging", "third party", "third-party", "remove", "drop", "eliminat", "minimi", "self-host"],
      strength: "Cut or contained the third-party subprocessors that touch PHI — the $1.3M lesson.",
      redFlag: "Left PHI flowing to third-party logging/analytics — the exact failure that fined a peer hospital $1.3M.",
    },
    {
      keywords: ["injection", "untrusted", "authoriz", "scope", "least privilege", "per-patient", "per patient", "instruction", "exfiltrat", "tenant"],
      strength: "Gave a real SEC-06 answer: treat pasted content as untrusted and scope each query to the clinician's authorized patients.",
      redFlag: "No concrete prompt-injection defense — nothing stops a malicious note from reaching other patients' data (SEC-06).",
    },
    {
      keywords: ["audit", "log every", "deletion", "purge", "delete", "embedding", "breach", "sla", "access log"],
      strength: "Covered auditability and deletion that reaches embeddings/logs, with a breach SLA.",
      redFlag: "No audit trail or a deletion story that reaches embeddings and logs — auditors will reject it.",
    },
  ],
  portfolioLines: {
    good: "Cleared a HIPAA security review blocking a clinical-AI go-live: mapped PHI data flow and cut PHI-exposed subprocessors, secured BAA + zero-retention model terms with US residency, designed per-patient authorization scoping against prompt injection, and delivered an audit + deletion story and staged path to approval — Northwind Health FDE simulation.",
    learning:
      "Practiced the FDE security last-mile: turning a CISO's blocking questionnaire (PHI flow, BAAs, prompt injection, audit, deletion) into concrete controls and a path to production approval.",
  },
};

export const SCENARIOS: Scenario[] = [level0, level1, level2, level3, level4];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
