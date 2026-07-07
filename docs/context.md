# VibeAudit

## One-Liner
VibeAudit helps non-technical AI app builders (Cursor / Lovable / Bolt / Claude Code users) find and fix security holes in their apps without hiring a developer or understanding security jargon.

## What It Does
Connect a GitHub repo → VibeAudit scans it in ~2 minutes → returns a Security Score (0–100) and a plain-English report of every critical issue (exposed API keys, RLS off, missing auth, payment bypass, injection, no rate limiting). One "Fix it for me" button generates an AI fix and opens a GitHub pull request. Continuous monitoring re-scans on every push and alerts on new risk.

## Target User
- **Who:** Vibe-coders — indie hackers, solo founders, freelancers, non-technical "vibe CTOs" who ship apps built mostly by AI. Millions, growing daily.
- **Pain:** They know they don't understand security. Breach stories (Moltbook, CVE surge 6→15→35 in 2026) scare them. Every AI-generated feature = new hidden risk. They can't read `CWE-798`.
- **Why they pay:** Insurance. $29/mo vs a $5,000 leaked-key OpenAI bill, a data breach that kills their business, or a $150/hr consultant they philosophically refuse to hire.

## Niche Type
ai-tool (dev-tool / security scanner sub-type)

## Core User Journey (3 steps)
Signup → Connect GitHub repo → See Score 38/100 + plain-English critical issues → Click "Fix it for me" → Merge PR → Re-scan 91/100 → Upgrade for monitoring

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui + Framer Motion |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (Email + GitHub OAuth) |
| Payments | Stripe (global) — MoR alt: Lemon Squeezy/Paddle (BD payout) |
| AI | Claude API (plain-English report + fix generation) |
| Scan Engine | Semgrep + custom vibe-coder rulesets (self-hosted CLI in worker) |
| GitHub | GitHub App (repo read, PR write) |
| Email | Resend + React Email |
| Deploy | Vercel (frontend) + Supabase (DB) + Railway/Fly (scan worker) |
| Analytics | PostHog |
| Monitoring | Sentry |

## Revenue Model
| Plan | Price | Limits |
|------|-------|--------|
| Free | $0 | 1 scan/month, score only + top issue teaser (lead magnet + viral share) |
| Pro | $29/mo | Unlimited scans, full plain-English report, AI Fix PRs, continuous monitoring |
| Agency | $99/mo | 15 repos, white-label client reports, VibeAudit Verified badge |

$1000 MRR ≈ 35 Pro users. Exit target (Flippa/Acquire): 0 MRR = $3–8k code asset; $500–1k MRR = $10–25k; $11k MRR = premium dev-tool multiple.

## The Moat (why not just ChatGPT / Snyk)
1. **Plain-English layer** — Snyk says `CWE-798`; VibeAudit says "Your OpenAI key is visible in app/page.tsx line 12, anyone can bill your account, here's the fix." Non-devs understand → the actual product.
2. **Vibe-coder-specific ruleset** — targets the exact ways AI codegen fails (RLS off, client-side price, hardcoded keys). Generic SAST tools don't.
3. **Fix + PR loop** — user clicks Merge, never reads code.
4. **Continuous monitoring** — recurring fear + daily code change = subscription retention.

## The 6 Core Checks (USP)
| Check | Kills |
|---|---|
| Exposed API keys | AI hardcodes OPENAI_API_KEY in frontend → $4,200 bill |
| Supabase/Firebase RLS off | #1 vibe-app killer — anyone reads all user data from browser console |
| Missing auth checks | Route exists, no "can THIS user access THIS data?" |
| Payment bypass | Price set client-side → $99 bought for $1 |
| SQL / prompt injection | User input passed raw into query/prompt |
| No rate limiting | Bot runs up a $10,000 API bill |

## Full File Structure
```
vibeaudit/
├── app/
│   ├── (marketing)/page.tsx              # landing + free scan CTA
│   ├── (auth)/{login,signup}/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx            # repos + latest scores
│   │   ├── scan/[repoId]/page.tsx        # scan result + findings + fix
│   │   ├── monitoring/page.tsx           # continuous monitor config
│   │   ├── settings/{profile,billing}/page.tsx
│   │   └── onboarding/page.tsx           # connect GitHub step
│   ├── api/
│   │   ├── auth/callback/route.ts
│   │   ├── github/{connect,webhook}/route.ts
│   │   ├── scan/{start,status}/route.ts
│   │   ├── fix/generate/route.ts         # Claude → PR
│   │   └── stripe/{checkout,portal,webhook}/route.ts
│   └── layout.tsx
├── components/{ui,marketing,dashboard,shared,scan}/
├── lib/
│   ├── supabase/{client,server}.ts
│   ├── github/{app,pr}.ts
│   ├── scan/{engine,rules,scorer}.ts     # Semgrep wrapper + score calc
│   ├── ai/{client,explain,fix}.ts        # Claude plain-English + fix
│   ├── stripe/{client,plans}.ts
│   └── utils.ts
├── worker/                               # scan worker (Semgrep runner)
├── types/{database,index}.ts
├── docs/
├── middleware.ts
├── .env.example
└── README.md
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_APP_WEBHOOK_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_AGENCY_MONTHLY_PRICE_ID=
RESEND_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
SENTRY_DSN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
SCAN_WORKER_URL=
```

## Key Links (fill after setup)
- Local: http://localhost:3000
- Production: https://vibeaudit.vercel.app
- Supabase: https://supabase.com/dashboard/project/[id]
- GitHub App: https://github.com/settings/apps/vibeaudit
- Stripe: https://dashboard.stripe.com
