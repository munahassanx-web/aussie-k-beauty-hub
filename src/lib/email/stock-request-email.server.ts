/**
 * "Ask us to stock it" confirmation email — server only.
 *
 * Deliberately quiet: it confirms exactly what was received and promises only
 * what we can honour (we email the requester if and when the product lands).
 * No delivery date, no discount, no invented stock claim.
 */

import { SITE_URL, SUPPORT_EMAIL } from './order-emails.server';

const NAVY = '#0D1B2A';
const GOLD = '#C6A15B';
const INK = '#16202B';
const MUTED = '#6E6A63';
const RULE = '#E7E3DB';
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type StockRequestEmailData = {
  name?: string | null;
  productBrand?: string | null;
  productName: string;
  note?: string | null;
};

export function renderStockRequestConfirmation(data: StockRequestEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const product = [data.productBrand, data.productName].filter(Boolean).join(' ').trim() || data.productName;
  const greeting = data.name ? `${data.name},` : 'Hello,';
  const subject = `We've logged your request — ${product}`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(subject)}</title>
<style>
  @media only screen and (max-width:600px){
    .sg-pad{padding:28px 22px !important}
    .sg-rail{width:7px !important}
    .sg-h1{font-size:26px !important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#F6F4EF;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your Korean skincare request is on our sourcing list.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F4EF;">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#FFFFFF;">
      <tr>
        <td class="sg-rail" width="10" style="width:10px;background:${NAVY};">&nbsp;</td>
        <td class="sg-pad" style="padding:38px 40px;">
          <p style="margin:0;font-family:${SANS};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};">Skin Grocer · Sourcing desk</p>
          <div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>
          <h1 class="sg-h1" style="margin:0;font-family:${SERIF};font-weight:400;font-size:32px;line-height:1.15;color:${NAVY};">Request received.</h1>
          <div style="height:8px;line-height:8px;font-size:0;">&nbsp;</div>
          <div style="width:54px;height:2px;background:${GOLD};"></div>
          <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
          <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.65;color:${INK};">${esc(greeting)}</p>
          <div style="height:10px;line-height:10px;font-size:0;">&nbsp;</div>
          <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.65;color:${INK};">
            Thank you — we've added your request to our sourcing list. Our buyer reviews these weekly against what's
            ranking in Korea and what we can land in Melbourne.
          </p>
          <div style="height:26px;line-height:26px;font-size:0;">&nbsp;</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${RULE};border-bottom:1px solid ${RULE};">
            <tr><td style="padding:18px 0;">
              <p style="margin:0;font-family:${SANS};font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:${MUTED};">You asked for</p>
              <div style="height:6px;line-height:6px;font-size:0;">&nbsp;</div>
              <p style="margin:0;font-family:${SERIF};font-size:19px;line-height:1.35;color:${NAVY};">${esc(product)}</p>
              ${
                data.note
                  ? `<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
                     <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.6;color:${MUTED};">&ldquo;${esc(
                       data.note,
                     )}&rdquo;</p>`
                  : ''
              }
            </td></tr>
          </table>
          <div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
          <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.65;color:${INK};">
            If it lands, we'll email this address first — before it goes on general sale. If we can't source it, we'll
            tell you that too rather than leave you waiting.
          </p>
          <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
          <a href="${SITE_URL}/shop" style="display:inline-block;background:${NAVY};color:#FFFFFF;text-decoration:none;font-family:${SANS};font-size:11px;letter-spacing:2.4px;text-transform:uppercase;padding:14px 28px;">Shop what's in stock</a>
          <div style="height:30px;line-height:30px;font-size:0;">&nbsp;</div>
          <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.7;color:${MUTED};">
            Questions? Reply to this email or write to
            <a href="mailto:${SUPPORT_EMAIL}" style="color:${NAVY};">${SUPPORT_EMAIL}</a>.<br />
            Skin Grocer · Epping, Victoria · Seoul Sourced. Skin Assured.
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = [
    'SKIN GROCER — SOURCING DESK',
    '',
    'Request received.',
    '',
    data.name ? `${data.name},` : 'Hello,',
    '',
    "Thank you — we've added your request to our sourcing list. Our buyer reviews these weekly against what's ranking in Korea and what we can land in Melbourne.",
    '',
    `You asked for: ${product}`,
    data.note ? `Your note: "${data.note}"` : '',
    '',
    "If it lands, we'll email this address first — before it goes on general sale. If we can't source it, we'll tell you that too.",
    '',
    `Shop what's in stock: ${SITE_URL}/shop`,
    `Questions: ${SUPPORT_EMAIL}`,
    'Skin Grocer · Epping, Victoria · Seoul Sourced. Skin Assured.',
  ]
    .filter((l) => l !== '')
    .join('\n');

  return { subject, html, text };
}
