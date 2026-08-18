/**
 * Skin Grocer transactional email design system — V3, server only.
 *
 * Signature device: THE SKIN GROCER SEAL — an irregular, hand-cut rose-gold
 * roundel (produce sticker / crate stamp / inspection mark) carrying circular
 * wording SEOUL SOURCED · SKIN ASSURED around an SG monogram. It appears once
 * as a hero stamp, once quietly in the footer, and is adapted into a
 * DISPATCHED provenance stamp on the dispatch notice.
 *
 * Framing: deep navy masthead and navy closing band, cream editorial paper,
 * white only where product rows need clarity, rose gold reserved for the mark.
 *
 * Every value rendered here comes from a stored order row, or from the static
 * catalog looked up by the line's Stripe `lookupKey`. Nothing is estimated,
 * promised or invented: no delivery dates, no stock claims, no payment details
 * we do not hold.
 */

import { trackingLink, trackingLinkLabel } from '@/lib/shipping/carriers';
import { SHOP_PRODUCTS } from '@/lib/shop-catalog';

export const SITE_URL = 'https://skingrocer.com.au';
export const SUPPORT_EMAIL = 'hello@skingrocer.com.au';

/* Brand palette — approved values only. */
const NAVY = '#0D1B2A';
const CREAM = '#F7F4EE';
const ROSE = '#CFA28B';
const INK = '#16202B';
const MUTED = '#6E6A63';
const RULE = '#E3DDD2';
const PAPER = '#FFFFFF';

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/* The seal, served from stable public paths so email clients can always fetch it. */
const SEAL_NAVY = `${SITE_URL}/email/sg-seal-navy.png`;
const SEAL_PAPER = `${SITE_URL}/email/sg-seal-paper.png`;
const STAMP_DISPATCHED = `${SITE_URL}/email/sg-stamp-dispatched.png`;
const SEAL_ALT = 'Skin Grocer seal — Seoul Sourced. Skin Assured.';

export type OrderEmailLine = {
  name: string;
  quantity: number;
  amountCents: number;
  lookupKey?: string | null;
};

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

/**
 * First name for the greeting, taken only from the stored shipping name.
 * Returns null whenever we do not genuinely hold one — never invented.
 */
