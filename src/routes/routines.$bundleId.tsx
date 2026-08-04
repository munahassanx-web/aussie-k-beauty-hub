import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { trackGuideView, resolveSource } from '@/lib/guide-analytics';
import {
  fetchAllGuides,
  fetchBundleById,
  matchGuide,
  sortByRoutineOrder,
  ROUTINE_ORDER_LABELS,
  type ProductGuide,
} from '@/lib/application-guides';


export const Route = createFileRoute('/routines/$bundleId')({
  head: () => ({
    meta: [
      { title: 'Routine Kit — Skin Grocer' },
      {
        name: 'description',
        content:
          'A curated K-beauty routine kit from Skin Grocer, sorted into the correct application order with usage guidance for every step.',
      },
      { property: 'og:title', content: 'Routine Kit — Skin Grocer' },
      {
        property: 'og:description',
        content: 'Every product in this routine, in the order you should use it.',
      },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: BundlePage,
});

function BundlePage() {
  const { bundleId } = Route.useParams();
  const bundleQ = useQuery({
    queryKey: ['routine-bundle', bundleId],
    queryFn: () => fetchBundleById(bundleId),
    staleTime: 5 * 60_000,
  });
  const guidesQ = useQuery({
    queryKey: ['product-guides'],
    queryFn: fetchAllGuides,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    void trackGuideView({ bundleId, source: resolveSource('routine') });
  }, [bundleId]);


  const bundle = bundleQ.data;
  const guides = guidesQ.data ?? [];
  const steps: ProductGuide[] = bundle
    ? sortByRoutineOrder(
        bundle.product_names
          .map((n) => matchGuide(n, guides))
          .filter((g): g is ProductGuide => !!g)
          .filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i),
      )
    : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link to="/routines" className="text-xs uppercase tracking-[0.2em] text-primary">
        ← All routines
      </Link>

      {bundleQ.isLoading || guidesQ.isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading routine…</p>
      ) : !bundle ? (
        <h1 className="mt-6 font-display text-3xl text-foreground">Routine not found</h1>
      ) : (
        <>
          <h1 className="mt-4 text-5xl text-foreground">{bundle.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {bundle.description ??
              'Use these in order — cleanse first, protect last. Each step links to its full application guide.'}
          </p>

          <ol className="mt-12 space-y-4">
            {steps.map((g, i) => (
              <li key={g.id}>
                <Link
                  to="/guide/$productId"
                  params={{ productId: g.id }}
                  className="flex gap-5 rounded-2xl border border-border p-5 transition-colors hover:bg-secondary/60"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {ROUTINE_ORDER_LABELS[g.routine_order] ?? g.routine_step} · {g.brand}
                    </span>
                    <span className="mt-1 block font-display text-lg text-foreground">
                      {g.name}
                    </span>
                    {g.amount_to_use && (
                      <span className="mt-1.5 block text-sm text-muted-foreground">
                        {g.amount_to_use} · {g.frequency}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
