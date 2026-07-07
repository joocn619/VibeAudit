# Feature Tracker — VibeAudit

## MVP Features (Week 1–2 — must ship for flip)
- [x] Project scaffold (Next.js + Supabase + Tailwind dark system)
- [x] Supabase schema (repos, scans, findings, fix_prs + RLS)
- [x] Auth flow (signup, login, **GitHub OAuth** — primary)
- [x] GitHub App: connect repo (read code, write PR permission)
- [ ] Dashboard layout (sidebar + header + repo list)
- [ ] **Scan engine** — Semgrep + vibe-coder rules, returns findings
- [ ] **Security Score (0–100)** — scorer maps findings → grade
- [ ] **Plain-English report** — Claude converts CWE finding → human explanation + fix
- [ ] Scan result page (score ring + findings list + severity tags)
- [ ] **"Fix it for me"** — Claude generates fix → opens GitHub PR
- [ ] Stripe billing (checkout + webhook + plan gating: Free 1 scan/mo)
- [ ] Onboarding (connect GitHub → first scan)

## The 6 Core Checks (the USP — build these rules first)
- [ ] Exposed API keys (hardcoded secrets in client/frontend)
- [ ] Supabase/Firebase RLS off (public table access)
- [ ] Missing auth checks (unprotected routes / broken access control)
- [ ] Payment bypass (client-side price / amount)
- [ ] SQL / prompt injection (raw user input into query/prompt)
- [ ] No rate limiting (unthrottled AI/API endpoints)

## Growth Features (Week 3 — V2, only if running loop before sale)
- [ ] Continuous monitoring — auto re-scan on git push (webhook)
- [ ] New-issue alerts (email / Discord)
- [ ] Launch Checklist ("15 things before shipping")
- [ ] Shareable score card (viral loop — "My app scored 38 😱")
- [ ] Usage analytics (PostHog events)
- [ ] Error tracking (Sentry)

## Premium Features (V3 — post-sale roadmap, document only)
- [ ] Agency/portfolio plan (15+ repos)
- [ ] White-label client reports (branded PDF)
- [ ] "🛡️ VibeAudit Verified" badge
- [ ] Cursor / Claude Code extension (warn while coding)
- [ ] Compliance-lite PDF (show investors/clients)

## Landing Page
- [ ] Hero — "Built your app with AI? Scan it before it gets hacked."
- [ ] Free-scan CTA (connect GitHub, get score) — lead magnet
- [ ] Features section (6 core checks as cards)
- [ ] "Meet Sarah" story block (relatable real example)
- [ ] Pricing (Free / Pro $29 / Agency $99)
- [ ] Social proof (X scans done, N issues found)
- [ ] FAQ (is it accurate? is my code safe with you? etc.)
- [ ] Footer + SEO meta + OG image

## Completed
- [x] docs/ folder created
- [x] Phase 0: Project scaffold (Next.js 14 + Supabase + Tailwind dark system + folder structure)
- [x] Phase 1: Supabase database schema (tables, indexes, RLS policies, triggers, TypeScript types)
- [x] Phase 2: Auth flow (GitHub OAuth primary, email secondary) + Octokit GitHub App integration & repo sync

## Bugs / Issues
(add as discovered)

## ⚠️ Flip Note
For 0-MRR flip, ship **MVP + landing only**. Score + shareable + plain-English report = the demo the buyer sees. Skip V2/V3 unless running the free-scan loop 4–6 weeks to add paying users before listing.
