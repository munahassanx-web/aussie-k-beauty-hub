/**
 * Skin Grocer transactional email templates — server only.
 *
 * Every value rendered here comes from a stored order row. Nothing is
 * estimated, promised or invented: no delivery dates, no stock claims, no
 * authentication claims beyond the factual "sourced from Korea, stocked in
 * Melbourne" wording already used on site.
 */

import { trackingLink, trackingLinkLabel } from '@/lib/shipping/carriers';

export const SITE_URL = 'https://skingrocer.com.au';
export const SUPPORT_EMAIL = 'hello@skingrocer.com.au';

const NAVY = '#1C2637';
const CREAM = '#F6F1E7';
const INK = '#1C1B18';
const MUTED = '#6B655B';
const RULE = '#E0D9CB';

export type OrderEmailLine = { name: string; quantity: number; amountCents: number };

export type OrderEmailData = {
  id: string;
  createdAt: string;
  currency: string;
  amountCents: number;
  shippingCents: number;
  discountCents: number;
  lines: OrderEmailLine[];
  shippingName: string | null;
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostcode: string | null;
  shippingCountry: string | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  shippingCarrier: string | null;
};

export function orderReference(id: string): string {
  return `SG-${id.slice(0, 8).toUpperCase()}`;
}

export function money(cents: number, currency = 'AUD'): string {
  return `${currency.toUpperCase()} $${(cents / 100).toFixed(2)}`;
}

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addressLines(o: OrderEmailData): string[] {
  return [
    o.shippingName,
    o.shippingLine1,
    o.shippingLine2,
    [o.shippingCity, o.shippingState, o.shippingPostcode].filter(Boolean).join(' '),
    o.shippingCountry,
  ].filter((v): v is string => Boolean(v && v.trim()));
}

