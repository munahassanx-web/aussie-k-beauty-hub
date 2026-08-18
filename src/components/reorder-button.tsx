import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { priceToCents, type ShopProduct } from '@/lib/shop-catalog';

/**
 * Adds products to the bag at their CURRENT catalog price. Unavailable SKUs are
 * never silently swapped — the caller filters them out and the confirmation
 * states exactly what was added.
 */
export function useReorder() {
  const cart = useCart();
  const [confirmation, setConfirmation] = useState<string | null>(null);

  function addProducts(products: ShopProduct[]) {
    const addable = products.filter((p) => !p.comingSoon);
    for (const p of addable) {
      cart.add({
        priceId: p.priceId,
        name: p.name,
        brand: p.brand,
        image: p.image,
        unitCents: priceToCents(p.price),
        recurring: false,
      });
    }
    const skipped = products.length - addable.length;
    if (addable.length === 0) {
      setConfirmation('Nothing was added — those products are not currently available.');
      return;
    }
    setConfirmation(
      `${addable.length} ${addable.length === 1 ? 'item' : 'items'} added at today's prices` +
        (skipped > 0 ? ` · ${skipped} unavailable and skipped` : ''),
    );
  }

  return { addProducts, confirmation, clearConfirmation: () => setConfirmation(null) };
}

export function ReorderConfirmation({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className="mt-4 border-l-2 border-primary bg-secondary/40 px-4 py-3 text-sm text-foreground"
    >
      {message}
    </p>
  );
}
