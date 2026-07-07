# VibeAudit

**Built your app with AI? Scan it before it gets hacked.**

Security scanner for AI-built apps (Cursor / Lovable / Bolt / Claude Code). Connect a GitHub repo → get a Security Score (0–100) + a plain-English report of every critical issue → click "Fix it for me" to auto-open a GitHub PR. Continuous monitoring re-scans on every push.

## Who it's for
Non-technical vibe-coders — indie hackers, solo founders, freelancers shipping AI-generated apps who can't read `CWE-798` but know their app might be hackable.

## The 6 core checks
Exposed API keys · Supabase/Firebase RLS off · Missing auth checks · Payment bypass · SQL/prompt injection · No rate limiting

## Stack
Next.js 14 · TypeScript · Tailwind + shadcn/ui · Supabase (Postgres + RLS + Auth) · Stripe · Claude API (plain-English + fix) · Semgrep (scan engine) · GitHub App · Resend · Vercel + scan worker (Railway/Fly)

## Pricing
Free ($0, 1 scan/mo) · Pro ($29/mo, unlimited + fix PR + monitoring) · Agency ($99/mo, 15 repos + white-label + badge)

## Build with the saas-builder skill
This project follows the `saas-builder` Phase system. Everything is in `docs/`:

| File | Purpose |
|------|---------|
| `docs/context.md` | Product overview, stack, file structure, env vars |
| `docs/features.md` | MVP / Growth / Premium checklist |
| `docs/decisions.md` | Architecture decision log |
| `docs/project-track.md` | Live build tracker (Claude Code updates each phase) |
| `docs/context-snapshot.md` | Compressed context for new sessions (paste to resume) |
| `docs/prompts.md` | All 8 Phase prompts — paste into Claude Code one at a time |
| `docs/audit.md` | Final audit template (fill after Phase 8) |
| `docs/flip-plan.md` | Flippa/Acquire handover + pricing plan |

### Start building
1. Complete the Pre-Build validation (Supabase project, GitHub App, Node 18+, etc. — see docs/context.md env vars)
2. Open Claude Code, paste the **Phase 0** prompt from `docs/prompts.md`
3. Proceed one phase at a time (switch model per the `MODEL:` tag)

## Goal
Build to a clean, demoable product → flip on Flippa. See `docs/flip-plan.md` for the two exit paths (cold 0-MRR ~$3–8k, or warm with free-scan loop ~$10–25k).
