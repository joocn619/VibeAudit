# Context Snapshot — VibeAudit
Last updated: Phase 0 not started

## What This Is
Security scanner for AI-built apps. Connect GitHub repo → Security Score (0–100) + plain-English report of critical issues → one-click AI Fix PR. Target: non-technical vibe-coders. Built to flip on Flippa.

## Build State
Progress: 0/8 phases complete
Last done: docs/ folder created
Next: Phase 0 — Scaffold — MODEL: haiku

## Critical File Locations
| What | Where |
|------|-------|
| Core feature (scan result) | app/(dashboard)/scan/[repoId]/page.tsx |
| Scan engine (Semgrep wrap + scorer) | lib/scan/{engine,rules,scorer}.ts |
| Scan worker (long-running) | worker/ |
| Plain-English AI | lib/ai/explain.ts |
| Fix generation + PR | lib/ai/fix.ts + lib/github/pr.ts |
| GitHub App | lib/github/app.ts |
| Stripe plans | lib/stripe/plans.ts |
| DB types | types/database.ts |

## DB Tables
profiles — user + plan (base)
repos — connected GitHub repos
scans — each scan run (status, score, commit sha)
findings — individual issues (check_type, severity, file, line, plain_english, fix_suggestion)
fix_prs — AI-generated fix PRs (finding_id, pr_url, status)
monitoring_config — per-repo continuous monitor settings

## Key Decisions
- Scan engine = Semgrep + custom vibe-coder rules (open-source, high margin)
- Plain-English layer via Claude = the moat
- GitHub App (not OAuth token) for scoped perms + PR write + webhooks
- Scan runs in separate worker (Railway/Fly), NOT Vercel (timeout/filesystem)
- Never store source long-term — ephemeral scan, keep findings only
- Position "monitoring + evidence", never "guaranteed secure"

## Open Issues
None yet

## Tricky Imports (easy to get wrong)
- lib/supabase/server.ts for API routes (SSR cookie pattern), lib/supabase/client.ts for client components
- GitHub App private key: server/worker only — never import into client bundle
- Scan worker is a separate deploy — frontend calls it via SCAN_WORKER_URL

---
RESUME: Read docs/context-snapshot.md and docs/project-track.md only.
Do NOT read any other file unless I ask.
Confirm: "VibeAudit — Phase [N] done, [N]/8 complete. Next: Phase [N+1] — [name] — MODEL: [haiku/sonnet]."
Then wait for my next instruction.
