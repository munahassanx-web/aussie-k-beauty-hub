import { renderOrderConfirmation } from '../src/lib/email/order-emails.server';
import { SHOP_PRODUCTS } from '../src/lib/shop-catalog';
const p = SHOP_PRODUCTS.slice(0, 3);
const html = renderOrderConfirmation({
  id: 'test0000-1111-2222-3333-444455556666',
  createdAt: new Date().toISOString(),
  currency: 'aud', amountCents: 18900, shippingCents: 0, discountCents: 1000,
  lines: p.map((x, i) => ({ name: x.name, quantity: i + 1, amountCents: 4900 * (i + 1), lookupKey: x.priceId })),
  shippingName: 'Muna Hasan', shippingLine1: '12 Example Street', shippingLine2: null,
  shippingCity: 'Melbourne', shippingState: 'VIC', shippingPostcode: '3000', shippingCountry: 'Australia',
  shippingMethod: 'Australia Post Express', trackingNumber: null, shippingCarrier: null,
}).html;
await Bun.write('/tmp/browser/v4/live.html', html);
await Bun.write('/tmp/browser/v4/local.html', html.replaceAll('https://skingrocer.com.au', 'http://localhost:8080'));
await Bun.write('/tmp/browser/v4/noimg.html', html.replaceAll('src="http', 'src="https://blocked.invalid/x?').replaceAll("url('https://skingrocer.com.au", "url('https://blocked.invalid/x?"));
