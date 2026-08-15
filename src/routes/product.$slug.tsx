import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useBuyNow } from '@/hooks/use-buy-now';
import { Maximize2 as ExpandIcon } from 'lucide-react';
import { ImageLightbox } from '@/components/image-lightbox';
import { ProductReviews } from '@/components/product-reviews';

import { restockPriceIdFor } from '@/lib/shop-catalog';
import {
  findProductBySlug,
  galleryFor,
  heroIngredients,
  howToUse,
  productBenefits,
  productDescription,
  productInci,
  productSlug,
  productTexture,
  relatedProducts,
  routineStepLabel,
} from '@/lib/product-detail';

export const Route = createFileRoute('/product/$slug')({
  head: ({ params }) => {
    const p = findProductBySlug(params.slug);
    const title = p ? `${p.name} — ${p.brand} | Skin Grocer` : 'Product — Skin Grocer';
    const description = p
      ? `Buy ${p.brand} ${p.name} (${p.price} AUD) — authentic K-beauty stocked in Melbourne. Ingredients, how to use and reviews.`
      : 'Authentic Korean skincare, stocked in Melbourne.';
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'product' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    };
  },
  loader: ({ params }) => {
    if (!findProductBySlug(params.slug)) throw notFound();
    return null;
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground">Product not found</h1>
      <p className="mt-3 text-muted-foreground">
        That product isn't in our range.{' '}
        <Link to="/shop" className="text-primary underline">
          Browse the shop
        </Link>
        .
      </p>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function ProductPage() {
  const { slug } = Route.useParams();
  const product = findProductBySlug(slug);
  const { buy } = useBuyNow();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  // User-controlled play/pause; defaults to playing, but reduced-motion users start paused.
  const [userPaused, setUserPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);


  const gallery = product ? galleryFor(product) : [];
  const count = gallery.length;
  const playing = !hovered && !userPaused && !prefersReducedMotion && count > 1;

  useEffect(() => {
    setActive(0);
  }, [slug]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), 4500);
    return () => clearInterval(id);
  }, [playing, count, slug]);

  const step = (delta: number) => setActive((i) => (i + delta + count) % count);

  // Touch swipe: drag the stage horizontally to move between images.
  const stageRef = useRef<HTMLDivElement | null>(null);
  const swipeRef = useRef<{ id: number; x: number; y: number; axis: 'x' | 'y' | null } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const swipedRef = useRef(false);

  const stageWidth = () => stageRef.current?.getBoundingClientRect().width ?? 1;
  const neighbor = dragX === 0 ? -1 : (active + (dragX < 0 ? 1 : -1) + count) % count;

  const onPointerDown = (e: React.PointerEvent) => {
    if (count < 2 || e.pointerType === 'mouse') return;
    swipeRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: null };
    swipedRef.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = swipeRef.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!s.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      s.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (s.axis === 'x') {
        setDragging(true);
        setUserPaused(true);
      }
    }
    if (s.axis !== 'x') return;
    e.preventDefault();
    swipedRef.current = true;
    setDragX(dx);
  };

  const endSwipe = () => {
    const s = swipeRef.current;
    swipeRef.current = null;
    setDragging(false);
    if (s?.axis === 'x') {
      const threshold = Math.min(80, stageWidth() * 0.18);
      if (dragX <= -threshold) step(1);
      else if (dragX >= threshold) step(-1);
    }
    setDragX(0);
  };


  const onKeyDown = (e: React.KeyboardEvent) => {
    if (count < 2) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setUserPaused(true);
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setUserPaused(true);
      step(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setUserPaused(true);
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setUserPaused(true);
      setActive(count - 1);
    }
  };

  if (!product) return <ProductNotFound />;

  const ingredients = heroIngredients(product);
  const restockId = restockPriceIdFor(product.priceId);
  const related = relatedProducts(product);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground">
          Shop
        </Link>{' '}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        {/* Gallery — auto-rotates while you read; pauses on hover, on focus,
            when the visitor hits pause, or when they prefer reduced motion. */}
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={`${product.name} images`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className="rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary">
            {gallery.map((g, i) => (
              <img
                key={g.src}
                src={g.src}
                alt={g.alt}
                width={1024}
                height={1024}
                loading={i === 0 ? 'eager' : 'lazy'}
                aria-hidden={i !== active}
                className={`absolute inset-0 h-full w-full object-cover ${
                  prefersReducedMotion ? '' : 'transition-opacity duration-700'
                } ${i === active ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}

            {/* Click (or focus + Enter) anywhere on the stage to open the fullscreen viewer */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="sr-only">
                Open fullscreen viewer for image {active + 1} of {count}
              </span>
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/85 text-foreground backdrop-blur transition-colors group-hover:bg-background"
              >
                <ExpandIcon className="h-4 w-4" />
              </span>
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-1.5 p-4">
              {gallery.map((g, i) => (
                <span
                  key={g.src}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-foreground/70' : 'w-1.5 bg-foreground/25'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Announce the current slide to screen readers */}
          <p aria-live="polite" className="sr-only">
            {count > 0 ? `Image ${active + 1} of ${count}: ${gallery[active].alt}` : ''}
          </p>


          {count > 1 && (
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUserPaused(true);
                  step(-1);
                }}
                aria-label="Previous image"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserPaused(true);
                  step(1);
                }}
                aria-label="Next image"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
              >
                ›
              </button>
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-pressed={userPaused || prefersReducedMotion}
                className="ml-1 rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-secondary"
              >
                {userPaused || prefersReducedMotion ? 'Play slideshow' : 'Pause slideshow'}
              </button>
              <span className="ml-auto text-xs text-muted-foreground" aria-hidden="true">
                Use ← → keys
              </span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {gallery.map((g, i) => (
              <button
                key={g.src}
                onClick={() => {
                  setUserPaused(true);
                  setActive(i);
                }}
                aria-label={`View image ${i + 1} of ${count}`}
                aria-current={i === active}
                className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                  i === active ? 'border-primary' : 'border-transparent hover:border-border'
                }`}
              >
                <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <ImageLightbox
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
            images={gallery}
            index={active}
            onIndexChange={setActive}
            title={`${product.brand} ${product.name} — image viewer`}
          />
        </div>





        {/* Buy box */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.brand}</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{product.name}</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-primary">
            {routineStepLabel(product)}
          </p>
          <p className="mt-5 text-2xl text-foreground">{product.price} AUD</p>

          <p className="mt-5 text-muted-foreground">{productDescription(product)}</p>

          {productTexture(product) && (
            <p className="mt-4 text-sm text-foreground/85">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Texture ·{' '}
              </span>
              {productTexture(product)}
            </p>
          )}

          <ul className="mt-6 space-y-2">
            {productBenefits(product).map((b) => (
              <li key={b} className="flex gap-2 text-sm text-foreground/85">
                <span className="text-primary">—</span>
                {b}
              </li>
            ))}
          </ul>


          <div className="mt-8 space-y-3">
            <button
              onClick={() =>
                buy({ priceId: product.priceId, name: product.name, priceLabel: `${product.price} AUD` })
              }
              className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Add to basket · {product.price}
            </button>
            {restockId && (
              <button
                onClick={() =>
                  buy({ priceId: restockId, name: product.name, priceLabel: `${product.price} AUD` })
                }
                className="w-full rounded-full border border-border px-7 py-3 text-xs uppercase tracking-wider text-foreground hover:bg-secondary"
              >
                Subscribe & save 15%
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free shipping over A$80 · Melbourne metro next business day (order by 12pm AEST);
            regional and remote postcodes take 1–5 extra days.
          </p>
        </div>
      </div>

      {/* Ingredients */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">What's actually in this</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {ingredients.map((ing) => (
            <div key={ing.name} className="rounded-2xl border border-border bg-secondary/40 p-5">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className="font-display text-lg text-foreground">{ing.name}</p>
                {ing.korean && <p className="text-xs text-muted-foreground">{ing.korean}</p>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{ing.what}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ing.goodFor.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {productInci(product) ? (
          <details className="mt-6 rounded-2xl border border-border p-5">
            <summary className="cursor-pointer text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Full ingredient list (INCI)
            </summary>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {productInci(product)}
            </p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Formulas can change without notice — always check the carton before use.
            </p>
          </details>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            Hero ingredients only. The full INCI list is printed on the carton of every product we
            ship — ask us at hello@skingrocer.com.au if you need it before you buy.
          </p>
        )}

      </section>

      {/* How to use */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">How to use it</h2>
        <ol className="mt-5 space-y-3">
          {howToUse(product).map((step, i) => (
            <li key={step} className="flex gap-4 text-sm text-foreground/85">
              <span className="font-display text-primary">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <Link
          to="/guide/$productId"
          params={{ productId: product.priceId }}
          className="mt-5 inline-block text-xs uppercase tracking-wider text-primary hover:underline"
        >
          Full application guide →
        </Link>
      </section>

      <ProductReviews productId={product.priceId} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl text-foreground">Pairs well with</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.priceId}
                to="/product/$slug"
                params={{ slug: productSlug(r) }}
                className="group"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{r.brand}</p>
                <p className="mt-1 font-display text-base text-foreground">{r.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
