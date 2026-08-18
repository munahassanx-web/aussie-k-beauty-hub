import { useEffect, useRef, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { createProductCheckout } from '@/lib/loyalty.functions';
import { ProductIngredients } from '@/components/product-ingredients';
import { ProductGuideSection } from '@/components/product-guide-section';


export type ProductCheckoutOptions = {
  priceId: string;
  quantity?: number;
  name: string;
  priceLabel: string;
  pointsBalance?: number;
};

export function ProductCheckout({
  options,
  onClose,
}: {
  options: ProductCheckoutOptions;
  onClose: () => void;
}) {
  const [redeem, setRedeem] = useState(0);
  const [started, setStarted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes the dialog; background scroll stays locked while open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const maxRedeem = Math.floor((options.pointsBalance ?? 0) / 100) * 100;
  const canRedeem = maxRedeem >= 100;

  const fetchClientSecret = async (): Promise<string> => {
    const result = await createProductCheckout({
      data: {
        priceId: options.priceId,
        quantity: options.quantity,
        redeemPoints: redeem,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/club?checkout=success`,
      },
    });
    if ('error' in result) throw new Error(result.error);
    return result.clientSecret;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur">
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-checkout-title"
        className="my-8 w-full max-w-2xl rounded-2xl bg-background p-6 shadow-2xl outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 id="product-checkout-title" className="font-display text-xl text-foreground">{options.name}</h3>
            <p className="text-sm text-muted-foreground">{options.priceLabel}</p>
          </div>
          <button onClick={onClose} aria-label="Close checkout" className="min-h-11 px-2 text-sm text-muted-foreground hover:text-foreground">
            Close ✕
          </button>
        </div>

        {!started && <ProductIngredients productId={options.priceId} />}
        {!started && <ProductGuideSection reference={options.name} />}


        {!started ? (
          <div className="space-y-4">
            {canRedeem ? (
              <div className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium text-foreground">Redeem points</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  You have {options.pointsBalance} points. 100 pts = A$5 off.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setRedeem(0)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${redeem === 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-secondary'}`}
                  >
                    No thanks
                  </button>
                  {[100, 200, 500, 1000, maxRedeem]
                    .filter((v, i, a) => v <= maxRedeem && a.indexOf(v) === i && v >= 100)
                    .map((v) => (
                      <button
                        key={v}
                        onClick={() => setRedeem(v)}
                        className={`rounded-full border px-3 py-1.5 text-xs ${redeem === v ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-secondary'}`}
                      >
                        Use {v} pts (−A${(v / 100) * 5})
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              options.pointsBalance !== undefined && (
                <p className="text-xs text-muted-foreground">
                  You have {options.pointsBalance} points. Earn 100+ to unlock rewards at checkout.
                </p>
              )
            )}
            <button
              onClick={() => setStarted(true)}
              className="w-full rounded-full bg-primary py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:opacity-90"
            >
              Continue to payment
            </button>
          </div>
        ) : (
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  );
}
