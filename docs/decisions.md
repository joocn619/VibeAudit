# Architecture Decisions — VibeAudit

Record every important decision so future you (and the Flippa buyer) understands why.

| Decision | Chosen | Alternatives | Why | Date |
|----------|--------|--------------|-----|------|
| Database | Supabase | Firebase, PlanetScale | SQL + RLS + free tier, cheap handover | 2026-07-05 |
| Auth | Supabase Auth + GitHub OAuth | NextAuth, Clerk | GitHub OAuth is the natural login for dev audience | 2026-07-05 |
| Payments | Stripe | Paddle, Lemon Squeezy | Best DX; use Lemon Squeezy/Paddle if BD payout needed | 2026-07-05 |
| Scan engine | Semgrep + custom rules | Snyk API, CodeQL, home-grown regex | Open-source, self-hostable, no per-scan license cost → high margin | 2026-07-05 |
| Plain-English layer | Claude API | OpenAI, template strings | Best at turning CWE → clear human explanation; the moat | 2026-07-05 |
| Repo access | GitHub App | Personal OAuth tokens | App = scoped per-repo perms + PR write + webhooks for monitoring | 2026-07-05 |
| Scan runtime | Separate worker (Railway/Fly) | Vercel serverless | Semgrep needs long runtime + filesystem; Vercel functions time out | 2026-07-05 |
| Deploy | Vercel + Supabase | Railway, Render | Best Next.js integration, clean buyer handover | 2026-07-05 |

## Positioning / Legal Decisions (important for a security product)
- Position as **"security monitoring + evidence"**, NEVER "guaranteed secure." Automated scanning catches ~40% of issue classes.
- Every report carries a disclaimer: findings are best-effort, not a guarantee. Protects against post-sale liability claims.
- Never store user source code long-term. Scan in ephemeral worker, keep only findings metadata. (Privacy + trust + lower breach surface.)

## API Design Decisions
- All routes check `supabase.auth.getUser()` (not getSession — spoofable). *(Ironic to get this wrong in a security scanner.)*
- Service role key only in webhook handlers and the scan worker, never client.
- GitHub App private key only server-side / worker, never exposed.
- All user data filtered by user_id via RLS.

## UI/UX Decisions
- Dark theme only (premium dev-tool feel, saves time).
- Security Score as a big animated ring (0–100) — the shareable hero moment.
- Findings sorted Critical → High → Low, each with plain-English + one-click fix.
- shadcn/ui for all primitives.

## Business / Exit Decisions
- Keep infra lean (all free tiers during build) → high profit margin → premium Flippa multiple. Lean cost = premium exit.
- Build MVP + landing first; decide after whether to run free-scan loop (adds MRR, higher sale) or flip cold at 0 MRR (~$3–8k).
- Handover bundle: GitHub repo, GitHub App, Supabase project, Vercel project, domain, Stripe config, worker deploy, .env template.
