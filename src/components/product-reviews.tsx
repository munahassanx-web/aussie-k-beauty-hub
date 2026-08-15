import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type ReviewRow = {
  id: string;
  rating: number;
  review_text: string | null;
  tags: string[] | null;
  created_at: string;
};

async function fetchReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, review_text, tags, created_at')
    .eq('product_id', productId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12);
  if (error) throw error;
  return (data ?? []) as unknown as ReviewRow[];
}

export function Stars({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-accent ${className}`} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < Math.round(n) ? 'currentColor' : 'none'} stroke="currentColor" className="h-4 w-4">
          <path strokeWidth="1.5" d="M10 2l2.4 5 5.6.8-4 4 1 5.6L10 14.8 5 17.4 6 11.8 2 7.8 7.6 7z" />
        </svg>
      ))}
    </span>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => fetchReviews(productId),
    staleTime: 5 * 60_000,
  });

  const reviews = data ?? [];
  const average =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section id="reviews" className="mt-14 border-t border-border pt-10">
      <h2 className="font-display text-2xl text-foreground">Reviews</h2>

      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-secondary/60 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Store rating</p>
          <div className="mt-2 flex items-center gap-3">
            <Stars n={5} />
            <p className="text-sm text-foreground">
              <span className="font-medium">4.9 / 5</span>{' '}
              <span className="text-muted-foreground">· 1,200+ verified customers</span>
            </p>
          </div>
        </div>
        {reviews.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">This product</p>
            <div className="mt-2 flex items-center gap-3">
              <Stars n={average} />
              <p className="text-sm text-foreground">
                <span className="font-medium">{average.toFixed(1)} / 5</span>{' '}
                <span className="text-muted-foreground">· {reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="mt-5 text-sm text-muted-foreground">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          No reviews for this product yet — verified reviews appear here as soon as customers who
          bought it leave one.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <figure key={r.id} className="rounded-2xl border border-border p-5">
              <Stars n={r.rating} />
              <blockquote className="mt-3 text-sm text-foreground/85">"{r.review_text}"</blockquote>
              <figcaption className="mt-3 text-xs text-muted-foreground">
                Verified Skin Grocer customer · {new Date(r.created_at).toLocaleDateString('en-AU')}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
