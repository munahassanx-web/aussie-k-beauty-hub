import { renderOrderConfirmation, renderDispatchNotice } from '@/lib/email/order-emails.server';
import { writeFileSync } from 'fs';
const base = {
  id: 'a1b2c3d4-1111-2222-3333-444455556666',
  createdAt: '2026-08-18T02:00:00Z',
  currency: 'aud', amountCents: 12400, shippingCents: 0, discountCents: 1000,
  lines: [
    { name: 'Dive In Serum', quantity: 1, amountCents: 3800, lookupKey: 'torriden_dive_in_serum_onetime' },
    { name: 'PDRN Pink Peptide Serum 30ml', quantity: 2, amountCents: 8000, lookupKey: 'medicube_pdrn_pink_peptide_serum_30ml_onetime' },
    { name: 'Mystery Sample', quantity: 1, amountCents: 1600, lookupKey: null },
  ],
  shippingName: 'Muna Hasan', shippingLine1: '12 Collins Street', shippingLine2: null,
  shippingCity: 'Melbourne', shippingState: 'VIC', shippingPostcode: '3000', shippingCountry: 'AU',
  shippingMethod: 'Standard', trackingNumber: 'ZZ1234567890AU', shippingCarrier: 'Australia Post',
};
const c = renderOrderConfirmation(base as any); const d = renderDispatchNotice(base as any);
writeFileSync('/tmp/browser/email/confirmation.html', c.html);
writeFileSync('/tmp/browser/email/dispatch.html', d.html);
console.log(c.subject, '|', d.subject, '| len', c.html.length, d.html.length);