function firstNameOf(o: OrderEmailData): string | null {
  const raw = o.shippingName?.trim();
  if (!raw) return null;
  const first = raw.split(/\s+/)[0]?.replace(/[^\p{L}\p{M}'’-]/gu, '');
  if (!first || first.length < 2) return null;
  return first.charAt(0).toUpperCase() + first.slice(1);
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

/** Catalog lookup for brand + photography. Never guesses by display name. */
function catalogFor(line: OrderEmailLine) {
  if (!line.lookupKey) return null;
  return SHOP_PRODUCTS.find((p) => p.priceId === line.lookupKey) ?? null;
}

/* ---------------------------------------------------------------- shell -- */

const label = (t: string) =>
  `<p style="margin:0 0 10px;font-family:${SANS};font-size:10px;line-height:1.4;letter-spacing:.24em;text-transform:uppercase;color:${MUTED};">${esc(
    t,
  )}</p>`;

const gap = (h: number) => `<div style="height:${h}px;line-height:${h}px;font-size:0;" class="sg-gap">&nbsp;</div>`;

const hairline = (color = RULE) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;line-height:1px;font-size:0;background-color:${color};">&nbsp;</td></tr></table>`;

function ctaButton(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td bgcolor="${NAVY}" style="background-color:${NAVY};border-radius:2px;">
      <a href="${href}" style="display:inline-block;padding:18px 36px;font-family:${SANS};font-size:12px;line-height:1;letter-spacing:.22em;text-transform:uppercase;color:${CREAM};text-decoration:none;font-weight:bold;">${esc(
        text,
      )}</a>
    </td></tr></table>`;
}

/** The seal, sized for its placement. */
function sealImage(src: string, px: number, alt = SEAL_ALT): string {
  return `<img src="${src}" width="${px}" height="${px}" alt="${esc(
    alt,
  )}" style="display:block;width:${px}px;height:${px}px;border:0;outline:none;" />`;
}

/**
 * Full document shell.
 *   navy masthead  →  seal band  →  cream/white editorial body  →  navy close
 */
function shell(title: string, preheader: string, body: string, sealSrc = SEAL_PAPER): string {
  return `<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${esc(title)}</title>
<style>
  :root { color-scheme: light only; supported-color-schemes: light only; }
  body,table,td,a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { color:${NAVY}; }
  @media only screen and (max-width:620px) {
    .sg-pad { padding-left:24px !important; padding-right:24px !important; }
    .sg-gap { height:30px !important; }
    .sg-stack { display:block !important; width:100% !important; max-width:100% !important; padding-left:0 !important; padding-right:0 !important; padding-bottom:22px !important; }
    .sg-meta { padding:18px 24px !important; }
    .sg-thumb { width:64px !important; }
    .sg-wordmark { font-size:30px !important; letter-spacing:.14em !important; }
    .sg-display { font-size:28px !important; }
    .sg-seal img { width:76px !important; height:76px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(
    preheader,
  )}&#8203;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CREAM}" style="background-color:${CREAM};">
    <tr><td align="center" style="padding:32px 12px 44px;">
      <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;">

        <!-- masthead: the frame. Recognisable with the wordmark covered. -->
        <tr><td bgcolor="${NAVY}" align="center" class="sg-pad" style="background-color:${NAVY};padding:52px 40px 46px;">
          <p class="sg-wordmark" style="margin:0;font-family:${SERIF};font-size:40px;line-height:1.05;letter-spacing:.16em;text-transform:uppercase;color:${CREAM};font-weight:normal;">Skin&nbsp;Grocer</p>
          <p style="margin:18px 0 0;font-family:${SANS};font-size:9px;line-height:1.4;letter-spacing:.30em;text-transform:uppercase;color:#8A94A2;">Seoul Sourced. Skin Assured.</p>
        </td></tr>

        <!-- seal band: the stamp sits on the paper, like a sticker applied by hand -->
        <tr><td bgcolor="${PAPER}" class="sg-pad sg-seal" style="background-color:${PAPER};padding:30px 48px 0;">
          ${sealImage(sealSrc, 92)}
        </td></tr>

        <!-- content -->
        <tr><td bgcolor="${PAPER}" class="sg-pad" style="background-color:${PAPER};padding:0 48px;">
          ${body}
        </td></tr>

        <!-- customer care -->
        <tr><td bgcolor="${PAPER}" class="sg-pad" style="background-color:${PAPER};padding:0 48px 46px;">
          ${hairline()}
          ${gap(26)}
          ${label('Customer care')}
          <p style="margin:0 0 6px;font-family:${SANS};font-size:14px;line-height:1.75;color:${MUTED};">
            Reply to this email, or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:${NAVY};text-decoration:underline;">${SUPPORT_EMAIL}</a>.
          </p>
          <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.75;color:${MUTED};">
            <a href="${SITE_URL}" style="color:${NAVY};text-decoration:underline;">skingrocer.com.au</a>
          </p>
        </td></tr>

        <!-- navy close: the bottom half of the frame, with a quiet echo of the seal -->
        <tr><td bgcolor="${NAVY}" align="center" class="sg-pad" style="background-color:${NAVY};padding:36px 40px 34px;">
          <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px;"><tr><td>
            <img src="${SEAL_NAVY}" width="44" height="44" alt="" style="display:block;width:44px;height:44px;border:0;outline:none;" />
          </td></tr></table>
          <p style="margin:0;font-family:${SANS};font-size:11px;line-height:1.75;color:#8A94A2;">Skin Grocer · Dispatched from Melbourne, Australia</p>
          <p style="margin:6px 0 0;font-family:${SANS};font-size:11px;line-height:1.75;color:#6C7686;">You are receiving this message because you placed an order with Skin Grocer.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* -------------------------------------------------------------- pieces -- */

/** Small stamp-like brand thought above the headline. */
function stampLine(text: string): string {
  return `<p style="margin:0 0 14px;font-family:${SERIF};font-size:13px;line-height:1.4;letter-spacing:.06em;color:${ROSE};font-style:italic;">${esc(
    text,
  )}</p>`;
}

/** Editorial hero: quiet stamp thought, commanding headline, factual standfirst. */
function heroSection(stamp: string, headline: string, subhead: string | null, standfirst: string): string {
  return `${gap(26)}
  ${stampLine(stamp)}
  <h1 class="sg-display" style="margin:0;font-family:${SERIF};font-size:36px;line-height:1.16;letter-spacing:-0.015em;font-weight:normal;color:${INK};">${esc(
    headline,
  )}</h1>
  ${
    subhead
      ? `<p class="sg-display" style="margin:4px 0 0;font-family:${SERIF};font-size:36px;line-height:1.16;letter-spacing:-0.015em;color:${MUTED};">${esc(
          subhead,
        )}</p>`
      : ''
  }
  <div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>
  <p style="margin:0;font-family:${SANS};font-size:16px;line-height:1.8;color:${MUTED};">${standfirst}</p>
  ${gap(38)}`;
}

/** Order reference / date / status strip on a cream field. */
function metaStrip(o: OrderEmailData, status: string): string {
  const placed = new Date(o.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const cell = (t: string, v: string, last = false) =>
    `<td class="sg-stack sg-meta" width="33.33%" valign="top" style="padding:22px ${last ? '24px' : '12px'} 22px 24px;">
      <p style="margin:0 0 6px;font-family:${SANS};font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:${MUTED};">${esc(t)}</p>
      <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.5;color:${INK};">${esc(v)}</p>
    </td>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CREAM}" style="background-color:${CREAM};">
    <tr>${cell('Order', orderReference(o.id))}${cell('Placed', placed)}${cell('Status', status, true)}</tr>
  </table>
  ${gap(42)}`;
}

/** Product row: catalog photography when known, designed neutral tile otherwise. */
function productRow(line: OrderEmailLine, currency: string, showPrice: boolean): string {
  const product = catalogFor(line);
  const brand = product?.brand ?? null;
  const thumb = product
    ? `<img src="${SITE_URL}${product.image}" width="72" height="72" alt="${esc(
        `${product.brand} ${product.name}`,
      )}" style="display:block;width:72px;height:72px;object-fit:cover;background-color:${CREAM};" />`
    : `<table role="presentation" width="72" height="72" cellpadding="0" cellspacing="0" border="0" bgcolor="${CREAM}" style="background-color:${CREAM};width:72px;height:72px;"><tr>
         <td align="center" valign="middle" style="font-family:${SERIF};font-size:12px;letter-spacing:.20em;color:${ROSE};">SG</td></tr></table>`;

  return `<tr>
    <td class="sg-thumb" width="72" valign="top" style="padding:20px 0;width:72px;">${thumb}</td>
    <td valign="top" style="padding:20px 0 20px 20px;">
      ${
        brand
          ? `<p style="margin:0 0 4px;font-family:${SANS};font-size:10px;letter-spacing:.20em;text-transform:uppercase;color:${MUTED};">${esc(
              brand,
            )}</p>`
          : ''
      }
      <p style="margin:0 0 6px;font-family:${SERIF};font-size:16px;line-height:1.45;color:${INK};">${esc(line.name)}</p>
      <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.5;color:${MUTED};">Quantity ${line.quantity}</p>
    </td>
    ${
      showPrice
        ? `<td valign="top" align="right" style="padding:20px 0 20px 16px;font-family:${SANS};font-size:15px;color:${INK};white-space:nowrap;">${money(
            line.amountCents,
            currency,
          )}</td>`
        : ''
    }
  </tr>
  <tr><td colspan="${showPrice ? 3 : 2}" style="height:1px;line-height:1px;font-size:0;background-color:${RULE};">&nbsp;</td></tr>`;
}

