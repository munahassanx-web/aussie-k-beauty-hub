import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { productSlug } from "@/lib/product-detail";
import { priceCents, productsForArticle } from "@/lib/learn-products";
import type { LearnArticle } from "@/lib/learn-articles";

/**
 * "Shop this article" — links each Learn piece to matching catalogue products
 * so readers can add the recommended items to their next order.
 */
export function ArticleProductPicks({ article }: { article: LearnArticle }) {
  const { add, setOpen } = useCart();
  const picks = productsForArticle(article);

  if (picks.length === 0) return null;

  return (
    <section className="mx-auto mt-20 max-w-6xl px-6">
      <div className="border-t border-foreground/15 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground">
          Shop this article
        </p>
        <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
          In-stock in our Melbourne warehouse — order by 12pm and it&rsquo;s on your doorstep
          tomorrow across metro Australia.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((p) => (
            <div key={p.priceId} className="flex h-full flex-col">
              <Link
                to="/product/$slug"
                params={{ slug: productSlug(p) }}
                className="group block overflow-hidden rounded-2xl bg-secondary/50"
              >
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </Link>
              <Link
                to="/product/$slug"
                params={{ slug: productSlug(p) }}
                className="mt-4 block"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-clay">
                  {p.brand}
                </p>
                <h3 className="mt-2 font-display text-lg leading-tight text-foreground hover:text-primary">
                  {p.name}
                </h3>
              </Link>
              <p className="mt-2 flex-1 text-[13px] text-muted-foreground">{p.price} AUD</p>
              <button
                type="button"
                onClick={() => {
                  add({
                    priceId: p.priceId,
                    name: p.name,
                    brand: p.brand,
                    image: p.image,
                    unitCents: priceCents(p),
                    recurring: false,
                  });
                  setOpen(true);
                }}
                className="mt-4 rounded-full border border-foreground/25 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Add to order
              </button>
            </div>
          ))}
        </div>

        <Link
          to="/shop"
          className="mt-8 inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground underline underline-offset-4 hover:text-clay"
        >
          Browse the full range
        </Link>
      </div>
    </section>
  );
}
