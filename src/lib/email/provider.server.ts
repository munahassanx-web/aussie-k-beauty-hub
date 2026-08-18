/**
 * Transactional email provider seam — server only.
 *
 * Skin Grocer has NO transactional email provider connected today. Stripe sends
 * its own payment receipt (if receipts are enabled in the Stripe dashboard);
 * Supabase Auth sends password/auth emails. Everything else — order
 * confirmation and dispatch notification — is prepared here but is NOT sent
 * until an approved provider is configured.
 *
 * Rules for any future adapter:
 *  - server-only (`.server.ts`), credentials read from process.env inside the
 *    call, never shipped to the browser
 *  - `isConfigured()` must be false unless real credentials exist; the app then
 *    records `not_configured` and shows the manual fallback instead of lying
 *  - failures return `{ ok: false, error }` — never throw into fulfilment
 *  - the recipient is always resolved from the stored order, never from client input
 */

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Stable key so a provider that supports it can de-duplicate retries. */
  idempotencyKey: string;
};

export type EmailSendResult =
  | { ok: true; provider: string; messageId: string | null }
  | { ok: false; provider: string; error: string };

export type EmailProvider = {
  id: string;
  label: string;
  isConfigured(): boolean;
  send(message: EmailMessage): Promise<EmailSendResult>;
};

/**
 * The only registered provider. It never sends and never pretends to: it
 * exists so checkout, the webhook and the admin UI have one code path that
 * already works the day a real provider is added.
 */
export const notConfiguredProvider: EmailProvider = {
  id: 'none',
  label: 'Not configured',
  isConfigured: () => false,
  send: async () => ({
    ok: false,
    provider: 'none',
    error:
      'No transactional email provider is connected. Connect a sender domain and provider, then re-send from the order.',
  }),
};

export const EMAIL_PROVIDERS: EmailProvider[] = [notConfiguredProvider];

/** The provider that would actually send right now, or null when none is configured. */
export function activeEmailProvider(): EmailProvider | null {
  return EMAIL_PROVIDERS.find((p) => p.id !== 'none' && p.isConfigured()) ?? null;
}

export function emailCapability() {
  const active = activeEmailProvider();
  return {
    configured: Boolean(active),
    providerId: active?.id ?? 'none',
    providerLabel: active?.label ?? 'Not configured',
  };
}
