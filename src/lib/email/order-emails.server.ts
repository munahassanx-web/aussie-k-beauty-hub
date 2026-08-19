/**
 * Skin Grocer transactional email design system — Option 1, server only.
 *
 * Signature device: THE GROCER STRIPE as a CONTINUOUS FRAME. A bold navy /
 * white 45° diagonal band runs across the top, down both rails and along the
 * bottom, enclosing the entire email from masthead through footer. Immediately
 * inside the frame sits a single very thin champagne-gold keyline — restrained,
 * never a thick gold border.
 *
 * The email field is pure WHITE. Cream is packaging only and is not used here.
 * No seal, no monogram, no botanical or lifestyle imagery: the only pictures
 * are the customer's actual ordered products, looked up in the catalog by
 * Stripe `lookupKey`.
 *
 * Frame artwork is purpose-built PNG (public/email/sg-frame-*). Every stripe
 * cell also carries a solid navy background colour, so with images blocked the
 * frame still reads as a deliberate navy border rather than broken boxes.
 *
 * Every value rendered here comes from a stored order row. Nothing is
 * estimated, promised or invented: no delivery dates, no stock claims, no
 * payment details we do not hold.
 */

import { trackingLink, trackingLinkLabel } from '@/lib/shipping/carriers';
import { SHOP_PRODUCTS } from '@/lib/shop-catalog';

export const SITE_URL = 'https://skingrocer.com.au';
export const SUPPORT_EMAIL = 'customercare@skingrocer.com.au';

/* Brand palette — approved values only. */
const NAVY = '#0D1B2A';
const GOLD = '#C6A15B'; // champagne — used only as a thin keyline and fine details
const GOLD_DEEP = '#8A6D2E'; // accessible champagne for small text on white
const INK = '#16202B';
const MUTED = '#6E6A63';
const RULE = '#E7E3DB';
const PAPER = '#FFFFFF';
const NAVY_MUTED = '#94A0B0';

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/* The Grocer Stripe frame, served from stable public paths. */
const FRAME_H = `${SITE_URL}/email/sg-frame-h.png`;
const FRAME_H_MOBILE = `${SITE_URL}/email/sg-frame-h-m.png`;
const FRAME_V = `${SITE_URL}/email/sg-frame-v.png`;

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
  /** Optional, only present when the stored order actually holds them. */
  status?: string | null;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
  /** Refunded amount in cents — only set when a real refund figure is stored. */
  refundedCents?: number | null;
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

/* ---------------------------------------------------------------- atoms -- */

const label = (t: string, color = MUTED) =>
  `<p style="margin:0 0 12px;font-family:${SANS};font-size:10px;line-height:1.4;letter-spacing:.24em;text-transform:uppercase;color:${color};">${esc(
    t,
  )}</p>`;

const gap = (h: number) => `<div style="height:${h}px;line-height:${h}px;font-size:0;" class="sg-gap">&nbsp;</div>`;

const hairline = (color = RULE) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;line-height:1px;font-size:0;background-color:${color};">&nbsp;</td></tr></table>`;

/** Short fine gold divider used under the tagline. */
const goldDivider = (width = 54) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
     <td width="${width}" style="width:${width}px;height:1px;line-height:1px;font-size:0;background-color:${GOLD};">&nbsp;</td>
   </tr></table>`;

/** Horizontal run of the signature frame (top and bottom edges). */
function frameBar(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td bgcolor="${NAVY}" height="22" style="background-color:${NAVY};height:22px;line-height:0;font-size:0;">
      <img src="${FRAME_H}" width="620" height="22" alt="" class="sg-hide-mobile" style="display:block;width:100%;max-width:620px;height:22px;border:0;" />
      <img src="${FRAME_H_MOBILE}" width="390" height="16" alt="" class="sg-show-mobile" style="display:none;width:100%;height:auto;border:0;mso-hide:all;" />
    </td></tr>
  </table>`;
}

/** Vertical rail of the signature frame; solid navy is the images-off fallback. */
function frameRail(): string {
  return `<td class="sg-rail" width="22" valign="top" bgcolor="${NAVY}"
    background="${FRAME_V}"
    style="width:22px;background-color:${NAVY};background-image:url('${FRAME_V}');background-repeat:repeat-y;background-position:top left;font-size:0;line-height:0;">&nbsp;</td>`;
}

