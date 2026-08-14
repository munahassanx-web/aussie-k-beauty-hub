import { createServerFn } from '@tanstack/react-start';
import { createStripeClient } from '@/lib/stripe.server';

export const listPriceKeys = createServerFn({ method: 'GET' }).handler(async () => {
  const stripe = createStripeClient('sandbox');
  const prices = await stripe.prices.list({ limit: 100, active: true });
  return prices.data.map((p) => p.lookup_key).filter(Boolean);
});