function shell(title: string, body: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${esc(
    title,
  )}</title></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Georgia,'Times New Roman',serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="background-color:${NAVY};padding:28px 24px;text-align:center;">
          <p style="margin:0;font-size:18px;letter-spacing:.22em;text-transform:uppercase;color:${CREAM};">Skin Grocer</p>
          <p style="margin:8px 0 0;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#BFAE9B;">Seoul Sourced. Skin Assured.</p>
        </td></tr>
        <tr><td style="padding:28px 24px;font-family:Arial,Helvetica,sans-serif;">${body}</td></tr>
        <tr><td style="padding:20px 24px;border-top:1px solid ${RULE};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:${MUTED};">
          <p style="margin:0;">Questions about this order? Reply to this email or write to
            <a href="mailto:${SUPPORT_EMAIL}" style="color:${NAVY};">${SUPPORT_EMAIL}</a>.</p>
          <p style="margin:8px 0 0;">Skin Grocer · Dispatched from Melbourne, Australia · <a href="${SITE_URL}" style="color:${NAVY};">skingrocer.com.au</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function itemsTable(o: OrderEmailData): string {
  const rows = o.lines
    .map(
      (l) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid ${RULE};font-size:14px;color:${INK};">${esc(l.name)}<span style="color:${MUTED};"> × ${l.quantity}</span></td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid ${RULE};font-size:14px;color:${INK};white-space:nowrap;">${money(
          l.amountCents,
          o.currency,
        )}</td>
      </tr>`,
    )
    .join('');

  const totals = [
    o.discountCents > 0 ? ['Discount', `− ${money(o.discountCents, o.currency)}`] : null,
    ['Shipping', o.shippingCents > 0 ? money(o.shippingCents, o.currency) : 'Free'],
    ['Total paid', money(o.amountCents, o.currency)],
  ].filter(Boolean) as Array<[string, string]>;

  const totalRows = totals
    .map(
      ([label, value], i) =>
        `<tr><td style="padding:6px 0;font-size:${i === totals.length - 1 ? '15px' : '13px'};color:${
          i === totals.length - 1 ? INK : MUTED
        };">${esc(label)}</td><td align="right" style="padding:6px 0;font-size:${
          i === totals.length - 1 ? '15px' : '13px'
        };color:${i === totals.length - 1 ? INK : MUTED};">${esc(value)}</td></tr>`,
    )
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}${totalRows}</table>`;
}

export function renderOrderConfirmation(o: OrderEmailData): { subject: string; html: string; text: string } {
  const ref = orderReference(o.id);
  const placed = new Date(o.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const address = addressLines(o);

  const html = shell(
    `Order ${ref} confirmed`,
    `
    <h1 style="margin:0 0 6px;font-size:22px;color:${INK};">Your order is confirmed</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:${MUTED};">
      Thanks — payment for <strong style="color:${INK};">${ref}</strong> was received on ${esc(placed)}.
      We pack and dispatch from Melbourne, and you will get a second email with carrier and tracking details the moment your parcel leaves us.
    </p>
    ${itemsTable(o)}
    ${
      address.length
        ? `<p style="margin:22px 0 0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${MUTED};">Shipping to</p>
           <p style="margin:6px 0 0;font-size:14px;line-height:1.6;color:${INK};">${address.map(esc).join('<br />')}</p>`
        : ''
    }
    ${
      o.shippingMethod
        ? `<p style="margin:10px 0 0;font-size:13px;color:${MUTED};">Method: ${esc(o.shippingMethod)}</p>`
        : ''
    }
    <p style="margin:22px 0 0;font-size:14px;line-height:1.7;color:${MUTED};">
      Every product we stock has a step-by-step How to Apply guide. Scan the QR code on the card in your parcel, or open the guide for any product at
      <a href="${SITE_URL}/shop" style="color:${NAVY};">skingrocer.com.au</a>.
    </p>
    <p style="margin:22px 0 0;"><a href="${SITE_URL}/track" style="display:inline-block;background:${NAVY};color:${CREAM};text-decoration:none;padding:12px 22px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;">Check order status</a></p>
  `,
  );

  const text = [
    `SKIN GROCER — order ${ref} confirmed`,
    `Payment received ${placed}.`,
    '',
    ...o.lines.map((l) => `- ${l.name} x${l.quantity} — ${money(l.amountCents, o.currency)}`),
    o.discountCents > 0 ? `Discount: -${money(o.discountCents, o.currency)}` : null,
    `Shipping: ${o.shippingCents > 0 ? money(o.shippingCents, o.currency) : 'Free'}`,
    `Total paid: ${money(o.amountCents, o.currency)}`,
    '',
    address.length ? `Shipping to:\n${address.join('\n')}` : null,
    '',
    'We pack and dispatch from Melbourne. You will receive carrier and tracking details when your parcel leaves us.',
    `Order status: ${SITE_URL}/track`,
    `Questions: ${SUPPORT_EMAIL}`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  return { subject: `Your Skin Grocer order ${ref} is confirmed`, html, text };
}

export function renderDispatchNotice(o: OrderEmailData): { subject: string; html: string; text: string } {
  const ref = orderReference(o.id);
  const carrier = o.shippingCarrier?.trim() || null;
  const tracking = o.trackingNumber?.trim() || null;
  const link = trackingLink(carrier, tracking);
  const address = addressLines(o);

  const trackingBlock = tracking
    ? `<p style="margin:20px 0 0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${MUTED};">Tracking</p>
       <p style="margin:6px 0 0;font-size:15px;color:${INK};">${esc(carrier ?? 'Carrier')} — ${esc(tracking)}</p>
       ${
         link
           ? `<p style="margin:14px 0 0;"><a href="${link}" style="display:inline-block;background:${NAVY};color:${CREAM};text-decoration:none;padding:12px 22px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;">${esc(
               trackingLinkLabel(carrier),
             )}</a></p>`
           : ''
       }`
    : `<p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:${MUTED};">This parcel was hand-dispatched without a carrier tracking number. Reply to this email if you would like an update.</p>`;

  const html = shell(
    `Order ${ref} dispatched`,
    `
    <h1 style="margin:0 0 6px;font-size:22px;color:${INK};">Your order is on its way</h1>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.7;color:${MUTED};">
      Order <strong style="color:${INK};">${ref}</strong> left our Melbourne warehouse.
      Delivery timing is set by the carrier — the tracking page below is the live source of truth.
    </p>
    ${trackingBlock}
    <p style="margin:24px 0 0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${MUTED};">In this parcel</p>
    <p style="margin:6px 0 0;font-size:14px;line-height:1.7;color:${INK};">${o.lines
      .map((l) => `${esc(l.name)} × ${l.quantity}`)
      .join('<br />')}</p>
    ${
      address.length
        ? `<p style="margin:20px 0 0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${MUTED};">Delivering to</p>
           <p style="margin:6px 0 0;font-size:14px;line-height:1.6;color:${INK};">${address.map(esc).join('<br />')}</p>`
        : ''
    }
  `,
  );

  const text = [
    `SKIN GROCER — order ${ref} dispatched`,
    'Your parcel has left our Melbourne warehouse.',
    tracking ? `${carrier ?? 'Carrier'} tracking: ${tracking}` : 'Hand-dispatched — no carrier tracking number.',
    link ? `Track it: ${link}` : null,
    '',
    ...o.lines.map((l) => `- ${l.name} x${l.quantity}`),
    '',
    `Order status: ${SITE_URL}/track`,
    `Questions: ${SUPPORT_EMAIL}`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  return { subject: `Your Skin Grocer order ${ref} has been dispatched`, html, text };
}

/** Short, copy-pasteable dispatch message for the manual fallback in the admin UI. */
export function dispatchMessagePlainText(o: OrderEmailData): string {
  const ref = orderReference(o.id);
  const carrier = o.shippingCarrier?.trim() || null;
  const tracking = o.trackingNumber?.trim() || null;
  const link = trackingLink(carrier, tracking);
  return [
    `Hi${o.shippingName ? ` ${o.shippingName.split(' ')[0]}` : ''},`,
    '',
    `Your Skin Grocer order ${ref} has been dispatched from Melbourne.`,
    tracking ? `${carrier ?? 'Carrier'} tracking number: ${tracking}` : 'It was hand-dispatched, so there is no carrier tracking number.',
    link ? `Track it here: ${link}` : null,
    '',
    'Delivery timing is set by the carrier. Reply to this email if anything looks wrong.',
    '',
    'Skin Grocer — Seoul Sourced. Skin Assured.',
    SUPPORT_EMAIL,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');
}
