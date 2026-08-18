import { renderOrderConfirmation, type OrderEmailData } from '@/lib/email/order-emails.server';
import { SHOP_PRODUCTS } from '@/lib/shop-catalog';
const picks = SHOP_PRODUCTS.slice(0, 3);
const o: OrderEmailData = {
  id: 'test-v5-preview-0000-0000-000000000000',
  createdAt: new Date().toISOString(), currency: 'AUD',
  amountCents: 14900, shippingCents: 0, discountCents: 0,
  lines: picks.map((p, i) => ({ name: `TEST — ${p.name}`, quantity: i + 1, amountCents: 4900 * (i + 1), lookupKey: p.priceId })),
  shippingName: 'TEST Recipient', shippingLine1: '1 Test Street', shippingLine2: null,
  shippingCity: 'Melbourne', shippingState: 'VIC', shippingPostcode: '3000', shippingCountry: 'AU',
  shippingMethod: 'Australia Post', trackingNumber: null, shippingCarrier: null,
};
const { html } = renderOrderConfirmation(o);
await Bun.write('/tmp/browser/v5/email.html', html.replaceAll('https://skingrocer.com.au/email/', 'http://localhost:8080/email/'));
console.log('ok');
