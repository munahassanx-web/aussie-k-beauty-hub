/**
 * First-party ecommerce analytics layer, aligned with Google's recommended
 * GA4 ecommerce events.
 *
 * Transport is configuration-driven and single-path, so events can never be
 * double-counted:
 *
 *   - If `VITE_GA4_MEASUREMENT_ID` (or the Google Analytics connector variable
 *     `VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY`) is set AND the page is
 *     served from the production domain, gtag.js is loaded once and every event
 *     is sent with `gtag('event', ...)`. Nothing is pushed to `dataLayer`
 *     directly — gtag owns that queue.
 *   - Otherwise (no ID configured, or preview/dev/local host) events are kept in
 *     an in-memory debug buffer only, so testing can never pollute production
 *     reporting.
 *
 * GTM is deliberately NOT installed alongside gtag.
 *
 * Privacy rules enforced here:
 * - never accept or forward name, email, address, phone, or QR tokens
 * - order identifiers are non-PII (internal order id only)
 * - loyalty is expressed as a tier string only, never a member identity
 */

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
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
  | 'sign_up';

type Payload = Record<string, unknown>;

/** Keys that must never be sent, whatever a call site passes. */
const BLOCKED = /^(email|name|first_?name|last_?name|phone|address|postcode|token|customer|user_id)$/i;

declare global {
  interface Window {
    dataLayer?: Payload[];
    gtag?: (...args: unknown[]) => void;
    __sgAnalyticsDebug?: Payload[];
  }
}

/** GA4 Measurement ID, supplied by configuration only — never hard-coded. */
export function measurementId(): string | null {
  const env = import.meta.env as Record<string, string | undefined>;
  const id = env['VITE_GA4_MEASUREMENT_ID'] || env['VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY'];
  return id && /^G-[A-Z0-9]+$/i.test(id.trim()) ? id.trim() : null;
}

/**
 * Production measurement is opt-in: only the live domain may feed a real
 * provider, so preview/dev traffic can never contaminate production reporting.
 */
export function isProductionMeasurement(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'skingrocer.com.au' || window.location.hostname === 'www.skingrocer.com.au';
}

let initialised = false;

/** Loads gtag.js exactly once, and only when configured for production. */
export function initAnalytics(): void {
  if (initialised) return;
  initialised = true;
  if (typeof window === 'undefined') return;
  const id = measurementId();
  if (!id || !isProductionMeasurement()) return;
  if (window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args as unknown as Payload);
  };
  window.gtag = gtag;
  gtag('js', new Date());
  // No ad personalisation signals, no PII, IP anonymisation is GA4 default.
  gtag('config', id, { send_page_view: true, allow_google_signals: false });
}

/** Send a GA4 page_view on client-side route changes. */
export function trackPageView(path: string): void {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', 'page_view', { page_path: path, page_location: window.location.href });
    return;
  }
  bufferOnly({ event: 'page_view', page_path: path });
}

function bufferOnly(entry: Payload): void {
  window.__sgAnalyticsDebug = window.__sgAnalyticsDebug ?? [];
  window.__sgAnalyticsDebug.push(entry);
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
    const clean = scrub(payload);
    if (window.gtag) {
      window.gtag('event', event, clean);
    } else {
      // Preview/dev or unconfigured: keep a local buffer for QA only.
      bufferOnly({ event, ...clean });
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

/**
 * UI interaction events (hero carousel, navigation affordances). Kept separate
 * from the GA4 ecommerce union so merchandising events stay strictly typed,
 * while still passing through the same PII scrubbing and transport rules.
 */
export function trackUi(event: string, payload: Payload = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = scrub(payload);
    if (window.gtag) {
      window.gtag('event', event, clean);
    } else {
      bufferOnly({ event, ...clean });
    }
  } catch {
    /* best effort only */
  }
}
