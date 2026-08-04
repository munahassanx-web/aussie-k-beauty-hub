import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchGuideById, bundleSlug } from '@/lib/application-guides';
import { trackGuideView, resolveSource } from '@/lib/guide-analytics';
import { ApplicationGuideDetails } from '@/components/application-guide';
import { PairsWellWith } from '@/components/pairs-well-with';
import { ProductIngredients } from '@/components/product-ingredients';


export const Route = createFileRoute('/guide/$productId')({
  head: () => ({
    meta: [
      { title: 'How to use — Skin Grocer' },
      {
        name: 'description',
        content:
          'Scan-to-read application guide: how much to use, how to apply, how often, and a pro tip from the Skin Grocer team.',
      },
      { property: 'og:title', content: 'How to use — Skin Grocer' },
      {
        property: 'og:description',
        content: 'Your step-by-step application guide for this product.',
      },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const { productId } = Route.useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product-guide', productId],
    queryFn: () => fetchGuideById(productId),
    staleTime: 5 * 60_000,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">How to use</p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading your guide…</p>
      ) : isError || !data ? (
        <div className="mt-6">
          <h1 className="font-display text-3xl text-foreground">Guide coming soon</h1>
          <p className="mt-3 text-muted-foreground">
            We couldn't find an application guide for this product yet.{' '}
            <Link to="/shop" className="text-primary underline">
              Browse the shop
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <h1 className="mt-3 font-display text-4xl text-foreground">{data.name}</h1>
          <p className="mt-1 text-sm uppercase tracking-wider text-muted-foreground">
            {data.brand}
          </p>

          <div className="mt-8">
            <ApplicationGuideDetails guide={data} />
          </div>

          <ProductIngredients productId={data.id} />

          <PairsWellWith guide={data} />

          {data.suggested_bundle && (
            <div className="mt-10 rounded-3xl bg-secondary/60 p-8 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Part of a routine
              </p>
              <h2 className="mt-2 font-display text-2xl text-foreground">
                {data.suggested_bundle}
              </h2>
              <Link
                to="/routines/$bundleId"
                params={{ bundleId: bundleSlug(data.suggested_bundle) }}
                className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                See the full routine
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