function itemsTable(o: OrderEmailData, showPrice: boolean): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td colspan="${showPrice ? 3 : 2}" style="height:1px;line-height:1px;font-size:0;background-color:${RULE};">&nbsp;</td></tr>
    ${o.lines.map((l) => productRow(l, o.currency, showPrice)).join('')}
  </table>`;
}

/** Totals — only rows we actually hold data for. Subtotal is derived from lines. */
function totalsTable(o: OrderEmailData): string {
  const lineSum = o.lines.reduce((s, l) => s + l.amountCents, 0);
  const rows: Array<[string, string, boolean]> = [];
  if (lineSum > 0) rows.push(['Subtotal', money(lineSum, o.currency), false]);
  if (o.discountCents > 0) rows.push(['Discount', `− ${money(o.discountCents, o.currency)}`, false]);
  rows.push(['Shipping', o.shippingCents > 0 ? money(o.shippingCents, o.currency) : 'Complimentary', false]);
  rows.push(['Total paid', money(o.amountCents, o.currency), true]);

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${rows
      .map(
        ([k, v, strong]) => `<tr>
      <td style="padding:${strong ? '16px 0 0' : '10px 0 0'};font-family:${
        strong ? SERIF : SANS
      };font-size:${strong ? '17px' : '14px'};color:${strong ? INK : MUTED};${
        strong ? `border-top:1px solid ${RULE};` : ''
      }">${esc(k)}</td>
      <td align="right" style="padding:${strong ? '16px 0 0' : '10px 0 0'};font-family:${
        strong ? SERIF : SANS
      };font-size:${strong ? '17px' : '14px'};color:${strong ? INK : MUTED};${
        strong ? `border-top:1px solid ${RULE};` : ''
      }">${esc(v)}</td>
    </tr>`,
      )
      .join('')}
  </table>`;
}