function ctaButton(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td bgcolor="${NAVY}" style="background-color:${NAVY};">
      <a href="${href}" style="display:inline-block;padding:17px 34px;font-family:${SANS};font-size:12px;line-height:1;letter-spacing:.22em;text-transform:uppercase;color:${PAPER};text-decoration:none;font-weight:bold;">${esc(
        text,
      )}<span style="color:${GOLD};letter-spacing:0;">&nbsp;&nbsp;&#8594;</span></a>
    </td></tr></table>`;
}

/** The four restrained assurances. Typographic marks only — no imagery. */
function benefitsRow(): string {
  const items: Array<[string, string]> = [
    ['&#9670;', 'Seoul Sourced'],
    ['&#9671;', 'Curated K-Beauty'],
    ['&#9678;', 'Skin Assured'],
    ['&#9654;', 'Fast Shipping Australia Wide'],
  ];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};border-bottom:1px solid ${RULE};">
    <tr>${items
      .map(
        ([mark, text], i) => `<td class="sg-benefit${i === 0 ? ' sg-benefit-first' : ''}" width="25%" align="center" valign="top" style="padding:22px 10px;${
          i === 0 ? '' : `border-left:1px solid ${RULE};`
        }">
        <p style="margin:0 0 9px;font-family:${SANS};font-size:13px;line-height:1;color:${GOLD};">${mark}</p>
        <p style="margin:0;font-family:${SANS};font-size:9px;line-height:1.5;letter-spacing:.20em;text-transform:uppercase;color:${MUTED};">${esc(
          text,
        )}</p>
      </td>`,
      )
      .join('')}</tr>
  </table>`;
}

/** Deep navy footer, enclosed by the same frame. */
function footerBlock(): string {
  const navLink = (href: string, text: string) =>
    `<a href="${href}" style="font-family:${SANS};font-size:10px;letter-spacing:.20em;text-transform:uppercase;color:${NAVY_MUTED};text-decoration:none;">${esc(
      text,
    )}</a>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${NAVY}" style="background-color:${NAVY};">
    <tr><td align="center" class="sg-pad" style="padding:38px 40px 34px;">
      <p style="margin:0;font-family:${SERIF};font-size:24px;line-height:1.1;letter-spacing:.22em;text-transform:uppercase;color:${PAPER};font-weight:normal;">Skin&nbsp;Grocer</p>
      <p style="margin:14px 0 0;font-family:${SANS};font-size:9px;line-height:1.5;letter-spacing:.30em;text-transform:uppercase;color:${GOLD};">Seoul Sourced. Skin Assured.</p>
      <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
      ${goldDivider(40)}
      <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
      <p style="margin:0;font-family:${SANS};font-size:10px;line-height:2.2;letter-spacing:.20em;">
        ${navLink(`${SITE_URL}/shop`, 'Shop')}<span style="color:${GOLD};">&nbsp; · &nbsp;</span>${navLink(
          `${SITE_URL}/routines`,
          'Routines',
        )}<span style="color:${GOLD};">&nbsp; · &nbsp;</span>${navLink(`${SITE_URL}/learn`, 'Learn')}<span style="color:${GOLD};">&nbsp; · &nbsp;</span>${navLink(
          `${SITE_URL}/track`,
          'Track Order',
        )}
      </p>
      <p style="margin:6px 0 0;font-family:${SANS};font-size:10px;line-height:2.2;letter-spacing:.20em;">
        ${navLink('https://www.instagram.com/skingrocer', 'Instagram')}<span style="color:${GOLD};">&nbsp; · &nbsp;</span>${navLink(
          'https://www.tiktok.com/@skingrocer',
          'TikTok',
        )}<span style="color:${GOLD};">&nbsp; · &nbsp;</span>${navLink(`mailto:${SUPPORT_EMAIL}`, 'Contact')}
      </p>
      <div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
      <p style="margin:0;font-family:${SANS};font-size:11px;line-height:1.75;color:${NAVY_MUTED};">Skin Grocer · Dispatched from Melbourne, Australia</p>
      <p style="margin:6px 0 0;font-family:${SANS};font-size:11px;line-height:1.75;color:#6C7686;">You are receiving this message because you placed an order with Skin Grocer.</p>
    </td></tr>
  </table>`;
}

/**
 * Spacious white masthead: wordmark, gold tagline, fine gold divider, then the
 * left-aligned order statement.
 */
