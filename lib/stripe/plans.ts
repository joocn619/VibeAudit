export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    scansPerMonth: 1,
    features: ["1 scan/month", "Score only + top issue teaser"],
  },
  PRO: {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    scansPerMonth: Infinity,
    features: ["Unlimited scans", "Full plain-English report", "AI Fix PRs", "Continuous monitoring"],
  },
  AGENCY: {
    name: "Agency",
    price: 99,
    priceId: process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID,
    scansPerMonth: Infinity,
    reposLimit: 15,
    features: ["15 repos", "White-label reports", "VibeAudit Verified badge"],
  },
};