/** Two-column desktop / stacked mobile detail block. */
function twoColumn(leftLabel: string, leftBody: string, rightLabel: string | null, rightBody: string | null): string {
  const col = (l: string, b: string, pad: string) =>
    `<td class="sg-stack" width="50%" valign="top" style="padding:${pad};">${label(l)}
      <div style="font-family:${SANS};font-size:14px;line-height:1.75;color:${INK};">${b}</div></td>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    ${col(leftLabel, leftBody, '0 20px 0 0')}
    ${rightLabel && rightBody ? col(rightLabel, rightBody, '0 0 0 20px') : ''}
  </tr></table>`;
}

/** Three-stage progress. Only "confirmed" is ever stated as complete here. */
function whatHappensNext(current: 'confirmed' | 'dispatched'): string {
  const stages: Array<[string, string]> = [
    ['Confirmed', 'Payment received and your order is logged with our Melbourne team.'],
    ['Selected and packed', 'Each item is hand-checked against your order before it is wrapped.'],
    ['Dispatched', 'We email carrier and tracking details the moment your parcel leaves us.'],
  ];
  const doneCount = current === 'dispatched' ? 3 : 1;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${stages
      .map(([t, d], i) => {
        const done = i < doneCount;
        return `<tr>
        <td width="34" valign="top" style="padding:0 0 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="9" height="9" style="width:9px;height:9px;line-height:9px;font-size:0;background-color:${
            done ? NAVY : ROSE
          };border-radius:9px;">&nbsp;</td></tr></table>
        </td>
        <td valign="top" style="padding:0 0 22px;">
          <p style="margin:0 0 4px;font-family:${SANS};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${
            done ? INK : MUTED
          };">${esc(t)}</p>
          <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.7;color:${MUTED};">${esc(d)}</p>
        </td></tr>`;
      })
      .join('')}
  </table>`;
}

/* ------------------------------------------------------------ templates -- */

export function renderOrderConfirmation(o: OrderEmailData): { subject: string; html: string; text: string } {
  const ref = orderReference(o.id);
  const placed = new Date(o.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const address = addressLines(o);
  const first = firstNameOf(o);

  const html = shell(
    `Order ${ref} confirmed`,
    `Order ${ref} — payment received. We are selecting and packing your parcel in Melbourne.`,
    `
    ${heroSection(
      'Selected for you.',
      first ? `Thank you, ${first}.` : 'Thank you.',
      'Your order is confirmed.',
      `Payment for <span style="color:${INK};">${ref}</span> was received on ${esc(
        placed,
      )}. Every item is now being hand-checked by our Melbourne team, and a second email will follow with carrier and tracking details.`,
    )}
    ${metaStrip(o, 'Confirmed')}
    ${label('Your order')}
    ${itemsTable(o, true)}
    ${gap(28)}
    ${totalsTable(o)}
    ${gap(44)}
    ${twoColumn(
      'Shipping to',
      address.length ? address.map(esc).join('<br />') : '<span style="color:' + MUTED + ';">Address on file</span>',
      'Payment',
      `Paid in full · ${esc(money(o.amountCents, o.currency))}${
        o.shippingMethod ? `<br />Method: ${esc(o.shippingMethod)}` : ''
      }<br /><span style="color:${MUTED};">Card details are held by our payment processor and never stored by us.</span>`,
    )}
    ${gap(44)}
    ${label('What happens next')}
    ${whatHappensNext('confirmed')}
    ${gap(12)}
    ${ctaButton(`${SITE_URL}/track`, 'View order status')}
    ${gap(46)}
  `,
  );

  const text = [
    'SKIN GROCER — Seoul Sourced. Skin Assured.',
    '',
    'Selected for you.',
    first ? `Thank you, ${first}. Your order is confirmed.` : 'Thank you. Your order is confirmed.',
    '',
    `Order ${ref}. Payment received ${placed}.`,
    '',
    ...o.lines.map((l) => `- ${l.name} x${l.quantity} — ${money(l.amountCents, o.currency)}`),
    o.discountCents > 0 ? `Discount: -${money(o.discountCents, o.currency)}` : null,
    `Shipping: ${o.shippingCents > 0 ? money(o.shippingCents, o.currency) : 'Complimentary'}`,
    `Total paid: ${money(o.amountCents, o.currency)}`,
    '',
    address.length ? `Shipping to:\n${address.join('\n')}` : null,
    '',
    'Next: confirmed → selected and packed in Melbourne → dispatched with tracking.',
    `Order status: ${SITE_URL}/track`,
    `Questions: ${SUPPORT_EMAIL}`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  return { subject: `Your Skin Grocer order is confirmed — ${ref}`, html, text };
}

export function renderDispatchNotice(o: OrderEmailData): { subject: string; html: string; text: string } {
  const ref = orderReference(o.id);
  const carrier = o.shippingCarrier?.trim() || null;
  const tracking = o.trackingNumber?.trim() || null;
  const link = trackingLink(carrier, tracking);
  const address = addressLines(o);
  const first = firstNameOf(o);

  const trackingBlock = tracking
    ? `${twoColumn(
        'Carrier',
        esc(carrier ?? 'Carrier'),
        'Tracking number',
        `<span style="letter-spacing:.06em;">${esc(tracking)}</span>`,
      )}
       ${link ? `${gap(28)}${ctaButton(link, 'Track your order')}` : ''}
       <p style="margin:20px 0 0;font-family:${SANS};font-size:13px;line-height:1.7;color:${MUTED};">Delivery timing is set by ${esc(
         carrier ?? 'the carrier',
       )}; their tracking page is the live source of truth.</p>`
    : `<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.8;color:${MUTED};">This parcel was hand-dispatched without a carrier tracking number. Reply to this email and we will update you directly.</p>`;

  const html = shell(
    `Order ${ref} dispatched`,
    `Order ${ref} has left our Melbourne warehouse${tracking ? ` — ${carrier ?? 'carrier'} tracking enclosed.` : '.'}`,
    `
    ${heroSection(
      'Checked and wrapped.',
      first ? `On its way, ${first}.` : 'On its way.',
      'Your order has left us.',
      `Order <span style="color:${INK};">${ref}</span> has been hand-packed, sealed and collected from our Melbourne warehouse.`,
    )}
    ${metaStrip(o, 'Dispatched')}
    ${label('Tracking')}
    ${trackingBlock}
    ${gap(44)}
    ${label('In this parcel')}
    ${itemsTable(o, false)}
    ${gap(40)}
    ${address.length ? twoColumn('Delivering to', address.map(esc).join('<br />'), null, null) + gap(40) : ''}
    ${label('A small note on care')}
    <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.8;color:${MUTED};">Store your formulas away from direct sun, and introduce new actives one at a time. Every product we stock has a step-by-step guide at <a href="${SITE_URL}/shop" style="color:${NAVY};text-decoration:underline;">skingrocer.com.au</a>.</p>
    ${gap(46)}
  `,
    STAMP_DISPATCHED,
  );

  const text = [
    'SKIN GROCER — Seoul Sourced. Skin Assured.',
    '',
    'Checked and wrapped.',
    first ? `On its way, ${first}. Your order has left us.` : 'On its way. Your order has left us.',
    '',
    `Order ${ref} has been dispatched from our Melbourne warehouse.`,
    tracking ? `${carrier ?? 'Carrier'} tracking: ${tracking}` : 'Hand-dispatched — no carrier tracking number.',
    link ? `Track it: ${link}` : null,
    '',
    ...o.lines.map((l) => `- ${l.name} x${l.quantity}`),
    '',
    address.length ? `Delivering to:\n${address.join('\n')}` : null,
    '',
    `Order status: ${SITE_URL}/track`,
    `Questions: ${SUPPORT_EMAIL}`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  return { subject: `Your Skin Grocer order is on its way — ${ref}`, html, text };
}

/** Short, copy-pasteable dispatch message for the manual fallback in the admin UI. */
export function dispatchMessagePlainText(o: OrderEmailData): string {
  const ref = orderReference(o.id);
  const carrier = o.shippingCarrier?.trim() || null;
  const tracking = o.trackingNumber?.trim() || null;
  const link = trackingLink(carrier, tracking);
  const first = firstNameOf(o);
  return [
    first ? `Hi ${first},` : 'Hi,',
    '',
    `Your Skin Grocer order ${ref} has been dispatched from Melbourne.`,
    tracking
      ? `${carrier ?? 'Carrier'} tracking number: ${tracking}`
      : 'It was hand-dispatched, so there is no carrier tracking number.',
    link ? `${trackingLinkLabel(carrier)}: ${link}` : null,
    '',
    'Delivery timing is set by the carrier. Reply to this email if anything looks wrong.',
    '',
    'Skin Grocer — Seoul Sourced. Skin Assured.',
    SUPPORT_EMAIL,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');
}
