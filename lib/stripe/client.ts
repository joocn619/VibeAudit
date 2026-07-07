import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_stub", {
  apiVersion: "2024-10-28.acacia" as any,
});
