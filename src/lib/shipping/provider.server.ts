/**
 * Shipping provider seam.
 *
 * Skin Grocer currently fulfils manually: staff buy the label in the carrier's
 * own portal (e.g. MyPost Business) and paste the consignment/tracking number
 * back into the order. That is the `manual` provider below and it is the only
 * one registered.
 *
 * A real integration (Australia Post Shipping & Tracking API for eligible
 * contract accounts, or an Australia Post eCommerce shipping partner such as a
 * multi-carrier platform) becomes a second module implementing
 * `ShippingProvider` and registering itself in `PROVIDERS`. Nothing else in the
 * app needs to change: the order columns (`shipping_provider`,
 * `shipping_service`, `shipment_id`, `label_status`, `label_url`,
 * `label_reference`, `tracking_number`, `shipping_cost_actual_cents`) are the
 * contract.
 *
 * Rules for any future adapter:
 *  - server-only (this file is `.server.ts`); credentials are read from
 *    process.env inside the call, never shipped to the browser
 *  - never fabricate rates, labels or tracking numbers
 *  - failures return `{ ok: false, error }`; they must not crash fulfilment
 */

export type ShipmentRequest = {
  orderId: string;
  service: string | null;
  toName: string | null;
  toLine1: string | null;
  toLine2: string | null;
  toCity: string | null;
  toState: string | null;
  toPostcode: string | null;
  toCountry: string | null;
  toEmail: string | null;
  toPhone: string | null;
  items: Array<{ name: string; quantity: number }>;
};

export type ShipmentResult =
  | {
      ok: true;
      provider: string;
      shipmentId: string | null;
      trackingNumber: string | null;
      labelStatus: 'requested' | 'ready';
      labelUrl: string | null;
      labelReference: string | null;
      costCents: number | null;
    }
  | { ok: false; provider: string; error: string };

export type ShippingProvider = {
  id: string;
  label: string;
  /** False when credentials/eligibility are absent — the UI stays manual. */
  isConfigured(): boolean;
  createShipment(request: ShipmentRequest): Promise<ShipmentResult>;
};

/**
 * Manual fulfilment: the label is bought in the carrier portal by a human, so
 * there is nothing to call. Kept as a provider so the UI has one code path.
 */
export const manualProvider: ShippingProvider = {
  id: 'manual',
  label: 'Manual (carrier portal)',
  isConfigured: () => true,
  createShipment: async () => ({
    ok: false,
    provider: 'manual',
    error:
      'No automated label provider is connected. Create the label in your carrier portal and paste the consignment/tracking number into this order.',
  }),
};

export const PROVIDERS: ShippingProvider[] = [manualProvider];

export function getProvider(id: string | null | undefined): ShippingProvider {
  return PROVIDERS.find((p) => p.id === id) ?? manualProvider;
}

/** True only when a real, credentialled carrier adapter is registered. */
export function hasAutomatedProvider(): boolean {
  return PROVIDERS.some((p) => p.id !== 'manual' && p.isConfigured());
}
