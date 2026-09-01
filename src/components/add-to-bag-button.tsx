import { useEffect, useRef, useState } from 'react';
import { useBuyNow } from '@/hooks/use-buy-now';
import { useCart } from '@/lib/cart';

type Props = {
  priceId: string;
  name: string;
  priceLabel: string;
  className?: string;
};

/**
 * Add-to-bag CTA. Disabled until the cart has hydrated from storage so the
 * first click always registers exactly one unit, and guarded against rapid
 * double-clicks while the "Added to bag" confirmation is showing.
 */
export function AddToBagButton({ priceId, name, priceLabel, className }: Props) {
  const { buy } = useBuyNow();
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleClick() {
    if (!cart.ready || added) return;
    buy({ priceId, name, priceLabel });
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!cart.ready}
      aria-live="polite"
      className={className}
    >
      {!cart.ready ? (
        'Loading…'
      ) : added ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span aria-hidden="true">✓</span> Added to bag
        </span>
      ) : (
        'Add to bag'
      )}
    </button>
  );
}