function masthead(headline: string, statement: string, standfirst: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAPER}" style="background-color:${PAPER};">
    <tr><td align="center" class="sg-pad" style="padding:52px 48px 0;">
      <p class="sg-wordmark" style="margin:0;font-family:${SERIF};font-size:36px;line-height:1.05;letter-spacing:.24em;text-transform:uppercase;color:${NAVY};font-weight:normal;">Skin&nbsp;Grocer</p>
      <p style="margin:16px 0 0;font-family:${SANS};font-size:9px;line-height:1.5;letter-spacing:.32em;text-transform:uppercase;color:${GOLD_DEEP};">Seoul Sourced. Skin Assured.</p>
      <div style="height:26px;line-height:26px;font-size:0;">&nbsp;</div>
      ${goldDivider(54)}
    </td></tr>
    <tr><td align="left" class="sg-pad" style="padding:44px 48px 0;">
      <p style="margin:0 0 6px;font-family:${SERIF};font-size:26px;line-height:1.3;color:${MUTED};font-weight:normal;" class="sg-display">${esc(
        headline,
      )}</p>
      <p style="margin:0 0 18px;font-family:${SERIF};font-size:28px;line-height:1.25;color:${INK};font-weight:bold;" class="sg-display">${esc(
        statement,
      )}</p>
      <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.8;color:${MUTED};">${standfirst}</p>
    </td></tr>
  </table>`;
}

/* ---------------------------------------------------------------- shell -- */

/**
 * Full document shell. The navy/white Grocer Stripe frames all four sides,
 * a single thin gold keyline sits immediately inside it, and everything —
 * masthead, order, assurances, footer — lives on white inside that frame.
 */
function shell(title: string, preheader: string, inner: string): string {
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
    .sg-pad { padding-left:22px !important; padding-right:22px !important; }
    .sg-gap { height:28px !important; }
    .sg-rail { width:12px !important; }
    .sg-stack { display:block !important; width:100% !important; max-width:100% !important; padding-left:0 !important; padding-right:0 !important; padding-bottom:22px !important; }
    .sg-meta { padding:16px 22px !important; border-left:0 !important; border-top:1px solid ${RULE} !important; }
    .sg-meta-first { border-top:0 !important; }
    .sg-thumb { width:64px !important; }
    .sg-wordmark { font-size:27px !important; letter-spacing:.18em !important; }
    .sg-display { font-size:22px !important; }
    .sg-stage { display:block !important; width:100% !important; border-left:0 !important; border-top:1px solid ${RULE} !important; padding:14px 0 !important; }
    .sg-stage-first { border-top:0 !important; }
    .sg-benefit { display:block !important; width:100% !important; border-left:0 !important; border-top:1px solid ${RULE} !important; padding:16px 10px !important; }
    .sg-benefit-first { border-top:0 !important; }
    .sg-hide-mobile { display:none !important; width:0 !important; height:0 !important; max-height:0 !important; overflow:hidden !important; }
    .sg-show-mobile { display:block !important; width:100% !important; height:auto !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(
    preheader,
  )}&#8203;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;&#847;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAPER}" style="background-color:${PAPER};">
    <tr><td align="center" style="padding:26px 10px 34px;">
      <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;">

        <!-- signature frame: top edge -->
        <tr><td colspan="3">${frameBar()}</td></tr>

        <tr>
          ${frameRail()}
          <td valign="top" bgcolor="${PAPER}" style="background-color:${PAPER};border-left:1px solid ${GOLD};border-right:1px solid ${GOLD};">
            <!-- thin gold keyline, top edge -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="height:1px;line-height:1px;font-size:0;background-color:${GOLD};">&nbsp;</td></tr>
            </table>
            ${inner}
            <!-- thin gold keyline, bottom edge -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="height:1px;line-height:1px;font-size:0;background-color:${GOLD};">&nbsp;</td></tr>
            </table>
          </td>
          ${frameRail()}
        </tr>

        <!-- signature frame: bottom edge -->
        <tr><td colspan="3">${frameBar()}</td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* -------------------------------------------------------------- pieces -- */

/** Order reference / date / status strip, quiet on white. */
function metaStrip(o: OrderEmailData, status: string): string {
  const placed = new Date(o.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const cell = (t: string, v: string, i: number) =>
    `<td class="sg-stack sg-meta${i === 0 ? ' sg-meta-first' : ''}" width="33.33%" valign="top" style="padding:20px 16px;${
      i === 0 ? '' : `border-left:1px solid ${RULE};`
    }">
      <p style="margin:0 0 6px;font-family:${SANS};font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:${MUTED};">${esc(t)}</p>
      <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.5;color:${INK};">${esc(v)}</p>
    </td>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};border-bottom:1px solid ${RULE};">
    <tr>${cell('Order', orderReference(o.id), 0)}${cell('Placed', placed, 1)}${cell('Status', status, 2)}</tr>
  </table>`;
}

/** Product row: real ordered product photography when known, neutral tile otherwise. */
function productRow(line: OrderEmailLine, currency: string, showPrice: boolean): string {
  const product = catalogFor(line);
  const brand = product?.brand ?? null;
  const size = (product as any)?.size ?? (product as any)?.volume ?? null;
  const thumb = product
    ? `<img src="${SITE_URL}${product.image}" width="72" height="72" alt="${esc(
        `${product.brand} ${product.name}`,
      )}" style="display:block;width:72px;height:72px;object-fit:cover;background-color:#F4F4F2;" />`
    : `<table role="presentation" width="72" height="72" cellpadding="0" cellspacing="0" border="0" bgcolor="#F4F4F2" style="background-color:#F4F4F2;width:72px;height:72px;"><tr>
         <td align="center" valign="middle" style="font-family:${SANS};font-size:9px;letter-spacing:.20em;text-transform:uppercase;color:${GOLD_DEEP};">Item</td></tr></table>`;

  const meta = [size ? esc(String(size)) : null, `Quantity ${line.quantity}`].filter(Boolean).join(' &nbsp;·&nbsp; ');

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
      <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.5;color:${MUTED};">${meta}</p>
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

