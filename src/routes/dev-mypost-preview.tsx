import { createFileRoute } from '@tanstack/react-router';
import { MyPostPrepPanel } from '@/components/admin/mypost-prep-panel';
import type { AdminOrderDetail } from '@/lib/admin-orders.functions';

/** TEMPORARY visual-QA harness for the MyPost prep panel — synthetic data only. Delete after QA. */

const base: AdminOrderDetail = {
  id: 'c8fbd903-7663-46f4-8ae0-80a47899f60d',
  createdAt: '2026-08-20T10:00:00Z',
  status: 'paid',
  fulfillmentStatus: 'processing',
  environment: 'live',
  amountCents: 12800,
  currency: 'AUD',
  isSubscriptionOrder: false,
  itemCount: 2,
  customerName: 'Alex Example',
  customerEmail: 'alex@example.com',
  isGuest: true,
  shippingCity: 'Wollert',
  shippingState: 'VIC',
  trackingNumber: null,
  shippingCarrier: null,
  lines: [
    { name: 'ANUA Heartleaf 77 Soothing Toner 250ml', quantity: 1, amountCents: 3900, lookupKey: null },
    { name: 'Beauty of Joseon Relief Sun 50ml', quantity: 1, amountCents: 3200, lookupKey: null },
  ],
  shippingName: 'Alex Example',
  shippingPhone: '0400 000 000',
  shippingLine1: '1008 Example Road',
  shippingLine2: null,
  shippingPostcode: '3750',
  shippingCountry: 'AU',
  shippingMethod: 'standard',
  shippingCents: 0,
  discountCents: 0,
  pointsEarned: 0,
  pointsRedeemed: 0,
  stripeSessionId: 'cs_test_synthetic',
  stripePaymentIntentId: null,
  packedAt: null,
  shippedAt: null,
  dispatchedAt: null,
  deliveredAt: null,
  cancelledAt: null,
  refundedAt: null,
  refundedCents: null,
  fulfillmentUpdatedAt: null,
  opsNotes: null,
  shippingProvider: 'manual',
  shippingService: 'Parcel Post',
  shipmentId: null,
  labelStatus: 'none',
  labelUrl: null,
  labelReference: null,
  shippingCostActualCents: null,
};

const expressOrder: AdminOrderDetail = {
  ...base,
  id: 'a1b2c3d4-0000-4000-8000-000000000000',
  shippingService: 'Express Post',
  isSubscriptionOrder: true,
};

const sparseOrder: AdminOrderDetail = {
  ...base,
  id: 'f0f0f0f0-0000-4000-8000-000000000000',
  shippingPhone: null,
  customerEmail: null,
  shippingService: null,
  shippingLine2: 'Unit 5',
  shippingCountry: 'AU',
};

export const Route = createFileRoute('/dev-mypost-preview')({
  head: () => ({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] }),
  component: () => (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Standard guest order</p>
      <MyPostPrepPanel order={base} />
      <p className="mt-10 text-xs uppercase tracking-[0.16em] text-muted-foreground">Circle express order</p>
      <MyPostPrepPanel order={expressOrder} />
      <p className="mt-10 text-xs uppercase tracking-[0.16em] text-muted-foreground">Missing phone/email/service</p>
      <MyPostPrepPanel order={sparseOrder} />
    </main>
  ),
});
