/**
 * REVIEW-ONLY preview of the order-confirmation email (or, with ?kind=review,
 * the review-request email).
 *
 * Renders the exact production template from
 * `src/lib/email/order-emails.server.ts` with clearly synthetic TEST data.
 * It reads nothing, writes nothing, and sends nothing — it only returns HTML.
 * Frame/asset URLs are rewritten to the current origin so the preview shows
 * the local artwork in `public/email/`.
 */

import { createFileRoute } from '@tanstack/react-router';

import { renderOrderConfirmation, renderReviewRequest, SITE_URL, type OrderEmailData } from '@/lib/email/order-emails.server';

const TEST_ORDER: OrderEmailData = {
  id: 'test0001-0000-4000-8000-000000000000',
  createdAt: '2026-08-18T02:00:00.000Z',
  currency: 'aud',
  amountCents: 9400,
  shippingCents: 0,
  discountCents: 0,
  lines: [
    { name: 'ANUA Heartleaf 77% Soothing Toner', quantity: 1, amountCents: 3400, lookupKey: null },
    { name: 'COSRX Advanced Snail 96 Mucin Power Essence', quantity: 1, amountCents: 3200, lookupKey: null },
    {
      name: 'BEAUTY OF JOSEON Relief Sun : Rice + Probiotics SPF50+ PA++++',
      quantity: 1,
      amountCents: 2800,
      lookupKey: null,
    },
  ],
  shippingName: 'Test Customer',
  shippingLine1: '1 Test Street',
  shippingLine2: null,
  shippingCity: 'Melbourne',
  shippingState: 'VIC',
  shippingPostcode: '3000',
  shippingCountry: 'Australia',
  shippingMethod: 'Standard',
  trackingNumber: null,
  shippingCarrier: null,
};

const REVIEW_TEST_ORDER: OrderEmailData = {
  ...TEST_ORDER,
  deliveredAt: '2026-10-06T02:00:00.000Z',
  lines: [
    { name: 'Dive In Soothing Cream', quantity: 1, amountCents: 4000, lookupKey: 'torriden_dive_in_soothing_cream_onetime' },
    { name: '1025 Dokdo Cleanser 150ml', quantity: 1, amountCents: 2400, lookupKey: 'round_lab_1025_dokdo_cleanser_150ml_onetime' },
  ],
};

export const Route = createFileRoute('/api/public/email-preview')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        // ?kind=review previews the review-request email with real catalogue products.
        const review = new URL(request.url).searchParams.get('kind') === 'review';
        const render = review ? renderReviewRequest(REVIEW_TEST_ORDER) : renderOrderConfirmation(TEST_ORDER);
        const html = render.html.split(`${SITE_URL}/email/`).join(`${origin}/email/`);
        return new Response(html, {
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
        });
      },
    },
  },
});
