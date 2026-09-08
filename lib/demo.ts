/**
 * Demo mode for walkthrough recordings / hosted demos.
 *
 * Enabled when NEXT_PUBLIC_DEMO_MODE === "true". This is set by the site
 * OPERATOR (an env var), never by a request — so unlike the removed
 * `?demo=true` / cookie trigger it cannot be flipped on by a visitor. In demo
 * mode the dashboard is viewable without login but shows only hardcoded demo
 * fixtures; it never queries or exposes real users' data (RLS still applies to
 * the anonymous session).
 *
 * TRADE-OFF: if you set this on your real production deployment, the demo
 * dashboard becomes publicly viewable (fake data only). Turn it OFF for a
 * real, auth-gated launch. Ideal usage is a separate demo/preview deployment,
 * or flip it on only while recording and off again after.
 *
 *   Local:  NEXT_PUBLIC_DEMO_MODE=true npm run dev
 *   Vercel: set NEXT_PUBLIC_DEMO_MODE=true in the project's env vars, redeploy.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_PROFILE = {
  email: "demo@vibeaudit.ai",
  plan: "agency" as const,
  onboarding_completed: true,
};

/** Repo count shown in the header/sidebar while recording without a DB. */
export const DEMO_REPO_COUNT = 4;
