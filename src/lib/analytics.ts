/**
 * Provider-agnostic, first-party analytics event layer.
 *
 * No third-party tracker is installed. Events are pushed onto `window.dataLayer`
 * using GA4-style ecommerce naming, so a tag manager / GA4 / Meta container can be
 * attached later WITHOUT touching any call site. Until a measurement ID is
 * configured by the owner, nothing leaves the browser.
 *
 * Privacy rules enforced here:
 * - never accept or forward name, email, address, phone, or QR tokens
 * - order identifiers are hashed-free but non-PII (Stripe order id only)
 * - loyalty is expressed as a tier string only, never a member identity
 */

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  price?: number;
  quantity?: number;
  index?: number;
  item_list_name?: string;
};

export type AnalyticsEvent =
  | 'view_item_list'
  | 'select_item'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'search'
  | 'newsletter_signup';

type Payload = Record<string, unknown>;

/** Keys that must never be sent, whatever a call site passes. */
const BLOCKED = /^(email|name|first_?name|last_?name|phone|address|postcode|token|customer|user_id)$/i;

declare global {
  interface Window {
    dataLayer?: Payload[];
    __sgAnalyticsDebug?: Payload[];
  }
}

/**
 * Production measurement is opt-in: only the live domain may feed a real
 * provider, so preview/dev traffic can never contaminate production reporting.
 */
export function isProductionMeasurement(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'skingrocer.com.au' || window.location.hostname === 'www.skingrocer.com.au';
}

function scrub(payload: Payload): Payload {
  const clean: Payload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (BLOCKED.test(key)) continue;
    if (value === undefined || value === null) continue;
    clean[key] = value;
  }
  return clean;
}

/** Push a single event. Never throws — analytics must not break a page. */
export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const entry = { event, ...scrub(payload) };
    if (isProductionMeasurement()) {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push(entry);
    } else {
      // Preview/dev: keep a local buffer for QA instead of emitting anything.
      window.__sgAnalyticsDebug = window.__sgAnalyticsDebug ?? [];
      window.__sgAnalyticsDebug.push(entry);
    }
  } catch {
    /* best effort only */
  }
}

/** Guard so an event can only fire once per key for this browser session. */
export function trackOnce(key: string, event: AnalyticsEvent, payload: Payload = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const storageKey = `sg-analytics-once:${key}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, '1');
  } catch {
    /* private mode — fall through and still fire once per page load */
  }
  track(event, payload);
}

export function centsToAud(cents: number): number {
  return Math.round(cents) / 100;
}
