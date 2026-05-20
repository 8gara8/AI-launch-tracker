SPEC.md — AI Ship Speed Dashboard
What this is
A live, auto-updating competitive intelligence dashboard tracking AI product launches across Anthropic, OpenAI, Google, and xAI in 2026. Hosted on Vercel, updated weekly by Claude Cowork pushing new data to GitHub.
Architecture

```
┌─────────────────────────────────────────────┐
│  COWORK (weekly, Monday 8am TST)            │
│  1. Web research across 4 companies         │
│  2. Categorize new launches                 │
│  3. Append to data/launches.json            │
│  4. git add + commit + push to GitHub       │
│     (via Claude Code dispatch or CLI)       │
└──────────────────┬──────────────────────────┘
                   │ push
                   ▼
┌─────────────────────────────────────────────┐
│  GITHUB REPO: ai-ship-speed                 │
│  ├── app/                                   │
│  │   ├── layout.tsx                         │
│  │   └── page.tsx                           │
│  ├── components/                            │
│  │   ├── Dashboard.tsx                      │
│  │   ├── Timeline.tsx                       │
│  │   ├── Scoreboard.tsx                     │
│  │   └── MonthlyChart.tsx                   │
│  ├── data/                                  │
│  │   └── launches.json    ← THE DATA FILE   │
│  ├── package.json                           │
│  ├── tailwind.config.ts                     │
│  └── next.config.js                         │
└──────────────────┬──────────────────────────┘
                   │ auto-deploy on push
                   ▼
┌─────────────────────────────────────────────┐
│  VERCEL                                     │
│  ai-ship-speed.vercel.app                   │
│  Static site, no database, no API keys      │
└─────────────────────────────────────────────┘

```

Stack

* Framework: Next.js 14 (App Router, static export)
* Styling: Tailwind CSS
* Data: Static JSON file (`data/launches.json`), imported at build time
* Fonts: Google Fonts — IBM Plex Mono + Space Grotesk
* Deployment: Vercel (auto-deploy on GitHub push)
* Database: None. The JSON file IS the database.
* Auth: None. Public dashboard.
* API keys: None needed.
Data Schema
`data/launches.json`:

```json
{
  "meta": {
    "last_updated": "2026-05-20",
    "week_number": 20,
    "tracked_since": "2026-01-01"
  },
  "companies": [
    {
      "id": "anthropic",
      "name": "Anthropic",
      "product": "Claude",
      "color": "#D97706"
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "product": "ChatGPT",
      "color": "#059669"
    },
    {
      "id": "google",
      "name": "Google",
      "product": "Gemini",
      "color": "#2563EB"
    },
    {
      "id": "xai",
      "name": "xAI",
      "product": "Grok",
      "color": "#7C3AED"
    }
  ],
  "launches": [
    {
      "company": "anthropic",
      "date": "2026-01-15",
      "label": "Claude Opus 4.6",
      "category": "model",
      "description": "1M token context, strongest reasoning model"
    }
  ],
  "watch": [
    "Grok 5 still not shipped — watch for Q2 release",
    "OpenAI IPO preparations — watch for product consolidation"
  ]
}

```

Category enum: `"model"` | `"product"` | `"api"` | `"strategic"`
Page Layout
Single page. Dark theme. No routing needed.
Sections (top to bottom):

1. Header — "AI Ship Speed — 2026" with subtitle showing last-updated date and total launches tracked
2. Scoreboard — 4 cards, one per company, showing total launch count. Tap to filter.
3. Monthly bar chart — Grouped bars showing launches per company per month. Visual cadence comparison.
4. Category filter — Toggle buttons: 🧠 Model, 📦 Product, ⚙️ API, 🏷️ Strategic
5. Timeline — Grouped by month, each launch is a row with date, color dot, label, company tag, category icon. Expandable description on tap/hover.
6. Key Takeaway — Auto-generated summary paragraph with company counts and narrative.
7. Watch List — "What to watch" section from the JSON.
8. Footer — "Updated weekly by Claude Cowork. Data since Jan 1, 2026."
Responsive

* Desktop: full layout
* Mobile: scoreboard stacks 2×2, timeline rows compress, chart simplifies
Build Plan
Phase 1: Scaffold (Claude Code)

1. `npx create-next-app@latest ai-ship-speed --typescript --tailwind --app --src-dir=false`
2. Install Google Fonts via `next/font`
3. Create `data/launches.json` with full dataset
4. Build `page.tsx` that imports JSON and renders Dashboard
5. Build Dashboard, Scoreboard, MonthlyChart, Timeline components
6. Dark theme via Tailwind config
7. Test locally with `npm run dev`
Phase 2: Deploy

1. `git init && git add . && git commit -m "initial"`
2. Create GitHub repo `ai-ship-speed`
3. Push to GitHub
4. Connect to Vercel via `vercel` CLI or dashboard
5. Verify live at the assigned URL
Phase 3: Weekly update loop (Cowork)
See the skill file. Cowork researches, updates `data/launches.json`, and pushes to GitHub. Vercel auto-deploys. Done.
Design Notes

* The visual style should match the artifact we already built: dark background (#0A0A0F), monospace data, Space Grotesk headers, company-colored accents.
* No "AI slop" aesthetics. No purple gradients. No Inter font.
* The page should feel like a Bloomberg terminal crossed with a changelog — dense, scannable, opinionated.
* The monthly bar chart is the hero visual — it tells the "ship speed" story at a glance.
* Category icons (🧠📦⚙️🏷️) are part of the UI language and should be consistent everywhere.
What this project is NOT

* Not a blog. No commentary pages, no per-company analysis pages.
* Not a SaaS. No auth, no user accounts, no database.
* Not an API. The JSON file is consumed at build time, not served.
* Not a news aggregator. We track launches (shipped products), not rumors or announcements-of-announcements.
