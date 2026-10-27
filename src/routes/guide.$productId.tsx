import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchAllGuides } from '@/lib/application-guides';
import { trackGuideView, resolveSource } from '@/lib/guide-analytics';
import { buildGuide, resolveGuideParam, strictStoredMatch } from '@/lib/guide-content';
import { productSlug } from '@/lib/product-detail';
import { guideView } from '@/components/guide/guide-data';
import { GuideLookGlow } from '@/components/guide/guide-look-glow';
import { listSoldOutSkus } from '@/lib/inventory.functions';

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
  // Live inventory decides which buy buttons show. Never blocks the page: if
  // the lookup fails we fall back to the catalogue's own state.
  loader: async () => {
    let soldOut: string[] = [];
    try {
      soldOut = await listSoldOutSkus({ data: undefined as never });
    } catch {
      soldOut = [];
    }
    return { soldOut };
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
  const { soldOut } = Route.useLoaderData();

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
      <section className="mx-auto max-w-xl px-6 py-20">
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
            className="bg-primary px-6 py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground rounded-full"
          >
            Browse the shop
          </Link>
          <Link
            to="/contact"
            className="border border-border px-6 py-3 text-xs uppercase tracking-[0.16em] text-foreground rounded-full"
          >
            Contact us
          </Link>
        </div>
      </section>
    );
  }

  // Legacy DB rows may describe products we no longer stock — only an exact
  // brand+name match may enrich a current SKU.
  const match = stored ? strictStoredMatch(product, stored) : null;
  const view = guideView(product, buildGuide(product, match));
  return <GuideLookGlow view={view} soldOut={soldOut} />;
}
