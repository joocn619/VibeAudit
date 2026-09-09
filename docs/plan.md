# Fix & Completion Plan — VibeAudit

References: [../FINDINGS.md](../FINDINGS.md) · [../original_description.md](../original_description.md) · [../Roadmap.md](../Roadmap.md)

No security issues were found in VibeAudit's own code. The main gap is that the headline "Autonomous PR Fix Engine" is demoed as working in the promo video but is an explicitly simulated response in the code.

## Status legend
`Not Started` · `In Progress` · `Done`

---

### 1. Fix the fabricated testimonial on the landing page
- **Status:** Not Started
- **Priority:** High (active honesty problem, trivial to fix)
- **Effort:** Trivial
- **What:** `components/marketing/landing-client.tsx:1293` has a customer quote claiming the "autonomous PR generator... opened 4 clean GitHub pull requests" — remove or rewrite this, since the backend itself honestly labels the same feature `not_implemented`.
- **Reference:** Roadmap.md, "Also flagged" section

### 2. Build the real Autonomous PR Fix Engine
- **Status:** Not Started
- **Priority:** High (this is the product's core marketed feature)
- **Effort:** Large — multi-day. Needs real AI patch generation per finding type (9 rules × patch templates) via the already-installed Anthropic SDK, plus Octokit PR creation, plus a diff-review UI flow before merge.
- **What:** Replace the simulated response in `app/api/fix/generate/route.ts` (`{simulated: true, status: "not_implemented"}`) with real patch generation and PR creation.
- **Reference:** Roadmap.md §1

### 3. Wire the 4 fixture-only dashboard pages to real data
- **Status:** Not Started
- **Priority:** Medium
- **Effort:** Large — ~1,900 lines of UI already exist (`components/dashboard/{fleet,redteam,analytics,compliance}-client.tsx`), but each needs its own real backend data model + API route. Treat as 4 separate medium tasks.
- **What:** Fleet topology from real connected-repo/cloud metadata; Compliance control mapping with real evidence; Analytics from real historical scan data; Red Team Arena scenario engine.
- **Reference:** Roadmap.md §2

### 4. Wire auto re-scan on push
- **Status:** Not Started
- **Priority:** Medium
- **Effort:** Small — webhook signature verification and event receipt already work; just needs the `push` handler to enqueue a scan instead of only logging.
- **What:** `app/api/github/webhook/route.ts` — trigger the existing scan pipeline on `push` events, surface results as a GitHub status check.
- **Reference:** Roadmap.md §3

### 5. Verify/clarify claimed-but-unconfirmed features
- **Status:** Not Started
- **Priority:** Low
- **Effort:** Small (investigation, not necessarily a build)
- **What:** Confirm whether "cryptographic" security certificates, the "Copilot" chat feature, and the "Interactive Sandbox Preview" landing page actually exist as described, or need building/correcting.
- **Reference:** Roadmap.md §4

### 6. Clarify promo video discrepancy
- **Status:** Not Started
- **Priority:** Low
- **Effort:** Not a code task — raise with seller
- **What:** Promo video closes with "Vanta Audit" / "thebeautytie.com" instead of VibeAudit AI / vibeauditai.com. Confirm whether this is a transcription artifact or a reused asset.
- **Reference:** original_description.md, promo video note

---

## Not in scope for this plan
The 9 detection rules, RLS/HMAC/Stripe/rate-limiting infrastructure, GitHub OAuth + magic-link login, and GitHub App repo sync were independently verified as genuinely implemented — see FINDINGS.md. No action needed.
