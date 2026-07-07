export type PlanId = "free" | "pro" | "agency";

export const PLANS = {
  FREE: {
    id: "free" as PlanId,
    name: "Free",
    price: 0,
    priceId: undefined as string | undefined,
    scansPerMonth: 1,
    reposLimit: 1,
    features: ["1 scan/month", "Score only + top issue teaser"],
  },
  PRO: {
    id: "pro" as PlanId,
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    scansPerMonth: Infinity,
    reposLimit: Infinity,
    features: ["Unlimited scans", "Full plain-English report", "AI Fix PRs", "Continuous monitoring"],
  },
  AGENCY: {
    id: "agency" as PlanId,
    name: "Agency",
    price: 99,
    priceId: process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID,
    scansPerMonth: Infinity,
    reposLimit: 15,
    features: ["15 repos", "White-label reports", "VibeAudit Verified badge"],
  },
} as const;

/** Resolve a plan id from a Stripe price id (used by the webhook). */
export function planIdFromPriceId(priceId: string | null | undefined): PlanId {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID) return "agency";
  return "free";
}

/** Resolve the Stripe price id for a checkout plan selection. */
export function priceIdForPlan(plan: PlanId): string | undefined {
  if (plan === "pro") return PLANS.PRO.priceId;
  if (plan === "agency") return PLANS.AGENCY.priceId;
  return undefined;
}
