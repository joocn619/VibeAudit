# Flip Plan — VibeAudit (Flippa / Acquire.com)

> Goal: build → sell without marketing. This doc = what the buyer gets + how to hand over + pricing.

## Two Exit Paths

| Path | Effort | Expected price | When |
|------|--------|----------------|------|
| **A — Cold flip, 0 MRR** | Build MVP + landing only, list immediately | **$3–8k** ("cost of code" + AI-trend premium) | Right after Phase 8 |
| **B — Warm flip, small MRR** | Build + run free-scan loop 4–6 wks (post once to HN / r/cursor / r/ClaudeAI / X — near-zero marketing) | **$10–25k** (working product + real users + MRR story) | 6–9 weeks after build |

Recommendation: build MVP, then decide. Even 20–50 free-scan users + a handful of $29 Pro = much stronger listing. Path B is small extra effort for multiple-times higher exit.

## What the Buyer Actually Receives (handover bundle)
- **Source code** — full Next.js repo + scan worker (repo ownership transferred)
- **GitHub App** — registered "VibeAudit" app, moved to buyer's org
- **Supabase project** — DB + auth + any users (transferred/exported)
- **Vercel project** + **worker deploy** (Railway/Fly)
- **Domain** (e.g. vibeaudit.com) → buyer's registrar
- **Stripe config** — price tiers + webhook setup (buyer connects own Stripe)
- **API keys template** (.env.example) — buyer swaps in own Anthropic/GitHub keys
- **Landing page + copy** + shareable score OG
- **Any traffic / free-scan users / email list** (exported)
- **Docs** — this docs/ folder = instant buyer onboarding

After handover, all ongoing bills (Supabase, Claude API, hosting) become the **buyer's** cost. Keep your build lean → high margin → premium multiple.

## Why a Buyer Buys at 0 MRR
1. **Time arbitrage** — skips 4 weeks of build; buyer is often an operator/marketer who can't/won't code.
2. **Trend ticket** — instant entry into the AI-security wave (CVE curve 6→15→35 in 2026) without spotting it.
3. **Built-in distribution** — free-scan → shareable score → viral loop already coded; buyer flips the switch.
4. **Low risk** — small bet, no HIPAA/FINRA legal liability, clean handover.

## Why VibeAudit Flips Faster Than Other Ideas
- 2-minute self-demo (connect → score → fix PR) — buyer sees value without any customers
- One-line pitch anyone understands ("AI-built app? Scan it before it's hacked")
- Hot trend = FOMO pricing without revenue
- Huge buyer pool (indie hackers / devs know this niche)
- Clean turnkey handover (no B2B contracts / data migration)

## Listing Setup
- **Marketplace:** Flippa (primary — broad buyer, your stated target) + Acquire.com (secondary, better SaaS prices if MRR)
- **Category:** SaaS → Developer Tools / Security
- **Title formula:** [what] + [proof metric] + [why attractive]
  - 0 MRR: "AI-App Security Scanner SaaS — turnkey, GitHub App + Claude fix-PR, on the 2026 AI-security trend"
  - With MRR: "VibeAudit — AI-code security scanner, $Xk MRR, 90% margin, GitHub App distribution, fully automated"
- **Must include:** demo video (2-min scan→fix), tech stack + handover list, profit margin (lean stack = 90%+), founder hours/week (low = hands-off), growth roadmap (monitoring, agency white-label, Cursor extension — left for buyer).

## Honesty (protects you post-sale)
- Automated scanning catches ~40% of issue classes → market as "security monitoring + evidence," never "guaranteed secure."
- State clearly in listing: no guaranteed revenue, no established brand (if 0 MRR), user base size as-is.

## Pre-Listing Checklist
- [ ] 2-min demo recorded (connect repo → 38/100 → Fix PR → 91/100)
- [ ] Landing + free-scan lead magnet live
- [ ] docs/audit.md filled (honest)
- [ ] Handover bundle list ready (above)
- [ ] Costs documented (proves margin)
- [ ] Decide Path A vs B
