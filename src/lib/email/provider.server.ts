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
 * Fallback provider. It never sends and never pretends to — it stays the
 * active provider only while managed email is unconfigured.
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

/** Verified sender subdomain delegated to Lovable's nameservers. */
const SENDER_DOMAIN = 'notify.skingrocer.com.au';
/** Cosmetic From: domain. */
const FROM_DOMAIN = 'skingrocer.com.au';
const FROM_NAME = 'Skin Grocer';

/**
 * Lovable managed email. Credentials are read from the server environment at
 * call time and never reach the browser.
 */
export const lovableEmailProvider: EmailProvider = {
  id: 'lovable',
  label: 'Lovable Email',
  isConfigured: () => Boolean(process.env['LOVABLE_API_KEY']),
  send: async (message) => {
    try {
      const { sendLovableEmail, EmailAPIError } = await import('@lovable.dev/email-js');
      try {
        await sendLovableEmail(
          {
            to: message.to,
            from: `${FROM_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject: message.subject,
            html: message.html,
            text: message.text,
            purpose: 'transactional',
            label: message.idempotencyKey.split(':')[0] ?? 'order',
            idempotency_key: message.idempotencyKey,
            reply_to: 'hello@skingrocer.com.au',
          },
          { apiKey: process.env['LOVABLE_API_KEY']!, sendUrl: process.env['LOVABLE_SEND_URL'] },
        );
      } catch (error) {
        if (error instanceof EmailAPIError && error.code === 'recipient_suppressed') {
          return { ok: false, provider: 'lovable', error: 'Recipient is suppressed (bounced, complained or unsubscribed)' };
        }
        throw error;
      }
      return { ok: true, provider: 'lovable', messageId: null };
    } catch (error) {
      return { ok: false, provider: 'lovable', error: (error as Error)?.message ?? 'Unknown send failure' };
    }
  },
};

export const EMAIL_PROVIDERS: EmailProvider[] = [lovableEmailProvider, notConfiguredProvider];

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

