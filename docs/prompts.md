# Phase Prompts — VibeAudit

Paste one phase at a time into Claude Code (VS Code extension). Switch model per the MODEL: tag. After each phase, let Claude Code update project-track.md and context-snapshot.md.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 0 — Project Scaffold & Setup
Est. time: 10 min
MODEL: haiku
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md before starting.

- Scaffold Next.js 14 with TypeScript, Tailwind, App Router
- Install deps: @supabase/ssr, @supabase/supabase-js, stripe, @anthropic-ai/sdk, @octokit/app, @octokit/rest, resend, framer-motion, zod, shadcn/ui
- Create the full folder structure from docs/context.md exactly (including worker/ and lib/scan/, lib/github/, lib/ai/)
- tailwind.config.ts dark design system: bg #0a0a0f, brand gradient #6366f1→#8b5cf6, glassmorphism cards, "shadow-glow"
- Create .env.example with ALL variables from docs/context.md
- middleware.ts for Supabase auth route protection
- lib/supabase/client.ts + server.ts (SSR cookie pattern)

✅ Done when: npm run dev runs clean, folders match docs/context.md
📝 Then update docs/features.md + project-track.md
📝 Next: Phase 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — Database Schema
Est. time: 15 min
MODEL: sonnet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md for the data model.

- Write complete Supabase SQL: tables, indexes, RLS, triggers
- Base tables: profiles (with plan, stripe fields, onboarding_completed)
- VibeAudit tables:
  - repos (user_id, github_repo_id, full_name, default_branch, installation_id, connected_at)
  - scans (repo_id, user_id, status[queued|running|done|failed], score int, commit_sha, started_at, finished_at)
  - findings (scan_id, check_type, severity[critical|high|medium|low], file_path, line, title, plain_english, fix_suggestion, cwe)
  - fix_prs (finding_id, scan_id, pr_url, status[open|merged|closed], created_at)
  - monitoring_config (repo_id, enabled bool, alert_email, alert_discord_webhook)
- handle_new_user() trigger (auto-create profile)
- update_updated_at() triggers
- RLS: every table filtered by user_id (own data only). findings/fix_prs join via scan → user_id.
- Generate types/database.ts + types/index.ts

✅ Done when: all tables live, RLS enabled + tested, types generated
📝 Then update project-track.md
📝 Next: Phase 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — Auth + GitHub Connect
Est. time: 25 min
MODEL: sonnet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md for auth + GitHub App requirements.

