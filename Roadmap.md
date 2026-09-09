# Roadmap — Remaining Work Disclosed at Time of Sale

This documents functionality claimed in the individual Flippa listing ([original_description.md](original_description.md)) that the code audit ([FINDINGS.md](FINDINGS.md)) found to be incomplete or not built. Unlike Voxorio, several of these gaps were **not** disclosed in this specific listing text — they only surfaced via a separate "Honest Disclosure" section on a bundled listing sold alongside Voxorio, and via direct code inspection. Tracking here as forward work and as a record of the discrepancy.

## 1. Autonomous PR Fix Engine — claimed working, confirmed NOT implemented

**Claimed here:** "Autonomous PR Fix Engine: ...it writes parameterized query replacements and server-side validation logic, opening a clean GitHub PR automatically." The promo video demo (00:47–01:38) shows a score jumping from 58 to 99/A+ after "VibeAudit didn't just flag the problem. It already opened the fix," walking through a real-looking PR diff for a SQL-injection fix, ending with "Merge it to GitHub."

**Actual status (confirmed in code):** `app/api/fix/generate/route.ts` returns an explicitly flagged simulated response (`{simulated: true, status: "not_implemented"}`). No real PR is ever opened. The Anthropic SDK is installed and route structure exists, but AI patch generation and PR creation still need to be built.

**This is the single biggest gap between the listing/demo and the shipped code** — it's presented as a signature, already-working feature (and shown "live" in the promo video) rather than disclosed as incomplete. This item alone should be central to any post-sale conversation with the seller.

**Work to do:** Build the actual patch-generation logic (Anthropic SDK call to produce a diff for a given finding) and wire it to Octokit's PR-creation API, replacing the simulated response.

## 2. Four dashboard pages — claimed as live product surfaces, confirmed fixture-only

**Claimed here:** "Analytics tracks your fleet score over time by attack vector. Compliance maps every control to SOC 2, ISO 27001, GDPR, and HIPAA with evidence attached. Fleet topology maps your architecture across every cloud."

**Actual status (confirmed in code):** `components/dashboard/{fleet,redteam,analytics,compliance}-client.tsx` — 1,908 lines total, all hardcoded fixture arrays (e.g. `INITIAL_NODES` in fleet-client.tsx), no calls to real backend/API endpoints.

**Work to do:** Build the backing data model and API routes for each of the four pages (fleet topology from real connected-repo/cloud metadata, compliance control mapping with real evidence links, analytics from real historical scan data, Red Team Arena scenario engine), then wire the existing UI to live data.

## 3. Continuous monitoring — webhook received but no auto re-scan

**Claimed here (video, 01:38):** "Monitoring catches risky pushes before they merge."

**Actual status (confirmed in code):** `app/api/github/webhook/route.ts` correctly verifies and receives `push` events, but the handler only logs them — no scan is actually triggered on push.

**Work to do:** Wire the `push` event handler to enqueue a re-scan of the affected repo, and surface results before merge (e.g. as a GitHub status check).

## 4. Items claimed but not independently verified — need follow-up

- **Downloadable Executive Security Certificates** ("cryptographic, verifiable A+ Grade compliance audits") — public certificate pages/routes exist, but the generation logic and cryptographic verification claim were not deep-audited; confirm before marketing this as "cryptographic."
- **"Copilot answers security questions about your codebase on demand"** (video, 02:04) — no dedicated chat/Copilot feature was found during the audit; may exist under a different name, or may be aspirational demo content. Needs direct verification against the running app.
- **"Interactive Sandbox Preview" on the landing page** (lets visitors test simulated scans without signing up) — not verified either way.
- **Scan-worker service** — confirmed a placeholder stub in code (6-line stub, "future expansion" comment), not required for the 9 built-in detection rules, so this is lower priority than a customer-facing gap.

## Also flagged (not a code gap, but a listing discrepancy)

The promotional video's closing line names the product "**Vanta Audit**" and directs viewers to "**thebeautytie.com**" — neither matches VibeAudit AI / vibeauditai.com. Worth clarifying with the seller whether this is a transcription error or a sign the promo video was reused/templated from an unrelated project.

## Not on this list

The 9 detection rules, RLS/HMAC/Stripe/rate-limiting infrastructure, GitHub OAuth + magic-link login, and GitHub App repo sync were all independently verified as genuinely implemented in [FINDINGS.md](FINDINGS.md). No further gaps found there.
