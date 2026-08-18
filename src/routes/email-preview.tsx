/**
 * REVIEW-ONLY page for inspecting the approved Option 1 "Grocer Stripe"
 * order-confirmation email. Renders the real template (via
 * /api/public/email-preview) inside desktop and mobile frames.
 * Nothing is sent, stored or published from this page.
 */

import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/email-preview')({
  component: EmailPreviewPage,
  head: () => ({
    meta: [
      { title: 'Order Email Preview — Skin Grocer' },
      { name: 'description', content: 'Internal review of the Skin Grocer order-confirmation email template.' },
      { name: 'robots', content: 'noindex, nofollow' },
      { property: 'og:title', content: 'Order Email Preview — Skin Grocer' },
      { property: 'og:description', content: 'Internal review of the Skin Grocer order-confirmation email template.' },
      { property: 'og:type', content: 'website' },
    ],
  }),
});

const SRC = '/api/public/email-preview';

function EmailPreviewPage() {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Review only · no email sent</p>
            <h1 className="mt-2 truncate font-display text-2xl">Order Confirmation Email</h1>
          </div>
          <div className="flex shrink-0 gap-2">
            {(['desktop', 'mobile'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                className={`min-h-11 rounded-none border px-4 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  view === mode
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </header>

        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Synthetic TEST order data only. This renders the exact production template — pure white field, continuous
          navy/white Grocer Stripe frame, fine champagne-gold keyline, editorial masthead, product rows, VIEW YOUR ORDER
          CTA, benefits strip and navy footer.
        </p>

        <div className="mt-8 flex justify-center">
          <div
            className="overflow-hidden border border-border bg-white shadow-sm"
            style={{ width: view === 'mobile' ? 390 : '100%', maxWidth: view === 'mobile' ? 390 : 900 }}
          >
            <iframe
              key={view}
              title="Order confirmation email preview"
              src={SRC}
              className="block w-full"
              style={{ height: 2600, border: 0 }}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
          <a href={SRC} target="_blank" rel="noreferrer" className="underline underline-offset-4">
            Open the raw email HTML in a new tab
          </a>
        </p>
      </div>
    </main>
  );
}
