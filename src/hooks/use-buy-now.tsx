import { toast } from 'sonner';
import { useCart } from '@/lib/cart';
import { catalogEntryFor, isPurchasable, priceToCents } from '@/lib/shop-catalog';

export type BuyOptions = {
  priceId: string;
  name: string;
  priceLabel: string;
  brand?: string;
  image?: string;
};

/**
 * Shared "add to basket" action used by every product, bundle and article CTA.
 * Resolves display data from the catalog so every entry point stays consistent,
 * and refuses anything that isn't actually chargeable (coming-soon or unknown SKUs).
 */
export function useBuyNow() {
  const cart = useCart();

  function buy(opts: BuyOptions) {
    const entry = catalogEntryFor(opts.priceId);
    if (!entry || !isPurchasable(opts.priceId)) {
      toast.info(`${opts.name} isn't available to order yet — it lands in the Melbourne warehouse soon.`);
      return;
    }
    cart.add({
      priceId: opts.priceId,
      name: entry.name ?? opts.name,
      brand: entry.brand ?? opts.brand ?? 'Skin Grocer',
      image: entry.image ?? opts.image ?? '/favicon.ico',
      unitCents: entry.unitCents || priceToCents(opts.priceLabel),
      recurring: opts.priceId.startsWith('restock_') || opts.priceId.startsWith('circle_'),
    });
    cart.setOpen(true);
  }

  // Kept for call-site compatibility — the cart drawer now renders globally.
  return { buy, modal: null };
}
