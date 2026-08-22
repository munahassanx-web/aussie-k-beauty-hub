import { useState } from 'react';
import type { AdminOrderDetail } from '@/lib/admin-orders.functions';
import { orderReference } from '@/lib/order-reference';
import { DISPATCH_SENDER, MYPOST_BUSINESS_URL } from '@/lib/shipping/sender';

/**
 * Australia Post — MyPost Business preparation panel (staff only).
 *
 * Launch fulfilment is manual: staff create the shipment in MyPost Business
 * and paste the consignment/tracking number back into the order. This panel
 * presents everything MyPost Business asks for, in roughly the same order, so
 * staff copy instead of retype. It is strictly read-only — copy buttons never
 * mutate the order, and nothing here talks to Australia Post.
 */

function money(cents: number, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format((cents ?? 0) / 100);
}

type CopyState = 'idle' | 'copied' | 'failed';

/** One-click copy with accessible success/failure feedback. Never mutates anything. */
function CopyButton({ value, label, className = '' }: { value: string; label: string; className?: string }) {
  const [state, setState] = useState<CopyState>('idle');
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard
            .writeText(value)
            .then(() => setState('copied'))
            .catch(() => setState('failed'))
            .finally(() => window.setTimeout(() => setState('idle'), 2000));
        }}
        className="min-h-9 rounded-full border border-border px-3 text-xs text-muted-foreground hover:border-foreground hover:text-foreground"
      >
        {label}
      </button>
      <span aria-live="polite" className={`text-xs ${state === 'failed' ? 'text-destructive' : 'text-muted-foreground'}`}>
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed — select and copy manually' : ''}
      </span>
    </span>
  );
}

/** Label + value row. Null/empty values are shown honestly, never guessed. */
function Field({ label, value, missing, copyValue }: { label: string; value: string | null; missing?: string; copyValue?: string }) {
  const shown = value?.trim() ? value.trim() : null;
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        {shown ? (
          <p className="mt-0.5 break-words text-sm text-foreground">{shown}</p>
        ) : (
          <p className="mt-0.5 text-sm italic text-muted-foreground">{missing ?? 'Not stored on this order'}</p>
        )}
      </div>
      {shown && <CopyButton value={copyValue ?? shown} label="Copy" />}
    </div>
  );
}

function SubHeading({ children }: { children: string }) {
  return <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{children}</p>;
}

