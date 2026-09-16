import { toast } from 'sonner';
import { useCart } from '@/lib/cart';
import {
  SHOP_PRODUCTS,
  catalogEntryFor,
  isPurchasable,
  priceToCents,
  supplierMatchPending,
} from '@/lib/shop-catalog';
import { useSoldOutSkus } from '@/hooks/use-stock';

export type BuyOptions = {
  priceId: string;
  name: string;
  priceLabel: string;
  brand?: string;
  image?: string;
  /** Open the cart drawer after adding. Defaults to true. */
  openCart?: boolean;
};

/**
 * Shared "add to basket" action used by every product, bundle and article CTA.
 * Resolves display data from the catalog so every entry point stays consistent,
 * and refuses anything that isn't actually chargeable (coming-soon or unknown SKUs).
 */
export function useBuyNow() {
  const cart = useCart();
  const { isSoldOut } = useSoldOutSkus();

  function buy(opts: BuyOptions): boolean {
    const entry = catalogEntryFor(opts.priceId);
    const product = SHOP_PRODUCTS.find((p) => p.priceId === opts.priceId);
    if (product && supplierMatchPending(product)) {
      // Not sold out and not arriving soon — the supply record is still being confirmed.
      toast.info(`${opts.name}: availability being confirmed. It can't be ordered right now.`);
      return false;
    }
    if (!entry || !isPurchasable(opts.priceId)) {
      toast.info(`${opts.name} isn't available to order yet — it lands in the Melbourne warehouse soon.`);
      return false;
    }
    if (isSoldOut(opts.priceId)) {
      toast.info(`${opts.name} is out of stock right now — we'll restock from Seoul shortly.`);
      return false;
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
    return true;
  }

  // Kept for call-site compatibility — the cart drawer now renders globally.
  return { buy, modal: null };
}
