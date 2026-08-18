/**
 * Client-safe carrier reference data.
 *
 * Tracking URLs here are public consumer tracking pages — they need no
 * credentials and no API access. Nothing in this file talks to a carrier API.
 */

export type CarrierId = 'auspost' | 'sendle' | 'aramex' | 'couriersplease' | 'dhl' | 'other';

export type Carrier = {
  id: CarrierId;
  label: string;
  /** Services the business can actually select today. Purely descriptive labels. */
  services: string[];
  /** Public tracking page. `null` when the carrier has no stable public URL pattern. */
  trackingUrl: ((tracking: string) => string) | null;
};

export const CARRIERS: Carrier[] = [
  {
    id: 'auspost',
    label: 'Australia Post',
    services: ['Parcel Post', 'Parcel Post + Signature', 'Express Post', 'Express Post + Signature'],
    trackingUrl: (t) => `https://auspost.com.au/mypost/track/details/${encodeURIComponent(t)}`,
  },
  { id: 'sendle', label: 'Sendle', services: ['Standard', 'Express'], trackingUrl: (t) => `https://track.sendle.com/tracking?ref=${encodeURIComponent(t)}` },
  { id: 'aramex', label: 'Aramex', services: ['Road Express'], trackingUrl: (t) => `https://www.aramex.com.au/tools/track/?l=${encodeURIComponent(t)}` },
  { id: 'couriersplease', label: 'CouriersPlease', services: ['Classic', 'Priority'], trackingUrl: (t) => `https://www.couriersplease.com.au/tools-track/no/${encodeURIComponent(t)}` },
  { id: 'dhl', label: 'DHL', services: ['Express Worldwide'], trackingUrl: (t) => `https://www.dhl.com/au-en/home/tracking.html?tracking-id=${encodeURIComponent(t)}` },
  { id: 'other', label: 'Other', services: [], trackingUrl: null },
];

export function findCarrier(label: string | null | undefined): Carrier | null {
  if (!label) return null;
  const needle = label.trim().toLowerCase();
  return CARRIERS.find((c) => c.label.toLowerCase() === needle || c.id === needle) ?? null;
}

export function trackingLink(carrierLabel: string | null | undefined, tracking: string | null | undefined): string | null {
  const carrier = findCarrier(carrierLabel);
  if (!carrier?.trackingUrl || !tracking) return null;
  return carrier.trackingUrl(tracking.trim());
}

/** Australia Post is Skin Grocer's default carrier — staff can still change it. */
export const DEFAULT_CARRIER_LABEL = 'Australia Post';

/**
 * Shape check only. A tracking number is either something the carrier issued or
 * it is nothing — we never generate one, and we never claim a status from it.
 * AusPost consignment/article IDs are alphanumeric, typically 10–30 characters.
 */
export function isPlausibleTracking(carrierLabel: string | null | undefined, tracking: string | null | undefined) {
  const t = (tracking ?? '').trim();
  if (t.length === 0) return false;
  if (findCarrier(carrierLabel)?.id === 'auspost') return /^[A-Za-z0-9]{8,40}$/.test(t);
  return t.length >= 4;
}

/** Customer-facing label for the outbound tracking link, e.g. "Track with Australia Post". */
export function trackingLinkLabel(carrierLabel: string | null | undefined) {
  const carrier = findCarrier(carrierLabel);
  return carrier ? `Track with ${carrier.label}` : 'Track this parcel';
}
