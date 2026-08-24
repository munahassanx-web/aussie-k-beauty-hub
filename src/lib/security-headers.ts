/**
 * Security response headers, applied centrally in src/server.ts.
 *
 * CSP origins below were audited against real resource usage in src/:
 *  - scripts:  TanStack Start inline hydration ('unsafe-inline'), Stripe.js
 *              (js.stripe.com, m.stripe.network), GA4 gtag (googletagmanager.com)
 *  - styles:   self + inline (Tailwind/React inline styles) + fonts.googleapis.com
 *  - fonts:    fonts.gstatic.com
 *  - images:   self, data:/blob: (uploads, canvas), storage.googleapis.com (CDN)
 *  - connect:  Supabase REST/realtime (https+wss), Stripe API, GA4 collection
 *  - frames:   Stripe embedded checkout + 3DS, Google Maps embed (contact page)
 *
 * 'unsafe-inline' for script-src is required by TanStack Start's SSR hydration
 * payloads; style 'unsafe-inline' is required for inline style attributes.
 *
 * frame-ancestors mirrors X-Frame-Options but also allows the Lovable
 * editor/preview embedding (*.lovable.app / *.lovable.dev); in CSP-aware
 * browsers frame-ancestors takes precedence over X-Frame-Options.
 */

const CSP_DIRECTIVES: [string, string][] = [
  ["default-src", "'self'"],
  [
    "script-src",
    "'self' 'unsafe-inline' https://js.stripe.com https://m.stripe.network https://www.googletagmanager.com",
  ],
  ["style-src", "'self' 'unsafe-inline' https://fonts.googleapis.com"],
  ["font-src", "'self' https://fonts.gstatic.com data:"],
  [
    "img-src",
    "'self' data: blob: https://storage.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com",
  ],
  [
    "connect-src",
    "'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://m.stripe.network https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  ],
  [
    "frame-src",
    "'self' https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com https://m.stripe.network https://www.google.com https://maps.google.com",
  ],
  [
    "frame-ancestors",
    "'self' https://lovable.app https://*.lovable.app https://lovable.dev https://*.lovable.dev",
  ],
  ["object-src", "'none'"],
  ["base-uri", "'self'"],
  ["form-action", "'self'"],
];

export const CONTENT_SECURITY_POLICY = CSP_DIRECTIVES.map(([k, v]) => `${k} ${v}`).join("; ");

/** Unused browser features this site never calls. */
export const PERMISSIONS_POLICY = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "interest-cohort=()",
  "usb=()",
  "bluetooth=()",
  "payment=(self https://checkout.stripe.com https://js.stripe.com)",
].join(", ");

/** Returns a copy of the response with security headers attached. */
export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  // Fallback for legacy browsers without CSP frame-ancestors support.
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Permissions-Policy", PERMISSIONS_POLICY);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
