import type { AdminOrderDetail } from '@/lib/admin-orders.functions';

function money(cents: number, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format((cents ?? 0) / 100);
}

/**
 * Print-optimised warehouse document. Hidden on screen, shown on print via the
 * `print:` utilities — everything else on the page is hidden while printing.
 */
export function PackingSlip({ order }: { order: AdminOrderDetail }) {
  const address = [
    order.shippingName,
    order.shippingLine1,
    order.shippingLine2,
    [order.shippingCity, order.shippingState, order.shippingPostcode].filter(Boolean).join(' '),
    order.shippingCountry,
  ].filter(Boolean);

  return (
    <div id="packing-slip" className="hidden print:block print:text-black">
      <header className="flex items-start justify-between border-b border-black pb-4">
        <div>
          <p className="font-display text-2xl">SKIN GROCER</p>
          <p className="text-xs">Seoul Sourced. Skin Assured. · Dispatched from Melbourne, Australia</p>
        </div>
        <div className="text-right text-xs">
          <p>Order {order.id.slice(0, 8).toUpperCase()}</p>
          <p>{new Date(order.createdAt).toLocaleDateString('en-AU')}</p>
          <p>{order.isSubscriptionOrder ? 'Restock delivery' : 'One-off order'}</p>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-8 text-sm">
        <div>
          <p className="text-xs uppercase tracking-widest">Ship to</p>
          {address.length > 0 ? (
            address.map((line) => <p key={line}>{line}</p>)
          ) : (
            <p>No shipping address captured — contact customer.</p>
          )}
          {order.shippingPhone && <p>{order.shippingPhone}</p>}
          {order.customerEmail && <p>{order.customerEmail}</p>}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest">Handling</p>
          <p>Method: {order.shippingMethod ?? 'Standard'}</p>
          <p>Carrier: {order.shippingCarrier ?? 'To be assigned'}</p>
          <p>Service: {order.shippingService ?? '—'}</p>
          <p>Tracking: {order.trackingNumber ?? '—'}</p>
          {order.shipmentId && <p>Shipment: {order.shipmentId}</p>}
        </div>
      </section>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black">
            <th scope="col" className="py-2 w-10">✓</th>
            <th scope="col" className="py-2">Item</th>
            <th scope="col" className="py-2 w-16">Qty</th>
            <th scope="col" className="py-2 w-24 text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((l, i) => (
            <tr key={`${l.name}-${i}`} className="border-b border-black/30">
              <td className="py-3"><span className="inline-block h-4 w-4 border border-black" /></td>
              <td className="py-3">{l.name}</td>
              <td className="py-3">{l.quantity}</td>
              <td className="py-3 text-right">{money(l.amountCents, order.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right text-sm">
        <p>Shipping: {money(order.shippingCents, order.currency)}</p>
        {order.discountCents > 0 && <p>Discount: −{money(order.discountCents, order.currency)}</p>}
        <p className="font-semibold">Total paid: {money(order.amountCents, order.currency)}</p>
      </div>

      <section className="mt-8 border-t border-black pt-4 text-xs">
        <p className="uppercase tracking-widest">Pack checklist</p>
        <ul className="mt-2 space-y-1">
          {[
            'All products picked and checked against the list above',
            'Seals intact, batch codes legible, no damage',
            'How-to-Apply QR / order insert card included',
            'Packaging checked — void fill added, box sealed',
            order.trackingNumber
              ? `Shipping label attached (${order.shippingCarrier ?? 'carrier'} ${order.trackingNumber})`
              : 'Shipping label attached — write the tracking number on this slip',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-3 w-3 shrink-0 border border-black" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Packed by ____________________ · Date ____ / ____ / ______
        </p>
      </section>

      <footer className="mt-6 border-t border-black pt-4 text-xs">
        <p>Questions about this parcel: customercare@skingrocer.com.au</p>
      </footer>
    </div>
  );
}
