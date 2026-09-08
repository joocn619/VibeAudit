import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

/**
 * Lazily construct the Stripe client. Initialization is deferred to first use
 * (not module load) so a missing key fails at request time — not at build time
 * when Next.js collects page data without runtime env vars.
 */
export function getStripe(): Stripe {
  if (stripeSingleton) return stripeSingleton;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  stripeSingleton = new Stripe(secretKey, {
    apiVersion: "2024-10-28.acacia" as Stripe.LatestApiVersion,
  });
  return stripeSingleton;
}
