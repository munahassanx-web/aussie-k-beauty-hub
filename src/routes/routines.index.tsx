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
        <p className="mt-12 text-sm text-muted-foreground">Loading routines…</p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((b) => (
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
