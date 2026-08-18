import { renderOrderConfirmation } from '/dev-server/src/lib/email/order-emails.server';
import { SHOP_PRODUCTS } from '/dev-server/src/lib/shop-catalog';
const p = SHOP_PRODUCTS.slice(0, 3);
const html = renderOrderConfirmation({
  id: 'test0000-0000-0000-0000-000000000000',
  createdAt: new Date().toISOString(),
  currency: 'aud', amountCents: 18700, shippingCents: 0, discountCents: 1500,
  lines: p.map((x, i) => ({ name: x.name, quantity: i === 1 ? 2 : 1, amountCents: 5900 + i * 1000, lookupKey: x.priceId })),
  shippingName: 'Muna Hasan', shippingLine1: '12 Flinders Lane', shippingLine2: null,
  shippingCity: 'Melbourne', shippingState: 'VIC', shippingPostcode: '3000', shippingCountry: 'Australia',
  shippingMethod: 'Australia Post Express', trackingNumber: null, shippingCarrier: null,
}).html.replaceAll('https://skingrocer.com.au', 'http://localhost:8080');
await Bun.write('/tmp/browser/v5/confirm.html', html);
console.log('ok', html.length);