/** White editorial body block with consistent side padding. */
function bodyBlock(inner: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAPER}" style="background-color:${PAPER};">
    <tr><td class="sg-pad" style="padding:0 48px;">${inner}</td></tr>
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
    `
    ${masthead(
      first ? `Thank you, ${first}.` : 'Thank you.',
      'Your selection is confirmed.',
      `We&rsquo;ve carefully selected the best for your skin. Payment for <span style="color:${INK};">${ref}</span> was received on ${esc(
        placed,
      )}, and a second email will follow with carrier and tracking details.`,
    )}
    ${bodyBlock(`
      ${gap(36)}
      ${metaStrip(o, 'Confirmed')}
      ${gap(38)}
      ${label('Your order')}
      ${itemsTable(o, true)}
      ${gap(28)}
      ${totalsTable(o)}
      ${gap(38)}
      ${ctaButton(`${SITE_URL}/track`, 'View your order')}
      ${gap(44)}
      ${twoColumn(
        'Shipping to',
        address.length ? address.map(esc).join('<br />') : `<span style="color:${MUTED};">Address on file</span>`,
        'Payment',
        `Paid in full · ${esc(money(o.amountCents, o.currency))}${
          o.shippingMethod ? `<br />Method: ${esc(o.shippingMethod)}` : ''
        }<br /><span style="color:${MUTED};">Card details are held by our payment processor and never stored by us.</span>`,
      )}
      ${gap(44)}
      ${label('Order progress')}
      ${orderJourney('received')}
      ${gap(44)}
      ${benefitsRow()}
      ${gap(38)}
      ${hairline()}
      ${gap(26)}
      ${label('Customer care')}
      <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.75;color:${MUTED};">
        Reply to this email, or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:${NAVY};text-decoration:underline;">${SUPPORT_EMAIL}</a>.
      </p>
      ${gap(46)}
    `)}
    ${footerBlock()}
  `,
  );

  const text = [
    'SKIN GROCER — Seoul Sourced. Skin Assured.',
    '',
    first ? `Thank you, ${first}. Your selection is confirmed.` : 'Thank you. Your selection is confirmed.',
    "We've carefully selected the best for your skin.",
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
    `View your order: ${SITE_URL}/track`,
    `Questions: ${SUPPORT_EMAIL}`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  return { subject: `[TEST] Your Skin Grocer order is confirmed — ${ref}`, html, text };
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
    ${masthead(
      first ? `On its way, ${first}.` : 'On its way.',
      'Your selection has left us.',
      `Order <span style="color:${INK};">${ref}</span> has been hand-packed, sealed and collected from our Melbourne warehouse.`,
    )}
    ${bodyBlock(`
      ${gap(36)}
      ${metaStrip(o, 'Dispatched')}
      ${gap(38)}
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
      ${benefitsRow()}
      ${gap(38)}
      ${hairline()}
      ${gap(26)}
      ${label('Customer care')}
      <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.75;color:${MUTED};">
        Reply to this email, or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:${NAVY};text-decoration:underline;">${SUPPORT_EMAIL}</a>.
      </p>
      ${gap(46)}
    `)}
    ${footerBlock()}
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

  return { subject: `[TEST] Your Skin Grocer order is on its way — ${ref}`, html, text };
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

/**
 * Delivery confirmation. Same locked Option 1 system as the order confirmation:
 * white field, navy/white Grocer Stripe frame, thin gold keyline, same masthead
 * and footer. Only the transactional copy, status and CTA change. Never claims
 * a delivery time or signature we do not hold.
 */
export function renderDeliveryConfirmation(o: OrderEmailData): { subject: string; html: string; text: string } {
  const ref = orderReference(o.id);
  const carrier = o.shippingCarrier?.trim() || null;
  const tracking = o.trackingNumber?.trim() || null;
  const link = trackingLink(carrier, tracking);
  const address = addressLines(o);
  const first = firstNameOf(o);
  const deliveredOn = o.deliveredAt
    ? new Date(o.deliveredAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const html = shell(
    `Order ${ref} delivered`,
    `Order ${ref} has been marked delivered${deliveredOn ? ` on ${deliveredOn}` : ''}.`,
    `
    ${masthead(
      first ? `It has arrived, ${first}.` : 'It has arrived.',
      'Your selection has been delivered.',
      `Order <span style="color:${INK};">${ref}</span> has been marked delivered${
        deliveredOn ? ` on ${esc(deliveredOn)}` : ''
      }${carrier ? ` by ${esc(carrier)}` : ''}. If anything is missing or damaged, reply to this email and we will make it right.`,
    )}
    ${bodyBlock(`
      ${gap(36)}
      ${metaStrip(o, 'Delivered')}
      ${gap(38)}
      ${label('In this parcel')}
      ${itemsTable(o, false)}
      ${gap(38)}
      ${ctaButton(`${SITE_URL}/track`, 'View your order')}
      ${gap(44)}
      ${label('Order progress')}
      ${orderJourney('delivered')}
      ${gap(44)}
      ${twoColumn(
        'Delivered to',
        address.length ? address.map(esc).join('<br />') : `<span style="color:${MUTED};">Address on file</span>`,
        tracking ? 'Delivery record' : null,
        tracking
          ? `${esc(carrier ?? 'Carrier')}<br /><span style="letter-spacing:.06em;">${esc(tracking)}</span>${
              link
                ? `<br /><a href="${link}" style="color:${NAVY};text-decoration:underline;">${esc(
                    trackingLinkLabel(carrier),
                  )}</a>`
                : ''
            }`
          : null,
      )}
      ${gap(44)}
      ${label('Using your routine')}
      <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.8;color:${MUTED};">
        Introduce one new step at a time, and give each formula a fortnight before judging it. Guidance for every product
        we carry lives in the <a href="${SITE_URL}/learn" style="color:${NAVY};text-decoration:underline;">Skin Grocer library</a>.
      </p>
      ${gap(44)}
      ${benefitsRow()}
      ${gap(38)}
      ${hairline()}
      ${gap(26)}
      ${label('Customer care')}
      <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.75;color:${MUTED};">
        Reply to this email, or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:${NAVY};text-decoration:underline;">${SUPPORT_EMAIL}</a>.
      </p>
      ${gap(46)}
    `)}
    ${footerBlock()}
  `,
  );

  const text = [
    'SKIN GROCER — Seoul Sourced. Skin Assured.',
    '',
    first ? `It has arrived, ${first}. Your selection has been delivered.` : 'It has arrived. Your selection has been delivered.',
    '',
    `Order ${ref} has been marked delivered${deliveredOn ? ` on ${deliveredOn}` : ''}${carrier ? ` by ${carrier}` : ''}.`,
    tracking ? `${carrier ?? 'Carrier'} tracking: ${tracking}` : null,
    link ? `Delivery record: ${link}` : null,
    '',
    ...o.lines.map((l) => `- ${l.name} x${l.quantity}`),
    '',
    address.length ? `Delivered to:\n${address.join('\n')}` : null,
    '',
    'Order progress: order received → being prepared → on its way → DELIVERED.',
    `View your order: ${SITE_URL}/track`,
    `Anything missing or damaged? ${SUPPORT_EMAIL}`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  return { subject: `[TEST] Your Skin Grocer order has been delivered — ${ref}`, html, text };
}

/**
 * Cancellation / refund notice. Same locked visual system. Refund figures are
 * printed only when a real stored amount exists; otherwise the email says
 * plainly that the amount will be confirmed — nothing is invented.
 */
export function renderCancellationNotice(
  o: OrderEmailData,
  options: { reasonNote?: string | null } = {},
): { subject: string; html: string; text: string } {
  const ref = orderReference(o.id);
  const first = firstNameOf(o);
  const refunded = typeof o.refundedCents === 'number' && o.refundedCents > 0 ? o.refundedCents : null;
  const isRefund = refunded !== null || (o.status ?? '').toLowerCase().includes('refund');
  const heading = isRefund ? 'Your refund is on its way.' : 'Your order has been cancelled.';
  const statusLabel = isRefund ? 'Refunded' : 'Cancelled';
  const note = options.reasonNote?.trim() || null;

  const refundBody = refunded
    ? `${esc(money(refunded, o.currency))} has been returned to the original payment method. Banks generally take five to ten business days to show it.`
    : `We have cancelled this order with our payment processor. Any amount captured is returned to the original payment method — your bank statement is the source of truth for the exact figure and timing.`;

  const html = shell(
    `Order ${ref} ${statusLabel.toLowerCase()}`,
    `Order ${ref} has been ${statusLabel.toLowerCase()}.`,
    `
    ${masthead(
      first ? `Noted, ${first}.` : 'Noted.',
      heading,
      `Order <span style="color:${INK};">${ref}</span> has been ${esc(
        statusLabel.toLowerCase(),
      )}. Nothing further will be shipped against it, and no further payment will be taken.`,
    )}
    ${bodyBlock(`
      ${gap(36)}
      ${metaStrip(o, statusLabel)}
      ${gap(38)}
      ${label(isRefund ? 'Refund' : 'Cancellation')}
      <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.8;color:${MUTED};">${refundBody}</p>
      ${note ? `<p style="margin:16px 0 0;font-family:${SANS};font-size:14px;line-height:1.75;color:${MUTED};">${esc(note)}</p>` : ''}
      ${gap(38)}
      ${twoColumn(
        'Order total',
        `${esc(money(o.amountCents, o.currency))}`,
        refunded ? 'Amount refunded' : null,
        refunded ? `${esc(money(refunded, o.currency))}` : null,
      )}
      ${gap(40)}
      ${label(isRefund ? 'Items refunded' : 'Items cancelled')}
      ${itemsTable(o, true)}
      ${gap(38)}
      ${ctaButton(`${SITE_URL}/shop`, 'Shop Skin Grocer')}
      ${gap(44)}
      ${benefitsRow()}
      ${gap(38)}
      ${hairline()}
      ${gap(26)}
      ${label('Customer care')}
      <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.75;color:${MUTED};">
        If this was not expected, reply to this email or write to
        <a href="mailto:${SUPPORT_EMAIL}" style="color:${NAVY};text-decoration:underline;">${SUPPORT_EMAIL}</a> and we will look into it straight away.
      </p>
      ${gap(46)}
    `)}
    ${footerBlock()}
  `,
  );

  const text = [
    'SKIN GROCER — Seoul Sourced. Skin Assured.',
    '',
    first ? `Noted, ${first}. ${heading}` : heading,
    '',
    `Order ${ref} has been ${statusLabel.toLowerCase()}.`,
    refunded
      ? `Amount refunded: ${money(refunded, o.currency)} to the original payment method.`
      : 'Any amount captured is returned to the original payment method; your bank statement confirms the exact figure and timing.',
    note,
    '',
    ...o.lines.map((l) => `- ${l.name} x${l.quantity} — ${money(l.amountCents, o.currency)}`),
    `Order total: ${money(o.amountCents, o.currency)}`,
    '',
    `Shop Skin Grocer: ${SITE_URL}/shop`,
    `Questions: ${SUPPORT_EMAIL}`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');

  return {
    subject: isRefund ? `[TEST] Your Skin Grocer refund — ${ref}` : `[TEST] Your Skin Grocer order has been cancelled — ${ref}`,
    html,
    text,
  };
}
