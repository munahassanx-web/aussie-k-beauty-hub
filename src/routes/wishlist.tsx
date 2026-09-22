import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import { useWishlist } from '@/lib/wishlist';
import { useBuyNow } from '@/hooks/use-buy-now';
import { SHOP_PRODUCTS, availabilityLabelFor, supplierMatchPending } from '@/lib/shop-catalog';
import { supplyRestricted } from '@/lib/product-detail';
import { productSlug } from '@/lib/product-detail';
import { HeartIcon } from '@/components/wishlist-button';

export const Route = createFileRoute('/wishlist')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Your wishlist — Skin Grocer' },
      { name: 'description', content: 'The Korean skincare you saved for later — reorder, remove, or add straight to your basket.' },
      { property: 'og:title', content: 'Your wishlist — Skin Grocer' },
      { property: 'og:description', content: 'The Korean skincare you saved for later at Skin Grocer.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'robots', content: 'noindex, follow' },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids, loading, signedIn, remove } = useWishlist();
  const { buy } = useBuyNow();
  const [removing, setRemoving] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  async function handleRemove(priceId: string, label: string) {
    if (removing) return;
    setRemoving(priceId);
    try {
      await remove(priceId);
      setStatus(`${label} removed from your saved products`);
    } catch {
      setStatus(`Couldn't remove ${label} — please try again.`);
    } finally {
      setRemoving(null);
    }
  }


  const saved = useMemo(
    () => ids.map((id) => SHOP_PRODUCTS.find((p) => p.priceId === id)).filter(Boolean) as typeof SHOP_PRODUCTS,
    [ids],
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">Your account</p>
      <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Saved products</h1>
      <p className="mt-5 max-w-xl text-lg text-muted-foreground">
        Everything you've hearted, kept safely with your account so it's here next time you shop.
      </p>
      <p className="mt-3 max-w-xl text-base text-muted-foreground">
        Use Remove on any saved product to take it off this list straight away.
      </p>

      {!signedIn && !loading ? (
        <div className="mt-12 rounded-3xl border border-border bg-secondary/50 p-10 text-center">
          <p className="text-foreground">Sign in to see the products you've saved.</p>
          <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            Sign in
          </Link>
        </div>
      ) : loading ? (
        <p className="mt-12 text-muted-foreground">Loading your saved products…</p>
      ) : saved.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-border bg-secondary/50 p-10 text-center">
          <span className="inline-flex text-primary"><HeartIcon size={28} /></span>
          <p className="mt-3 text-foreground">Nothing saved yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to keep it here.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((p) => (
            <div key={p.priceId} className="group">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                <Link to="/product/$slug" params={{ slug: productSlug(p) }} aria-label={`View ${p.brand} ${p.name}`}>
                  <img src={p.image} alt={p.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                <Link to="/product/$slug" params={{ slug: productSlug(p) }} className="mt-1 block font-display text-lg text-foreground hover:text-primary">
                  {p.name}
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  {supplyRestricted(p) ? (
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Unavailable — Australian supply verification pending.
                    </span>
                  ) : supplierMatchPending(p) ? (
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {availabilityLabelFor(p)}
                    </span>
                  ) : (
                  <>
                  <span className="text-sm text-foreground">{p.price}</span>
                  {p.comingSoon ? (
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Arriving soon</span>
                  ) : (
                    <button
                      onClick={() => buy({ priceId: p.priceId, name: p.name, priceLabel: `${p.price} AUD` })}
                      className="text-xs font-medium uppercase tracking-wider text-primary hover:underline"
                    >
                      Add to bag →
                    </button>
                  )}
                   </>
                   )}
                 </div>
                 <button
                   type="button"
                   onClick={() => handleRemove(p.priceId, p.name)}
                   disabled={removing === p.priceId}
                   aria-label={`Remove ${p.brand} ${p.name} from saved products`}
                   className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-60"
                 >
                   {removing === p.priceId ? 'Removing…' : 'Remove'}
                 </button>
               </div>
             </div>
           ))}
         </div>
       )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">{status}</p>
     </div>
   );
}
