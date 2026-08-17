import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchAllGuides, matchGuide } from '@/lib/application-guides';
import { trackGuideView, resolveSource } from '@/lib/guide-analytics';
import {
  buildGuide,
  ROUTINE_LADDER,
  ladderIndexFor,
  resolveGuideParam,
} from '@/lib/guide-content';
import { productSlug } from '@/lib/product-detail';
import { productSize } from '@/components/product-card';

export const Route = createFileRoute('/guide/$productId')({
  // Legacy QR / price-id links resolve to the canonical, human-readable slug.
  beforeLoad: ({ params }) => {
    const product = resolveGuideParam(params.productId);
    if (product && productSlug(product) !== params.productId) {
      throw redirect({
        to: '/guide/$productId',
        params: { productId: productSlug(product) },
        replace: true,
      });
    }
  },
  head: ({ params }) => {
    const product = resolveGuideParam(params.productId);
    const url = `https://skingrocer.com.au/guide/${product ? productSlug(product) : params.productId}`;
    const title = product
      ? `How to apply — ${product.brand} ${product.name} | Skin Grocer`
      : 'How to apply — Skin Grocer';
    const description = product
      ? `Where ${product.brand} ${product.name} sits in your routine and how to apply it, step by step.`
      : 'Product application guides from Skin Grocer.';
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: GuidePage,
});

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{children}</p>
  );
}

function GuidePage() {
  const { productId } = Route.useParams();
  const product = resolveGuideParam(productId);

  // Optional enrichment: stored brand directions (amount / frequency / tip).
  const { data: stored } = useQuery({
    queryKey: ['stored-guides'],
    queryFn: fetchAllGuides,
    staleTime: 10 * 60_000,
    enabled: Boolean(product),
  });

  useEffect(() => {
    if (!product) return;
    void trackGuideView({ productId: productSlug(product), source: resolveSource('web') });
  }, [product]);

  if (!product) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20">
        <Label>How to apply</Label>
        <h1 className="mt-4 font-display text-3xl leading-tight text-foreground">
          We couldn’t match this code to a product
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The link may be mistyped, or the product may no longer be in our range. You can find every
          product and its guide in the shop, or send us the code and we’ll point you to the right
          instructions.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/shop"
            className="bg-primary px-6 py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground"
          >
            Browse the shop
          </Link>
          <Link
            to="/contact"
            className="border border-border px-6 py-3 text-xs uppercase tracking-[0.16em] text-foreground"
          >
            Contact us
          </Link>
        </div>
      </main>
    );
  }

  const match = stored ? matchGuide(`${product.brand} ${product.name}`, stored) : null;
  const guide = buildGuide(product, match);
  const size = productSize(product);
  const ladderIndex = ladderIndexFor(product);
  const before = ladderIndex > 0 ? ROUTINE_LADDER[ladderIndex - 1] : undefined;
  const after =
    ladderIndex >= 0 && ladderIndex < ROUTINE_LADDER.length - 1
      ? ROUTINE_LADDER[ladderIndex + 1]
      : undefined;

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-10 sm:pt-14">
      {/* Identification — the first thing a scanning customer needs. */}
      <header>
        <Label>How to apply</Label>
        <div className="mt-5 flex items-start gap-5">
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            width={96}
            height={96}
            className="h-24 w-24 flex-none object-contain"
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mt-2 font-display text-[1.75rem] leading-[1.15] text-foreground sm:text-4xl">
              {product.name}
            </h1>
            {size && <p className="mt-2 text-sm text-muted-foreground">{size}</p>}
          </div>
        </div>
      </header>

      {/* Where it sits */}
      <section className="mt-10 border-t border-border pt-8">
        <Label>Where it sits</Label>
        <p className="mt-3 font-display text-xl text-foreground">{guide.routineStep}</p>
        {ladderIndex >= 0 ? (
          <ol className="mt-5 space-y-0 border-t border-border">
            {ROUTINE_LADDER.map((step, i) => {
              const current = i === ladderIndex;
              return (
                <li
                  key={step.category}
                  className={`flex items-baseline gap-4 border-b border-border py-3 text-sm ${
                    current ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  aria-current={current ? 'step' : undefined}
                >
                  <span className="w-6 text-[11px] tabular-nums">{i + 1}</span>
                  <span className={current ? 'font-medium' : ''}>{step.label}</span>
                  {current && (
                    <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-primary">
                      This product
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Used as a weekly treatment rather than a fixed daily step — apply after cleansing and
            toning, before your moisturiser.
          </p>
        )}
        {(before || after) && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {before ? `Comes after your ${before.label.toLowerCase()} step` : 'First step'}
            {after ? `, and before ${after.label.toLowerCase()}.` : '.'} This is the usual order for
            this type of product, not a claim about what else you own.
          </p>
        )}
      </section>

      {/* Directions */}
      <section className="mt-10 border-t border-border pt-8">
        <Label>{guide.stepsAreProductSpecific ? 'Directions' : 'General guidance'}</Label>
        {!guide.stepsAreProductSpecific && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We don’t yet have this product’s own written directions on file, so the steps below are
            general guidance for a {product.category.toLowerCase()} step. Always follow the
            directions printed on the carton, or{' '}
            <Link to="/contact" className="underline underline-offset-4 hover:text-foreground">
              ask us
            </Link>
            .
          </p>
        )}
        <ol className="mt-5 space-y-5">
          {guide.steps.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="font-display text-lg leading-none text-primary tabular-nums">
                {i + 1}
              </span>
              <span className="text-base leading-relaxed text-foreground/90">{step}</span>
            </li>
          ))}
        </ol>

        {(guide.amountToUse || guide.frequency) && (
          <dl className="mt-8 border-t border-border">
            {guide.amountToUse && (
              <div className="grid gap-1 border-b border-border py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Amount
                </dt>
                <dd className="text-base text-foreground">{guide.amountToUse}</dd>
              </div>
            )}
            {guide.frequency && (
              <div className="grid gap-1 border-b border-border py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  When
                </dt>
                <dd className="text-base text-foreground">{guide.frequency}</dd>
              </div>
            )}
          </dl>
        )}

        {guide.proTip && (
          <div className="mt-8 border-l-2 border-primary pl-5">
            <Label>Note</Label>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">{guide.proTip}</p>
          </div>
        )}
      </section>

      {/* Product details */}
      <section className="mt-10 border-t border-border pt-8">
        <Label>Full product details</Label>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Ingredients, texture notes and everything else about this product live on its product
          page.
        </p>
        <Link
          to="/product/$slug"
          params={{ slug: guide.slug }}
          className="mt-5 inline-flex border border-border px-6 py-3 text-xs uppercase tracking-[0.16em] text-foreground transition hover:bg-secondary"
        >
          View {product.brand} {product.name}
        </Link>
      </section>

      {/* Sourcing — informational only, no verification claim */}
      <section className="mt-10 border-t border-border pt-8">
        <Label>Sourcing</Label>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Skin Grocer sources through verified brand channels in Korea and holds stock in Melbourne.{' '}
          <Link to="/about" className="underline underline-offset-4 hover:text-foreground">
            How we source
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
