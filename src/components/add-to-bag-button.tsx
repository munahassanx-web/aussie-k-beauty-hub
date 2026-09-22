import { useEffect, useRef, useState } from 'react';
import { useBuyNow } from '@/hooks/use-buy-now';
import { useCart } from '@/lib/cart';
import { isPurchasable } from '@/lib/shop-catalog';
import { Button } from '@/components/ui/button';

type Props = {
  priceId: string;
  name: string;
  priceLabel: string;
  className?: string;
  unavailable?: boolean;
  accessibleName?: string;
};

/**
 * Add-to-bag CTA. Disabled until the cart has hydrated from storage so the
 * first click always registers exactly one unit, and guarded against rapid
 * double-clicks while the "Added to bag" confirmation is showing.
 */
export function AddToBagButton({
  priceId,
  name,
  priceLabel,
  className,
  unavailable = false,
  accessibleName,
}: Props) {
  const { buy } = useBuyNow();
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Central safeguard: anything not lawfully sellable right now — including a
  // sunscreen without a complete Australian compliance record — never renders
  // a working buy control, wherever the button is used.
  const catalogSellable = isPurchasable(priceId);
  const sellable = catalogSellable && !unavailable;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleClick() {
    if (!sellable || !cart.ready || loading || added) return;
    setLoading(true);
    window.setTimeout(() => {
      const didAdd = buy({ priceId, name, priceLabel });
      setLoading(false);
      if (!didAdd) return;
      setAdded(true);
    }, 150);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  }

  if (!catalogSellable) return null;

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={!sellable || !cart.ready || loading || added}
      aria-label={accessibleName ?? `Add ${name} to bag`}
      aria-busy={loading}
      className={className}
    >
      {unavailable ? (
        'Out of stock'
      ) : loading ? (
        'Adding…'
      ) : added ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span aria-hidden="true">✓</span> Added to bag
        </span>
      ) : (
        'Add to bag'
      )}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {added ? `${name} added to bag` : ''}
      </span>
    </Button>
  );
}
