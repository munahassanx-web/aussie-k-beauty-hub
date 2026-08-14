import { createFileRoute } from '@tanstack/react-router';
import { createStripeClient } from '@/lib/stripe.server';

export const Route = createFileRoute('/api/public/diag-prices')({
  server: {
    handlers: {
      GET: async () => {
        const stripe = createStripeClient('sandbox');
        const prices = await stripe.prices.list({ limit: 100, active: true });
        return Response.json(prices.data.map((p) => `${p.lookup_key}:${p.type}`));
      },
    },
  },
});
