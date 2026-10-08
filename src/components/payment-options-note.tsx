import { formatAud } from '@/lib/cart';
import { AFTERPAY_ENABLED, WALLETS_ENABLED, afterpayInstalmentCents } from '@/lib/payment-options';

/** Fast-pay methods and the Afterpay instalment for the current total. */
export function PaymentOptionsNote({ totalCents, recurring = false }: { totalCents: number; recurring?: boolean }) {
  // Afterpay can't be used for subscriptions.
  const instalment = recurring ? null : afterpayInstalmentCents(totalCents);
  const methods = [
    ...(WALLETS_ENABLED ? ['Apple Pay', 'Google Pay'] : []),
    ...(AFTERPAY_ENABLED && !recurring ? ['Afterpay'] : []),
    'Card',
  ];

  return (
    <div className="mt-3 text-center">
      <ul aria-label="Ways to pay" className="flex flex-wrap items-center justify-center gap-1.5">
        {methods.map((m) => (
          <li
            key={m}
            className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-foreground"
          >
            {m}
          </li>
        ))}
      </ul>
      {instalment !== null && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          or 4 interest-free payments of <span className="text-foreground">{formatAud(instalment)}</span> with
          Afterpay · secure payment by Stripe
        </p>
      )}
    </div>
  );
}
