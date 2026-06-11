// The killer sandbox level: "Dirty Data RAG — The Last Mile"
// One challenge that compresses the hardest, most real FDE moment:
// a vague ask + messy data + production that must not break.

export const SCENARIO = {
  id: "acme-dirty-rag",
  customer: "Acme Logistics",
  role: "You've been embedded with Acme's Support team for the week.",

  // The vague ask — deliberately under-specified, like real life.
  slackMessage: {
    from: "Dana Okafor — Head of Support",
    avatar: "DO",
    text: "hey! our agents waste hours digging through old tickets to answer customers. can you build us something where they just ask a question and get the answer? we've got the export attached. need it by friday 🙏",
  },

  // The "data dump" — a realistic, messy support-ticket export.
  // Encoding issues, missing fields, mixed languages, duplicates,
  // inconsistent timestamps, PII, and noise. This is the trap most
  // people skip past straight into writing code.
  tickets: [
    {
      id: "TK-1043",
      created: "2024/03/02",
      subject: "Where is my order??",
      body: "Order #88213 was supposed to arrive 3 days ago. Tracking hasn't updated. This is the SECOND time.",
      status: "resolved",
      resolution:
        "Carrier delay. Reshipped via expedited. Refunded shipping ($12.99).",
      customer_email: "marco.r@example.com",
    },
    {
      id: "TK-1044",
      created: "03-02-2024",
      subject: "refund policy?",
      body: "¿Cuál es la política de reembolso para productos dañados?",
      status: "resolved",
      resolution:
        "Damaged items: full refund within 30 days with photo. Replacement offered.",
      customer_email: null,
    },
    {
      id: "TK-1044",
      created: "03-02-2024",
      subject: "refund policy?",
      body: "¿Cuál es la política de reembolso para productos dañados?",
      status: "resolved",
      resolution:
        "Damaged items: full refund within 30 days with photo. Replacement offered.",
      customer_email: null,
    },
    {
      id: "TK-1051",
      created: "Mar 4 2024 14:22",
      subject: "",
      body: "the discount code BLACKFRI didnt work at checkout said expired but ur email said valid til today",
      status: "resolved",
      resolution: "Code expired at midnight UTC. Issued one-time 15% code.",
      customer_email: "  Jenna.K@EXAMPLE.com ",
    },
    {
      id: "TK-1052",
      created: "1709568000", // unix timestamp, because of course
      subject: "Cancel subscription",
      body: "I want to cancel. card ending 4471. charge me again and I will dispute.",
      status: "open",
      resolution: "",
      customer_email: "d_lee@example.com",
    },
    {
      id: "TK-1060",
      created: "2024/03/05",
      subject: "Re: Re: FWD: damaged box",
      body: "box arrived crushed. item ok but box destroyed. do i need to return anything for the partial refund you mentioned",
      status: "resolved",
      resolution:
        "Cosmetic box damage, item fine: no return needed. $10 goodwill credit applied.",
      customer_email: "priya@example.com",
    },
    {
      id: "TK-1077",
      created: "2024/03/06",
      subject: "asdfasdf",
      body: "test ignore",
      status: "closed",
      resolution: "Spam / test ticket.",
      customer_email: "qa@acme-internal.com",
    },
    {
      id: "TK-1081",
      created: "2024/03/07",
      subject: "wholesale pricing",
      body: "Do you offer bulk pricing for orders over 500 units? Need a quote for procurement.",
      status: "escalated",
      resolution: "Routed to Sales. Not a support matter.",
      customer_email: "ops@bigbuyer.example.com",
    },
  ],

  // Notes shown to the player to hint at — but not solve — the traps.
  datasetNotes: [
    "~2,000 rows in the full export; 8 representative rows shown.",
    "Dates appear in at least 4 formats (incl. a raw unix timestamp).",
    "There are exact duplicate rows.",
    "Some bodies are non-English; some are empty, spam, or mis-routed.",
    "Resolutions are free text; some tickets have none.",
    "Emails/card fragments appear inline (PII).",
  ],

  // The fake-but-flaky 'customer system' you must integrate with.
  apiContract: {
    name: "acme-support-api",
    notes: [
      "POST /search — rate-limited to 5 req/s, returns 429 on burst.",
      "Auth via X-Acme-Key header; key rotates daily.",
      "p95 latency 800ms; occasional 504s under load.",
      "No pagination — returns at most 50 rows per query.",
    ],
  },

  // What the player submits. Three boxes that mirror the real job.
  prompts: {
    scope: {
      label: "1 — Scope the ask",
      hint: "Dana's request is vague. Before any code: what exactly are you building, what are you explicitly NOT building this week, and what one question would you send back to Dana? (This step is where most people lose points by jumping to code.)",
      placeholder:
        "e.g. Building: a retrieval-Q&A over resolved tickets for agents...\nNot building: ...\nQuestion for Dana: ...",
    },
    approach: {
      label: "2 — Handle the data + pipeline",
      hint: "How do you turn this messy export into something a retrieval pipeline can actually answer from? Call out the specific dirty-data traps above and what you do about each (dedup, dates, empties/spam, PII, non-English, ticketing with no resolution).",
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
} as const;

export type Scenario = typeof SCENARIO;
