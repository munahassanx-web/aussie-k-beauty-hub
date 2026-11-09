import { BRAND_PALETTE } from '@/lib/brand-palette';
import {
  ROUTINE_ORDER_LABELS,
  sortByRoutineOrder,
  type ProductGuide,
} from '@/lib/application-guides';

// Renders the "Your routine, in order" block for the order confirmation email.
// Pass the guides matched to the products in a specific order — they are sorted
// into the correct application sequence (1 cleanse → 6 SPF) automatically.
export function renderOrderRoutineHtml(guides: ProductGuide[], siteUrl = ''): string {
  const steps = sortByRoutineOrder(guides);
  if (steps.length === 0) return '';

  const rows = steps
    .map((g, i) => {
      const meta = [
        g.amount_to_use && `<strong>Amount:</strong> ${escapeHtml(g.amount_to_use)}`,
        g.how_to_apply && `<strong>How:</strong> ${escapeHtml(g.how_to_apply)}`,
        g.frequency && `<strong>When:</strong> ${escapeHtml(g.frequency)}`,
      ]
        .filter(Boolean)
        .join('<br />');

      return `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid ${BRAND_PALETTE.silver};">
          <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${BRAND_PALETTE.muted};">
            Step ${i + 1} · ${escapeHtml(ROUTINE_ORDER_LABELS[g.routine_order] ?? g.routine_step)}
          </p>
          <p style="margin:4px 0 0;font-size:16px;color:${BRAND_PALETTE.ink};">
            ${escapeHtml(g.brand)} — ${escapeHtml(g.name)}
          </p>
          <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:${BRAND_PALETTE.muted};">${meta}</p>
          ${
            siteUrl
              ? `<p style="margin:8px 0 0;font-size:12px;"><a href="${siteUrl}/guide/${encodeURIComponent(
                  g.id,
                )}" style="color:${BRAND_PALETTE.navy};">Read the full guide</a></p>`
              : ''
          }
        </td>
      </tr>`;
    })
    .join('');

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;">
    <tr><td>
      <h2 style="margin:0 0 4px;font-size:22px;color:${BRAND_PALETTE.ink};">Your routine, in order</h2>
      <p style="margin:0 0 8px;font-size:14px;color:${BRAND_PALETTE.muted};">
        Use your new products in this sequence — cleanse first, SPF last.
      </p>
    </td></tr>
    ${rows}
  </table>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
