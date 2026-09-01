import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useBuyNow } from '@/hooks/use-buy-now';
import { WishlistButton } from '@/components/wishlist-button';
import { Maximize2 as ExpandIcon } from 'lucide-react';
import { ImageLightbox } from '@/components/image-lightbox';
import { IngredientPanel } from '@/components/ingredient-panel';
import { ProductAccordion } from '@/components/product-accordion';
import { ProductCard, productSize } from '@/components/product-card';

import { ProductReviews } from '@/components/product-reviews';
import { FaqSection } from '@/components/faq-section';
import { productFaqs, faqJsonLd } from '@/lib/faqs';
import { track } from '@/lib/analytics';

import { productPrice, type ShopProduct } from '@/lib/shop-catalog';
import { breadcrumbJsonLd } from '@/lib/breadcrumbs';
import { listSoldOutSkus } from '@/lib/inventory.functions';
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
  hasSourcedCosmeticRole,
  USAGE_CAUTION,
  SUITABILITY_CAUTION,
} from '@/lib/product-detail';


function absoluteProductImage(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `https://skingrocer.com.au${src}`;
}

function productJsonLd(p: ShopProduct, soldOut: boolean) {
  const numericPrice = productPrice(p);
  const productUrl = `https://skingrocer.com.au/product/${productSlug(p)}`;
  const imageUrl = absoluteProductImage(galleryFor(p)[0]?.src ?? p.image);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: imageUrl,
    brand: { '@type': 'Brand', name: p.brand },
    offers: {
      '@type': 'Offer',
      price: numericPrice.toFixed(2),
      priceCurrency: 'AUD',
      // Live warehouse state: a SKU is only advertised as InStock when it is
      // genuinely purchasable right now (not pre-launch, not sold out).
      availability:
        p.comingSoon || soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: productUrl,
    },
  };

  return {
    type: 'application/ld+json' as const,
    children: JSON.stringify(schema),
  };
}