export function MyPostPrepPanel({ order }: { order: AdminOrderDetail }) {
  const reference = orderReference(order.id);

  // ---- SEND FROM — only what is genuinely configured; the rest is flagged.
  const sender = DISPATCH_SENDER;
  const senderBlock = [sender.businessName, sender.streetAddress, sender.cityLabel, sender.email, sender.phone]
    .filter(Boolean)
    .join('\n');

  // ---- DELIVER TO — authoritative order shipping fields only.
  const toName = order.shippingName ?? order.customerName;
  const cityLine = [order.shippingCity, order.shippingState, order.shippingPostcode].filter(Boolean).join(' ');
  const addressLines = [toName, order.shippingLine1, order.shippingLine2, cityLine, order.shippingCountry].filter(
    (v): v is string => Boolean(v && v.trim()),
  );
  const addressBlock = addressLines.join('\n');
  const contactBlock = [toName, order.customerEmail, order.shippingPhone].filter(Boolean).join('\n');

  // ---- PARCEL SERVICE — the stored entitlement decides the service family.
  const service = order.shippingService?.trim() || null;
  const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);
  const serviceGuidance =
    service === 'Express Post'
      ? {
          title: 'Express Post — Circle complimentary express',
          note: 'This order is entitled to Express Post. Choose an Express Post service in MyPost Business — do not downgrade it.',
        }
      : service === 'Parcel Post'
        ? {
            title: 'Parcel Post — standard delivery',
            note: 'Standard order. Choose a Parcel Post (standard) service in MyPost Business.',
          }
        : {
            title: 'No service recorded on this order',
            note: `Check what the customer was charged (${money(order.shippingCents, order.currency)} shipping) before choosing a service.`,
          };

  return (
    <section
      id="ops-mypost"
      aria-labelledby="ops-mypost-heading"
      className="mt-4 scroll-mt-24 rounded-2xl border border-border bg-secondary/40 p-4 sm:p-6 print:hidden"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="ops-mypost-heading" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Australia Post — MyPost Business
        </h2>
        <a
          href={MYPOST_BUSINESS_URL}
          target="_blank"
          rel="noreferrer"
          className="min-h-9 inline-flex items-center rounded-full border border-border px-4 text-xs text-foreground hover:border-foreground"
        >
          Open MyPost Business ↗
        </a>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Label preparation — copy what MyPost Business asks for instead of retyping it. Nothing here creates a
        shipment, changes this order, or contacts Australia Post.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* 1) SEND FROM */}
        <div className="rounded-xl border border-border bg-background p-4">
          <SubHeading>1 · Send from</SubHeading>
          <div className="mt-1 divide-y divide-border/60">
            <Field label="Business / sender name" value={sender.businessName} />
            <Field label="Street address" value={sender.streetAddress} missing="Owner setup required" />
            <Field label="Suburb / city" value={sender.cityLabel} />
            <Field label="Email" value={sender.email} />
            <Field label="Phone" value={sender.phone} missing="Owner setup required" />
          </div>
          <div className="mt-2 border-t border-border/60 pt-2">
            <CopyButton value={senderBlock} label="Copy sender block" />
          </div>
        </div>

        {/* 2) DELIVER TO */}
        <div className="rounded-xl border border-border bg-background p-4">
          <SubHeading>2 · Deliver to</SubHeading>
          <div className="mt-1 divide-y divide-border/60">
            <Field label="Contact name" value={toName} />
            <Field label="Address" value={addressLines.slice(1).join(', ')} />
            <Field label="Email" value={order.customerEmail} />
            <Field label="Phone" value={order.shippingPhone} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Residential or business address? The order does not record it and no business name is stored — select it
            yourself in MyPost Business.
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 pt-2">
            {addressLines.length > 1 && <CopyButton value={addressBlock} label="Copy address" />}
            <CopyButton value={contactBlock} label="Copy contact details" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* 3) YOUR REFERENCE */}
        <div className="rounded-xl border border-border bg-background p-4">
          <SubHeading>3 · Your reference</SubHeading>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="font-mono text-2xl tracking-wide text-foreground">{reference}</p>
            <CopyButton value={reference} label="Copy reference" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Paste this into MyPost Business so the shipment matches the customer&apos;s emails and tracking page.
          </p>
        </div>

        {/* 4) DECLARATION */}
        <div className="rounded-xl border border-border bg-background p-4">
          <SubHeading>4 · Declaration</SubHeading>
          <p className="mt-2 text-sm text-foreground">
            Answer every declaration question yourself, based on the actual parcel and current Australia Post rules.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Dangerous goods and medicinal cannabis / S8 questions have no default answer here — Skin Grocer never
            pre-answers them for you.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* 5) PARCEL DETAILS */}
        <div className="rounded-xl border border-border bg-background p-4">
          <SubHeading>5 · Parcel details</SubHeading>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            <li>Packaging: your own satchel or box — select the matching option in MyPost Business.</li>
            <li>
              Weight (kg) and length × width × height (cm): weigh and measure the <strong className="text-foreground">final packed parcel</strong> —
              products, QR authenticity card, packing slip and padding included.
            </li>
            <li>
              Contents ({itemCount} {itemCount === 1 ? 'item' : 'items'} on the pick list): a starting suggestion is
              <span className="mx-1 font-mono text-xs text-foreground">Skincare products</span>
              <CopyButton value="Skincare products" label="Copy" /> — edit it to describe the parcel accurately; it is
              a suggestion, not a declaration.
            </li>
          </ul>
        </div>

        {/* 6) PARCEL SERVICE */}
        <div className="rounded-xl border border-border bg-background p-4">
          <SubHeading>6 · Parcel service</SubHeading>
          <p className="mt-2 text-sm font-medium text-foreground">{serviceGuidance.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{serviceGuidance.note}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Services and prices only appear in MyPost Business after sender, recipient and parcel details are
            complete. Customer paid {money(order.shippingCents, order.currency)} shipping on this order.
          </p>
        </div>
      </div>

      {/* 7) WORKFLOW */}
      <div className="mt-4 rounded-xl border border-border bg-background p-4">
        <SubHeading>7 · Workflow</SubHeading>
        <ol className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {[
            'Pick',
            'Authenticity checks',
            'QR card',
            'Pack',
            'MyPost Business: create shipment',
            'Pay & print label',
            'Save carrier, service, tracking & postage below',
            'Lodge / hand over the parcel',
            'Mark Dispatched',
          ].map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-border">→</span>}
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-muted-foreground">
          Buying a label is <strong className="text-foreground">not</strong> dispatch — the order is dispatched only
          when the parcel has been lodged or handed over and you mark it Dispatched below.
        </p>
      </div>
    </section>
  );
}
