import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchBundles } from '@/lib/application-guides';

export const Route = createFileRoute('/routines/')({
  head: () => ({
    meta: [
      { title: 'Routine Kits — Skin Grocer' },
      {
        name: 'description',
        content:
          'Curated K-beauty routine kits for hydration, brightening, sensitivity, pores, firming and sun protection — with step-by-step application guides.',
      },
      { property: 'og:title', content: 'Routine Kits — Skin Grocer' },
      {
        property: 'og:description',
        content: 'Curated K-beauty routines, built step by step.',
      },
      { property: 'og:url', content: 'https://skingrocer.com.au/routines' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: 'https://skingrocer.com.au/routines' }],
  }),
  component: RoutinesIndex,
});

function RoutinesIndex() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['routine-bundles'],
    queryFn: fetchBundles,
    staleTime: 5 * 60_000,
  });
  const bundles = data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">Routine kits</p>
      <h1 className="mt-3 max-w-2xl text-5xl text-foreground md:text-6xl">
        Routines, <em className="not-italic text-primary">built step by step.</em>
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Every kit is grouped by what your skin is actually asking for — and every product comes
        with its own application guide.
      </p>

      {isLoading ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl border border-border bg-secondary/40" />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-12 max-w-md">
          <p className="text-sm text-muted-foreground">
            We couldn't load the routine kits just now.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-full border border-foreground px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Try again
          </button>
        </div>
      ) : bundles.length === 0 ? (
        <div className="mt-12 max-w-md">
          <p className="text-sm text-muted-foreground">
            No routine kits are published yet. In the meantime, the Learn Hub covers routine order
            step by step.
          </p>
          <Link
            to="/learn/hub"
            className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary underline underline-offset-4"
          >
            Explore the Learn Hub →
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((b) => (
            <Link
              key={b.id}
              to="/routines/$bundleId"
              params={{ bundleId: b.id }}
              className="rounded-3xl border border-border p-7 transition-colors hover:bg-secondary/60"
            >
              <h2 className="font-display text-2xl text-foreground">{b.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {b.product_names.length} products in this routine
              </p>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-primary">
                View routine →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