export const Route = createFileRoute('/product/$slug')({
  head: ({ params, loaderData }: { params: { slug: string }; loaderData?: { soldOut?: string[] } }) => {
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
        { property: 'og:url', content: `https://skingrocer.com.au/product/${params.slug}` },
        ...(p
          ? [
              { property: 'og:image', content: absoluteProductImage(galleryFor(p)[0]?.src ?? p.image) },
              { name: 'twitter:image', content: absoluteProductImage(galleryFor(p)[0]?.src ?? p.image) },
            ]
          : []),
      ],
      links: [{ rel: 'canonical', href: `https://skingrocer.com.au/product/${params.slug}` }],
      scripts: p
        ? [
            faqJsonLd(
              productFaqs(p, {
                steps: howToUse(p),
                description: productDescription(p),
                usageNote: hasSourcedCosmeticRole(p) ? USAGE_CAUTION : undefined,
              }),
            ),

            productJsonLd(p, Boolean(loaderData?.soldOut?.includes(p.priceId))),
            // Home > Shop > [Brand] > [Product]. The brand step resolves to the
            // real /shop?brand=… filtered URL — there is no per-brand page.
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
              { name: p.brand, path: `/shop?brand=${encodeURIComponent(p.brand)}` },
              { name: p.name, path: `/product/${productSlug(p)}` },
            ]),
          ]
        : [],
    };
  },
  loader: async ({ params }) => {
    const product = findProductBySlug(params.slug);
    if (!product) throw notFound();
    // Live inventory drives Product schema availability. Never blocks the page:
    // if the lookup fails we fall back to the catalogue's own state.
    let soldOut: string[] = [];
    try {
      soldOut = await listSoldOutSkus({ data: undefined as never });
    } catch {
      soldOut = [];
    }
    return { soldOut };
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const gallery = product ? galleryFor(product) : [];
  const count = gallery.length;

  // view_item — non-PII catalogue data only.
  useEffect(() => {
    if (!product) return;
    track('view_item', {
      currency: 'AUD',
      value: productPrice(product),
      items: [
        {
          item_id: product.priceId,
          item_name: product.name,
          item_brand: product.brand,
          item_category: product.category,
          price: productPrice(product),
          quantity: 1,
        },
      ],
    });
  }, [product?.priceId]);


  useEffect(() => {
    setActive(0);
  }, [slug]);

  const step = (delta: number) => setActive((i) => (i + delta + count) % count);


  // Touch swipe: drag the stage horizontally to move between images.
  const stageRef = useRef<HTMLDivElement | null>(null);
  const swipeRef = useRef<{
    id: number;
    x: number;
    y: number;
    dx: number;
    axis: 'x' | 'y' | null;
  } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const swipedRef = useRef(false);

  const stageWidth = () => stageRef.current?.getBoundingClientRect().width ?? 1;
  const neighbor = dragX === 0 ? -1 : (active + (dragX < 0 ? 1 : -1) + count) % count;

  const onPointerDown = (e: React.PointerEvent) => {
    if (count < 2 || e.pointerType === 'mouse') return;
    swipeRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, axis: null };
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
      }
    }
    if (s.axis !== 'x') return;
    e.preventDefault();
    swipedRef.current = true;
    // Track the live delta in a ref too: pointerup can land in the same tick,
    // before the state update has been applied.
    s.dx = dx;
    setDragX(dx);
  };

  const endSwipe = () => {
    const s = swipeRef.current;
    swipeRef.current = null;
    setDragging(false);
    if (s?.axis === 'x') {
      const threshold = Math.min(80, stageWidth() * 0.18);
      if (s.dx <= -threshold) step(1);
      else if (s.dx >= threshold) step(-1);
    }

    setDragX(0);
  };


  const onKeyDown = (e: React.KeyboardEvent) => {
    if (count < 2) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(count - 1);
    }
  };

  const stripRef = useRef<HTMLDivElement | null>(null);

  const focusThumb = (i: number) => {
    setActive(i);
    const btn = stripRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[i];
    btn?.focus();
    btn?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const onStripKeyDown = (e: React.KeyboardEvent) => {
    if (count < 2) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusThumb((active + 1) % count);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusThumb((active - 1 + count) % count);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusThumb(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusThumb(count - 1);
    }
  };

  if (!product) return <ProductNotFound />;


  const ingredients = heroIngredients(product);
  const related = relatedProducts(product);
  const size = productSize(product);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground">
          Shop
        </Link>{' '}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        {/* Gallery — visitor-controlled only: arrows, thumbnails, swipe and
            arrow keys. No auto-advance. */}

        <div
          role="group"
          aria-roledescription="image gallery"
          aria-label={`${product.name} images`}
          tabIndex={0}
          onKeyDown={onKeyDown}

          className="lg:sticky lg:top-24 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <div
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endSwipe}
            onPointerCancel={endSwipe}
            style={{ touchAction: count > 1 ? 'pan-y' : undefined }}
            className="relative aspect-square touch-pan-y overflow-hidden bg-secondary"
          >
            {gallery.map((g, i) => {
              const isActive = i === active;
              const isNeighbor = dragging && i === neighbor;
              const visible = isActive || isNeighbor;
              const x = isActive ? dragX : dragX + (dragX < 0 ? stageWidth() : -stageWidth());
              return (
                <img
                  key={g.src}
                  src={g.src}
                  alt={g.alt}
                  width={1024}
                  height={1024}
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  aria-hidden={!isActive}
                  style={visible ? { transform: `translate3d(${x}px,0,0)` } : undefined}
                  className={`absolute inset-0 h-full w-full select-none object-contain p-8 sm:p-12 ${
                    prefersReducedMotion || dragging
                      ? ''
                      : 'transition-[opacity,transform] duration-700'
                  } ${visible ? 'opacity-100' : 'opacity-0'}`}
                />
              );
            })}


            {/* Click (or focus + Enter) anywhere on the stage to open the fullscreen viewer */}
            <button
              type="button"
              onClick={() => {
                // Ignore the click that ends a swipe gesture.
                if (swipedRef.current) {
                  swipedRef.current = false;
                  return;
                }
                setLightboxOpen(true);
              }}
              className="group absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >

              <span className="sr-only">
                Open fullscreen viewer for image {active + 1} of {count}
              </span>
              <span
                aria-hidden="true"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-border bg-background/85 text-muted-foreground transition-colors group-hover:text-foreground"
              >
                <ExpandIcon className="h-3.5 w-3.5" />
              </span>
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4">
              {gallery.map((g, i) => (
                <span
                  key={g.src}
                  className={`h-px transition-all duration-300 ${
                    i === active ? 'w-7 bg-foreground/70' : 'w-4 bg-foreground/25'
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
                  step(-1);
                }}
                aria-label="Previous image"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-border/70 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => {
                  step(1);
                }}
                aria-label="Next image"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border border-border/70 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                ›
              </button>
              <span className="ml-auto text-[10px] uppercase tracking-[0.2em] tabular-nums text-muted-foreground">
                {active + 1} / {count}
              </span>

              <span className="sr-only">Use the left and right arrow keys to move between images.</span>

            </div>
          )}


          {/* Thumbnail strip — roving tabindex: Tab enters the strip on the
              active thumb, then ← → Home End move focus and selection. */}
          {count > 1 && (
            <div
              ref={stripRef}
              role="tablist"
              aria-label={`${product.name} image thumbnails`}
              onKeyDown={onStripKeyDown}
              className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
            >
              {gallery.map((g, i) => (
                <button
                  key={g.src}
                  type="button"
                  role="tab"
                  id={`product-thumb-${i}`}
                  aria-selected={i === active}
                  aria-label={`Show image ${i + 1} of ${count}: ${g.alt}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => {
                    setActive(i);
                  }}
                  className={`relative h-[68px] w-[68px] shrink-0 snap-start overflow-hidden rounded-[2px] border bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    i === active ? 'border-foreground' : 'border-border/60 hover:border-foreground/40'
                  }`}
                >
                  <img
                    src={g.src}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}



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
        <div className="lg:pt-2">
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-3 font-display text-[2rem] leading-[1.1] text-foreground md:text-[2.5rem]">
            {product.name}
          </h1>

          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {routineStepLabel(product)}
            {size ? ` · ${size}` : ''}
          </p>

          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
            {productDescription(product)}
          </p>

          {productTexture(product) && (
            <p className="mt-4 text-sm text-foreground/85">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Texture ·{' '}
              </span>
              {productTexture(product)}
            </p>
          )}

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display text-2xl tabular-nums text-foreground">
                {product.price}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                AUD · incl. GST
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {product.comingSoon ? (
                <div className="rounded-[2px] border border-border px-6 py-5 text-center">
                  <p className="text-sm font-medium text-foreground">
                    Arriving soon · {product.price}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    On its way to our Melbourne warehouse. Not available to order yet.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() =>
                    buy({
                      priceId: product.priceId,
                      name: product.name,
                      priceLabel: `${product.price} AUD`,
                    })
                  }
                  className="min-h-14 w-full rounded-[2px] bg-foreground px-7 text-[11px] font-medium uppercase tracking-[0.24em] text-background transition-opacity hover:opacity-90"
                >
                  Add to bag
                </button>
              )}
              <WishlistButton
                variant="inline"
                productId={product.priceId}
                productName={`${product.brand} ${product.name}`}
              />
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Dispatched from our Melbourne warehouse · Free standard shipping over A$100 ·{' '}
              <Link to="/shipping-policy" className="underline underline-offset-4 hover:text-foreground">
                View shipping and returns
              </Link>
            </p>
            <Link
              to="/verify/sample"
              className="mt-3 inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              View how Skin Grocer verifies stock
            </Link>
          </div>
        </div>

      </div>

      {/* Details — vertically scannable, mobile-first */}
      <div className="mt-16 max-w-3xl">
        <ProductAccordion
          items={[
            {
              id: 'suits',
              title: 'Why it may suit you',
              defaultOpen: true,
              content: (
                <div className="space-y-5">
                  <ul className="space-y-2">
                    {productBenefits(product).map((b) => (
                      <li key={b} className="flex gap-3 text-sm text-foreground/85">
                        <span aria-hidden="true" className="text-primary">
                          —
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    {hasSourcedCosmeticRole(product)
                      ? SUITABILITY_CAUTION
                      : "Guidance only, based on the brand's stated formulation — not medical advice or a guaranteed outcome."}
                  </p>
                </div>
              ),
            },
            {
              id: 'how',
              title: 'How to use',
              defaultOpen: true,
              content: (
                <div>
                  <ol className="space-y-3">
                    {howToUse(product).map((stepText, i) => (
                      <li key={stepText} className="flex gap-4 text-sm text-foreground/85">
                        <span className="font-display text-primary">{i + 1}</span>
                        {stepText}
                      </li>
                    ))}
                  </ol>
                  {hasSourcedCosmeticRole(product) && (
                    <p className="mt-4 text-xs text-muted-foreground">{USAGE_CAUTION}</p>
                  )}

                  <Link
                    to="/guide/$productId"
                    params={{ productId: productSlug(product) }}
                    className="mt-5 inline-block text-xs uppercase tracking-wider text-primary hover:underline"
                  >
                    How to apply — open the full guide →
                  </Link>

                </div>
              ),
            },
            {
              id: 'ingredients',
              title: 'Key ingredients',
              content: (
                <div>
                  <IngredientPanel ingredients={ingredients} />
                  {productInci(product) ? (
                    <div className="mt-6 border-t border-border pt-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        Full ingredient list (INCI)
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {productInci(product)}
                      </p>
                      <p className="mt-3 text-[11px] text-muted-foreground">
                        Formulas can change without notice — always check the carton before use.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
                      Hero ingredients only. The full INCI list is printed on the carton of every
                      product we ship — ask us at customercare@skingrocer.com.au if you need it before you
                      buy.
                    </p>
                  )}
                </div>
              ),
            },
            {
              id: 'routine',
              title: 'Where it sits in a routine',
              content: (
                <div className="space-y-3 text-sm text-foreground/85">
                  <p>
                    {routineStepLabel(product)} — layer it in that order with the rest of your
                    routine.
                  </p>
                  <p className="text-muted-foreground">
                    Not sure how the steps stack up?{' '}
                    <Link to="/journey" className="underline underline-offset-4 hover:text-foreground">
                      See how a Korean routine layers
                    </Link>{' '}
                    or{' '}
                    <Link
                      to="/consultation"
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      take the 2-minute skin quiz
                    </Link>
                    .
                  </p>
                </div>
              ),
            },
            {
              id: 'authenticity',
              title: 'Authenticity & sourcing',
              content: (
                <div className="space-y-3 text-sm text-foreground/85">
                  <p>
                    Sourced through established Korean wholesale supply partners, documented by our
                    Melbourne team and locally stocked in Australia.
                  </p>
                  <p className="text-muted-foreground">
                    See the process and a sample verification record:{' '}
                    <Link
                      to="/verify/sample"
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      how Skin Grocer verifies stock
                    </Link>
                    .
                  </p>
                </div>
              ),
            },
            {
              id: 'shipping',
              title: 'Shipping & returns',
              content: (
                <div className="space-y-3 text-sm text-foreground/85">
                  <p>Dispatched from Melbourne. Free standard delivery on orders A$100 and over.</p>
                  <p className="text-muted-foreground">
                    Full details in our{' '}
                    <Link
                      to="/shipping-policy"
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      shipping policy
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/returns-policy"
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      returns policy
                    </Link>
                    .
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      <FaqSection
        id="product-faq"
        eyebrow="Product questions"
        title={`${product.brand} ${product.name} — questions people ask`}
        items={productFaqs(product, {
          steps: howToUse(product),
          description: productDescription(product),
        })}
      />

      <ProductReviews productId={product.priceId} productName={product.name} brand={product.brand} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl text-foreground">Pairs well with</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Same brand or built for the same concern.
          </p>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.priceId} product={r} compact />
            ))}
          </div>
        </section>
      )}

      {/* Mobile purchase bar — reuses the exact buy handler, price and availability above. */}
      {!product.comingSoon && (
        <>
          <div aria-hidden="true" className="h-20 lg:hidden" />
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
            <div className="flex items-center gap-4 px-4 py-3 pr-24">
              <div className="min-w-0">
                <p className="truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {product.brand}
                </p>
                <p className="text-sm tabular-nums text-foreground">{product.price}</p>
              </div>
              <button
                onClick={() =>
                  buy({
                    priceId: product.priceId,
                    name: product.name,
                    priceLabel: `${product.price} AUD`,
                  })
                }
                className="ml-auto min-h-12 flex-1 rounded-[2px] bg-foreground px-5 text-[11px] font-medium uppercase tracking-[0.22em] text-background"
              >
                Add to bag
              </button>
            </div>
          </div>
        </>
      )}
    </div>

  );
}
