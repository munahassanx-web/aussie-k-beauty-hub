/**
 * Skin Grocer transactional email design system — V5, server only.
 *
 * Signature device: THE GROCER STRIPE, treated as a PRIMARY brand asset.
 * Broad 60° navy bands, wide warm-cream negative space, and a genuinely
 * visible champagne-gold companion band riding every cream band (~12% of the
 * field). It appears three times, deliberately: a 64px signature ribbon above
 * the masthead, a vertical editorial crop beside the order statement, and a
 * bold 44px repeat before the footer. Nowhere else — recognition, not clutter.
 *
 * Artwork is purpose-built PNG at true rendered scale (public/email/sg-stripe-*).
 * Every stripe sits on a solid navy cell closed by a 3px champagne rule, so
 * with images blocked the band still reads as an intentional navy + gold
 * brand bar rather than a broken image.
 *
 * There is no monogram and no seal: the original interlocked SG artwork is not
 * present in this repository, so nothing is invented in its place.
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
const GOLD = '#C6A15B'; // champagne — now a structural stripe colour, not a hairline
const GOLD_DEEP = '#8A6D2E'; // accessible champagne for text on cream/white
const INK = '#16202B';
const MUTED = '#6E6A63';
const RULE = '#E3DDD2';
const PAPER = '#FFFFFF';
const NAVY_MUTED = '#8A94A2';

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/* The Grocer Stripe, served from stable public paths. */
const STRIPE_BAND = `${SITE_URL}/email/sg-stripe-band.png`;
const STRIPE_FOOT = `${SITE_URL}/email/sg-stripe-foot.png`;
const STRIPE_COLUMN = `${SITE_URL}/email/sg-stripe-column.png`;
const STRIPE_MOBILE = `${SITE_URL}/email/sg-stripe-mobile.png`;


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

const label = (t: string, color = MUTED) =>
  `<p style="margin:0 0 10px;font-family:${SANS};font-size:10px;line-height:1.4;letter-spacing:.24em;text-transform:uppercase;color:${color};">${esc(
    t,
  )}</p>`;

const gap = (h: number) => `<div style="height:${h}px;line-height:${h}px;font-size:0;" class="sg-gap">&nbsp;</div>`;

const hairline = (color = RULE) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;line-height:1px;font-size:0;background-color:${color};">&nbsp;</td></tr></table>`;

/**
 * THE GROCER STRIPE — horizontal signature field.
 *
 * A real image at true rendered scale sits on a solid navy cell closed by a
 * 3px champagne rule. With images blocked the row is still a bold navy band
 * with a clearly visible gold edge: deliberate branding, never a broken box.
 * A dedicated mobile crop keeps the bands broad at 390px instead of letting
 * them scale down into hatching.
 */
function grocerStripe(kind: 'signature' | 'repeat'): string {
  const signature = kind === 'signature';
  const src = signature ? STRIPE_BAND : STRIPE_FOOT;
  const h = signature ? 64 : 44;
  const alt = 'Skin Grocer';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td bgcolor="${NAVY}" height="${h}" style="background-color:${NAVY};height:${h}px;line-height:0;font-size:0;">
      <img src="${src}" width="620" height="${h}" alt="${alt}" class="sg-band sg-hide-mobile" style="display:block;width:100%;max-width:620px;height:${h}px;border:0;" />
      <img src="${STRIPE_MOBILE}" width="390" height="56" alt="${alt}" class="sg-show-mobile" style="display:none;width:100%;height:auto;border:0;mso-hide:all;" />
    </td></tr>
    <tr><td bgcolor="${GOLD}" style="height:3px;line-height:3px;font-size:0;background-color:${GOLD};">&nbsp;</td></tr>
  </table>`;
}

/**
 * The stripe's second appearance: a vertical editorial crop that enters from
 * the left edge of the order statement, roughly a quarter of the row, so the
 * signature frames the message like branded packaging. On mobile the column
 * is swapped for a broad horizontal crop so the bands never become a hairline.
 */
function stripeStatement(inner: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${NAVY}" style="background-color:${NAVY};">
    <tr>
      <td class="sg-col sg-stack-hide" width="150" valign="top" bgcolor="${NAVY}" style="width:150px;background-color:${NAVY};font-size:0;line-height:0;">
        <img src="${STRIPE_COLUMN}" width="150" height="360" alt="" style="display:block;width:150px;height:360px;border:0;" />
      </td>
      <td class="sg-statement" valign="middle" bgcolor="${NAVY}" style="background-color:${NAVY};padding:44px 40px;">${inner}</td>
    </tr>
    <tr><td colspan="2" class="sg-show-mobile-cell" style="display:none;font-size:0;line-height:0;mso-hide:all;">
      <img src="${STRIPE_MOBILE}" width="390" height="56" alt="" style="display:block;width:100%;height:auto;border:0;" />
    </td></tr>
  </table>`;
}


