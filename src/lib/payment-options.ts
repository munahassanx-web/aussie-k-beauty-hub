/**
 * Payment methods shown to shoppers in the bag and at checkout. Stripe's
 * embedded checkout offers whatever is switched on in the Stripe Dashboard
 * (Settings → Payment methods), so only list a method here once it is on there.
 */
export const WALLETS_ENABLED = true; // Apple Pay and Google Pay
export const AFTERPAY_ENABLED = true;

/** Afterpay's per-order range in Australia, in cents. */
const AFTERPAY_MIN_CENTS = 100;
const AFTERPAY_MAX_CENTS = 200000;

/** One of four fortnightly Afterpay payments for this total, or null if Afterpay can't be used. */
export function afterpayInstalmentCents(totalCents: number): number | null {
  if (!AFTERPAY_ENABLED || totalCents < AFTERPAY_MIN_CENTS || totalCents > AFTERPAY_MAX_CENTS) return null;
  return Math.ceil(totalCents / 4);
}
