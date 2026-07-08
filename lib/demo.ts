/**
 * Safe, recording-only demo mode.
 *
 * Enabled ONLY when NEXT_PUBLIC_DEMO_MODE === "true" AND the app is not running
 * in production. Because it is gated on server-evaluated NODE_ENV (and Vercel
 * builds run as production), it can never be toggled by a request the way the
 * old `?demo=true` bypass could. Use it for local walkthrough recordings:
 *
 *   NEXT_PUBLIC_DEMO_MODE=true npm run dev
 */
export const DEMO_MODE =
  process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_PROFILE = {
  email: "demo@vibeaudit.ai",
  plan: "agency" as const,
  onboarding_completed: true,
};

/** Repo count shown in the header/sidebar while recording without a DB. */
export const DEMO_REPO_COUNT = 4;