function ctaButton(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td bgcolor="${NAVY}" style="background-color:${NAVY};">
      <a href="${href}" style="display:inline-block;padding:18px 36px;font-family:${SANS};font-size:12px;line-height:1;letter-spacing:.22em;text-transform:uppercase;color:${CREAM};text-decoration:none;font-weight:bold;">${esc(
        text,
      )}</a>
    </td></tr></table>`;
}

/**
 * Full document shell. The stripe, masthead and order statement read as one
 * composed branded opening; the stripe then returns once before the footer.
 *   stripe ribbon → navy masthead → navy stripe statement
 *   → white editorial body → stripe repeat → navy close
 */
function shell(title: string, preheader: string, hero: string, body: string): string {

  return `<!doctype html>
<html lang="en"><head>
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
    .sg-wordmark { font-size:28px !important; letter-spacing:.14em !important; }
    .sg-display { font-size:27px !important; }
    .sg-stage { display:block !important; width:100% !important; border-left:0 !important; border-top:1px solid ${RULE} !important; padding:14px 0 !important; }
    .sg-stage-first { border-top:0 !important; }
    /* keep the Grocer Stripe broad on small screens — never a hairline */
    .sg-hide-mobile { display:none !important; width:0 !important; height:0 !important; max-height:0 !important; overflow:hidden !important; }
    .sg-show-mobile { display:block !important; width:100% !important; height:auto !important; }
    .sg-show-mobile-cell { display:table-cell !important; }
    .sg-stack-hide { display:none !important; width:0 !important; max-width:0 !important; overflow:hidden !important; }
    .sg-statement { padding:34px 24px 30px !important; }
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

        <!-- signature ribbon: the stripe leads the brand, at full strength -->
        <tr><td>${grocerStripe('signature')}</td></tr>

        <!-- masthead: same navy field, composed as one opening with the ribbon -->
        <tr><td bgcolor="${NAVY}" align="center" class="sg-pad" style="background-color:${NAVY};padding:42px 40px 38px;">
          <p class="sg-wordmark" style="margin:0;font-family:${SERIF};font-size:38px;line-height:1.05;letter-spacing:.20em;text-transform:uppercase;color:${CREAM};font-weight:normal;">Skin&nbsp;Grocer</p>
          <p style="margin:16px 0 0;font-family:${SANS};font-size:10px;line-height:1.4;letter-spacing:.30em;text-transform:uppercase;color:${GOLD};">Seoul Sourced. Skin Assured.</p>
        </td></tr>

        <!-- the stripe's second moment: vertical crop beside the order statement -->
        <tr><td>${hero}</td></tr>

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

        <!-- the stripe returns, bold, to close the email -->
        <tr><td>${grocerStripe('repeat')}</td></tr>


        <!-- navy close -->
        <tr><td bgcolor="${NAVY}" align="center" class="sg-pad" style="background-color:${NAVY};padding:34px 40px 32px;">
          <p style="margin:0 0 14px;font-family:${SANS};font-size:9px;line-height:1.9;letter-spacing:.24em;text-transform:uppercase;color:${GOLD};">Curated K-Beauty · Seoul → Australia · Selected For You</p>
          <p style="margin:0;font-family:${SANS};font-size:11px;line-height:1.75;color:${NAVY_MUTED};">Skin Grocer · Dispatched from Melbourne, Australia</p>
          <p style="margin:6px 0 0;font-family:${SANS};font-size:11px;line-height:1.75;color:#6C7686;">You are receiving this message because you placed an order with Skin Grocer.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* -------------------------------------------------------------- pieces -- */

/**
 * Importer's ticket: a horizontal grocer/consignment label. Deliberately small
 * and typographic so it supports the stripe rather than competing with it.
 * Carries only factual data: the route, the selection, the order reference.
 */
function selectionLabel(ref: string): string {
  const cell = (t: string, v: string, color: string, last = false) =>
    `<td valign="middle" style="padding:11px 16px;${last ? '' : `border-right:1px solid ${RULE};`}">
      <p style="margin:0 0 5px;font-family:${SANS};font-size:8px;line-height:1.3;letter-spacing:.26em;text-transform:uppercase;color:${MUTED};">${esc(
        t,
      )}</p>
      <p style="margin:0;font-family:${SANS};font-size:10px;line-height:1.3;letter-spacing:.20em;text-transform:uppercase;color:${color};">${esc(
        v,
      )}</p>
    </td>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${RULE};border-left:4px solid ${GOLD};">
    <tr>
      ${cell('Selected for you', 'Skin Grocer', INK)}
      ${cell('Route', 'Seoul → Australia', GOLD_DEEP)}
      ${cell('Consignment', ref, INK, true)}
    </tr>
  </table>`;
}

/**
 * The order statement, set on the navy field with the vertical Grocer Stripe
 * entering from the left edge — the signature participates in the message.
 */
function heroStatement(headline: string, subhead: string): string {
  return stripeStatement(
    `<h1 class="sg-display" style="margin:0;font-family:${SERIF};font-size:34px;line-height:1.18;letter-spacing:-0.01em;font-weight:normal;color:${CREAM};">${esc(
      headline,
    )}</h1>
     <p class="sg-display" style="margin:8px 0 0;font-family:${SERIF};font-size:34px;line-height:1.18;letter-spacing:-0.01em;color:${GOLD};">${esc(
       subhead,
     )}</p>`,
  );
}

/** White-field opener beneath the statement: provenance label, then the facts. */
function heroIntro(standfirst: string, ref: string): string {
  return `${gap(40)}
  ${selectionLabel(ref)}
  ${gap(26)}
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
         <td align="center" valign="middle" style="font-family:${SANS};font-size:9px;letter-spacing:.20em;text-transform:uppercase;color:${GOLD_DEEP};">Item</td></tr></table>`;

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

/**
 * Restrained horizontal journey. Only the factual current stage is marked;
 * future stages stay quiet and are never shown as complete.
 */
function orderJourney(current: 'received' | 'preparing' | 'on_its_way' | 'delivered'): string {
  const stages: Array<['received' | 'preparing' | 'on_its_way' | 'delivered', string]> = [
    ['received', 'Order received'],
    ['preparing', 'Being prepared'],
    ['on_its_way', 'On its way'],
    ['delivered', 'Delivered'],
  ];
  const currentIndex = stages.findIndex(([k]) => k === current);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};border-bottom:1px solid ${RULE};">
    <tr>
      ${stages
        .map(([, title], i) => {
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;
          const color = isCurrent ? INK : isPast ? MUTED : '#A9A49B';
          return `<td class="sg-stage${i === 0 ? ' sg-stage-first' : ''}" width="25%" valign="top" style="padding:16px 12px 16px ${
            i === 0 ? '0' : '12px'
          };${i === 0 ? '' : `border-left:1px solid ${RULE};`}">
          <p style="margin:0 0 8px;font-family:${SANS};font-size:9px;line-height:1.3;letter-spacing:.22em;text-transform:uppercase;color:${color};font-weight:${
            isCurrent ? 'bold' : 'normal'
          };">${esc(title)}</p>
          <table role="presentation" width="${isCurrent ? '28' : '14'}" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="height:2px;line-height:2px;font-size:0;background-color:${isCurrent ? GOLD_DEEP : RULE};">&nbsp;</td>
          </tr></table>
        </td>`;
        })
        .join('')}
    </tr>
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
    `Order ${ref} — payment received. Your selection is confirmed and being prepared in Melbourne.`,
    heroStatement(first ? `Thank you, ${first}.` : 'Thank you.', 'Your selection is confirmed.'),
    `
    ${heroIntro(
      `We've carefully selected the best for your skin. Payment for <span style="color:${INK};">${ref}</span> was received on ${esc(
        placed,
      )}, and a second email will follow with carrier and tracking details.`,
      ref,
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
    ${label('Order progress')}
    ${orderJourney('received')}
    ${gap(32)}
    ${ctaButton(`${SITE_URL}/track`, 'View order status')}
    ${gap(46)}
  `,
  );

  const text = [
    'SKIN GROCER — Seoul Sourced. Skin Assured.',
    '',
    `SELECTED FOR YOU · SEOUL → AUSTRALIA · ORDER ${ref}`,
    '',
    first ? `Thank you, ${first}. Your selection is confirmed.` : 'Thank you. Your selection is confirmed.',
    '',
    `Payment for order ${ref} was received on ${placed}.`,
    '',
    ...o.lines.map((l) => `- ${l.name} x${l.quantity} — ${money(l.amountCents, o.currency)}`),
    o.discountCents > 0 ? `Discount: -${money(o.discountCents, o.currency)}` : null,
    `Shipping: ${o.shippingCents > 0 ? money(o.shippingCents, o.currency) : 'Complimentary'}`,
    `Total paid: ${money(o.amountCents, o.currency)}`,
    '',
    address.length ? `Shipping to:\n${address.join('\n')}` : null,
    '',
    'Order progress: ORDER RECEIVED → being prepared → on its way → delivered.',
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
    heroStatement(first ? `On its way, ${first}.` : 'On its way.', 'Your selection has left us.'),
    `
    ${heroIntro(
      `Order <span style="color:${INK};">${ref}</span> has been hand-packed, sealed and collected from our Melbourne warehouse.`,
      ref,
    )}

    ${metaStrip(o, 'Dispatched')}
    ${label('Tracking')}
    ${trackingBlock}
    ${gap(44)}
    ${label('Order progress')}
    ${orderJourney('on_its_way')}
    ${gap(44)}
    ${label('In this parcel')}
    ${itemsTable(o, false)}
    ${gap(40)}
    ${address.length ? twoColumn('Delivering to', address.map(esc).join('<br />'), null, null) + gap(40) : ''}
    ${label('A small note on care')}
    <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.8;color:${MUTED};">Store your formulas away from direct sun, and introduce new actives one at a time. Every product we stock has a step-by-step guide at <a href="${SITE_URL}/shop" style="color:${NAVY};text-decoration:underline;">skingrocer.com.au</a>.</p>
    ${gap(46)}
  `,
  );

  const text = [
    'SKIN GROCER — Seoul Sourced. Skin Assured.',
    '',
    first ? `On its way, ${first}. Your selection has left us.` : 'On its way. Your selection has left us.',
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