- Auth layout + login, signup pages. GitHub OAuth as PRIMARY button (dev audience), email as secondary.
- Auth callback route for Supabase OAuth redirect
- Middleware: protect /dashboard/*; redirect authed users away from /login,/signup
- lib/hooks/use-user.ts: returns { profile, loading, isPro, isAgency }
- GitHub App integration (lib/github/app.ts):
  - "Connect GitHub" flow → install GitHub App → store installation_id + repo list in repos table
  - Octokit App auth using GITHUB_APP_ID + GITHUB_APP_PRIVATE_KEY
  - /api/github/connect (start install), /api/github/webhook (installation events, stub push events for later)
- Dark minimal design, centered card, logo top

✅ Done when: signup/login/logout + GitHub OAuth work, user can connect a repo, repo appears in repos table
📝 Then update project-track.md
📝 Next: Phase 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — Dashboard Shell
Est. time: 20 min
MODEL: haiku
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md for navigation and layout.

- Dashboard layout: fixed sidebar (w-64) + header (h-14) + main
- Sidebar: logo, nav (Dashboard, Monitoring, Settings), upgrade card for free users, user info bottom
- Header: page title + user dropdown (profile, billing, sign out)
- Dashboard page: list of connected repos as cards — each shows repo name, last score (colored ring 0–100), last scan date, "Scan now" button
- EmptyState (no repos → "Connect your first repo")
- UpgradeModal (free user hits 1 scan/mo limit)
- Reusable ScoreRing component (animated 0–100, red<50, amber<80, green≥80)

✅ Done when: dashboard loads, repo cards render, nav works, ScoreRing animates
📝 Then update project-track.md
📝 Next: Phase 4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — Scan Engine + Score + Plain-English Report + Fix PR  ★ THE CORE
Est. time: 60+ min
MODEL: sonnet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md + docs/features.md. This is the product — build carefully.

SCAN ENGINE (worker/ + lib/scan/):
- Scan worker (separate service, runs on Railway/Fly): clones repo via GitHub App token into ephemeral dir, runs Semgrep with custom rulesets, deletes clone after. Returns findings JSON. NEVER persist source.
- lib/scan/rules.ts — the 6 vibe-coder checks as Semgrep rules + heuristics:
  1. Exposed API keys (hardcoded secrets, keys in client/NEXT_PUBLIC_ misuse)
  2. Supabase/Firebase RLS off (detect public anon table access patterns)
  3. Missing auth checks (API routes with no getUser()/session guard)
  4. Payment bypass (price/amount from client body used directly)
  5. SQL / prompt injection (raw user input into query/prompt template)
  6. No rate limiting (AI/API routes with no throttle)
- lib/scan/scorer.ts — findings → score: start 100, subtract by severity (critical -25, high -12, medium -5, low -2), floor 0

API + FLOW:
- /api/scan/start — auth + plan-limit check → enqueue scan → worker runs → writes scans + findings
- /api/scan/status — poll scan status for live UI

PLAIN-ENGLISH (lib/ai/explain.ts):
- For each finding, Claude turns CWE/rule hit into: plain_english (what/why it's dangerous, name the file+line, real-world consequence) + fix_suggestion (concrete steps + code). Non-developer tone.

RESULT UI (app/(dashboard)/scan/[repoId]/page.tsx):
- Big animated ScoreRing + "X critical, Y high" summary
- Findings list sorted critical→low, each: title, file:line, plain-English explanation, severity tag, "Fix it for me" button
- Live scanning state (spinner + poll status)

FIX PR (lib/ai/fix.ts + lib/github/pr.ts):
- "Fix it for me" → Claude generates code fix for that finding → lib/github/pr.ts opens a GitHub PR on a new branch via GitHub App → store in fix_prs → show PR link + "Merge on GitHub" button

✅ Done when: connect repo → scan runs → score + plain-English findings show → "Fix it for me" opens a real GitHub PR
📝 Then update project-track.md + context-snapshot.md
📝 Next: Phase 5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — Billing
Est. time: 25 min
MODEL: sonnet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md for pricing + limits.

- lib/stripe/client.ts + plans.ts: Free (1 scan/mo), Pro $29 (unlimited + fix PR + monitoring), Agency $99 (15 repos + white-label + badge) + checkLimit()
- lib/hooks/use-subscription.ts: { plan, isPro, isAgency }
- API: /api/stripe/checkout, /portal, /webhook (subscription created/updated/deleted + checkout completed)
- Plan gating: free user beyond 1 scan/mo → UpgradeModal; Fix PR + monitoring = Pro+
- Settings billing page: current plan, scan usage this month, upgrade/manage buttons

✅ Done when: can subscribe, webhook updates DB plan, gating enforces scan limit
📝 Then update project-track.md
📝 Next: Phase 6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6 — Onboarding + Email + Monitoring
Est. time: 25 min
MODEL: haiku
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md for onboarding + monitoring.

- Onboarding (3 steps): Welcome → Connect GitHub → Run first scan → see score. Sets onboarding_completed.
- Middleware: new users → /onboarding before /dashboard
- Continuous monitoring (Pro): GitHub push webhook → auto re-scan → if new critical/high finding, send alert
- Resend client + templates: Welcome email; "New security issue found" alert email (React Email)
- Monitoring page: per-repo toggle + alert email/Discord webhook config

✅ Done when: new signup flows through onboarding, first scan works, push triggers re-scan + alert (Pro)
📝 Then update project-track.md
📝 Next: Phase 7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 7 — Landing Page
Est. time: 25 min
MODEL: haiku
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md for one-liner, checks, pricing.

- Marketing layout: navbar (logo + links + "Scan free" CTA) + footer
- Hero: "Built your app with AI? Scan it before it gets hacked." + free-scan CTA (connect GitHub → score), mesh gradient + glow background
- Features: 6 cards = the 6 core checks, each with icon + the "kills" consequence
- "Meet Sarah" story block (fitness coach, RLS off, browser console leak → fixed with VibeAudit)
- Social proof: scans done + issues found counters
- Pricing: 3 cols (Free / Pro $29 / Agency $99), Pro highlighted
- FAQ: "Is it accurate?" (catches ~40%, monitoring+evidence not guarantee), "Is my code safe with you?" (ephemeral, never stored), "Do I need to code?" (no — click Fix)
- All copy from docs/context.md, no placeholder text

✅ Done when: landing live at /, all sections done, CTAs → GitHub connect / signup
📝 Then update project-track.md
📝 Next: Phase 8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 8 — Polish & Production + Flip Prep
Est. time: 30 min
MODEL: sonnet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read docs/context.md + docs/decisions.md + docs/audit.md.

- Metadata (title, description, OG) on all pages + shareable score OG image
- loading.tsx skeletons + error.tsx in dashboard
- Audit ALL API routes: auth.getUser(), Zod validation, status codes, rate limiting on scan+AI
- Verify GitHub + Stripe webhook signatures; confirm source code never persisted
- Add "not a guarantee" disclaimer to every report
- README.md: what it does, stack, 5-min setup, worker deploy notes
- Final .env.example with descriptions
- npm run build — zero errors
- Fill docs/audit.md completely (honest — real competitor scores, real gaps, flip readiness)

✅ Done when: build passes clean, deployed (frontend Vercel + worker Railway/Fly), 2-min demo works, audit.md filled
📝 Then update project-track.md → all complete
📝 Next: Flip decision — list at 0 MRR (~$3–8k) OR run free-scan loop 4–6 wks for higher exit. See docs/flip-plan.md.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
