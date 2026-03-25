import Stripe from "stripe";

function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_to_bypass_build', {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});
