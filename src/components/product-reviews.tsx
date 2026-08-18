import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { brandBadgeFor } from '@/lib/brand-review-badges';
import { getReviewEligibility, submitReview } from '@/lib/reviews.functions';

type ReviewRow = {
  id: string;
  rating: number;
  review_text: string | null;
  customer_name: string | null;
  verified_purchase: boolean | null;
  created_at: string;
};

async function fetchReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, review_text, customer_name, verified_purchase, created_at')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(12);
  if (error) throw error;
  return (data ?? []) as unknown as ReviewRow[];
}

export function Stars({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span role="img" className={`inline-flex gap-0.5 text-accent ${className}`} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < Math.round(n) ? 'currentColor' : 'none'} stroke="currentColor" className="h-4 w-4">
          <path strokeWidth="1.5" d="M10 2l2.4 5 5.6.8-4 4 1 5.6L10 14.8 5 17.4 6 11.8 2 7.8 7.6 7z" />
        </svg>
      ))}
    </span>
  );
}

/** Star rating published on the brand's own website — shown only where we could verify it. */
function BrandBadge({ productId }: { productId: string }) {
  const badge = brandBadgeFor(productId);
  if (!badge) return null;
  return (
    <div className="rounded-2xl border border-border bg-secondary/60 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Brand site rating</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {badge.rating != null && <Stars n={badge.rating} />}
        <p className="text-sm text-foreground">
          {badge.rating != null && <span className="font-medium">{badge.rating} / 5</span>}
          {badge.rating != null && badge.count != null && ' '}
          {badge.count != null && (
            <span className="text-muted-foreground">
              {badge.rating != null ? '· ' : ''}
              {badge.count.toLocaleString('en-AU')} reviews
            </span>
          )}
        </p>
      </div>
      <a
        href={badge.sourceUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-2 inline-block text-xs text-muted-foreground underline"
      >
        via {badge.sourceDomain}
      </a>
    </div>
  );
}

function WriteReview({
  productId,
  productName,
  brand,
}: {
  productId: string;
  productName: string;
  brand: string;
}) {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const checkEligibility = useServerFn(getReviewEligibility);
  const send = useServerFn(submitReview);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const eligibility = useQuery({
    queryKey: ['review-eligibility', productId, user?.id],
    queryFn: () => checkEligibility({ data: { productId, productName, brand } }),
    enabled: Boolean(user),
    retry: false,
  });

  const submit = useMutation({
    mutationFn: () =>
      send({ data: { productId, productName, brand, rating, reviewText: text, customerName: name } }),
    onSuccess: () => {
      setOpen(false);
      setText('');
      setError(null);
      void qc.invalidateQueries({ queryKey: ['review-eligibility', productId, user?.id] });
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : 'Could not submit review'),
  });

  if (loading) return null;
  if (!user) {
    return (
      <p className="mt-5 text-sm text-muted-foreground">
        Bought this? <a href="/auth" className="underline">Sign in</a> to write a review.
      </p>
    );
  }

  const data = eligibility.data;
  if (!data) return null;

  if (data.alreadySubmitted) {
    return (
      <p className="mt-5 text-sm text-muted-foreground">
        {data.pending
          ? 'Thanks — your review is pending approval and will appear here once checked.'
          : 'Thanks for reviewing this product.'}
      </p>
    );
  }

  if (!data.eligible) {
    return (
      <p className="mt-5 text-sm text-muted-foreground">
        Reviews are open to customers with a completed order containing this product.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
      >
        Write a review
      </button>
    );
  }

  return (
    <form
      className="mt-5 space-y-4 rounded-2xl border border-border p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        submit.mutate();
      }}
    >
      <div>
        <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Your rating</label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n === 1 ? '' : 's'}`}
              className={`rounded-full border px-3 py-1 text-sm ${rating === n ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="review-name" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Display name
        </label>
        <input
          id="review-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={60}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
          placeholder="e.g. Mia T."
        />
      </div>
      <div>
        <label htmlFor="review-text" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Your review
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
          placeholder="How did it work for your skin?"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submit.isPending}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {submit.isPending ? 'Submitting…' : 'Submit review'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground underline">
          Cancel
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Reviews are checked before they're published.
      </p>
    </form>
  );
}

export function ProductReviews({
  productId,
  productName = '',
  brand = '',
}: {
  productId: string;
  productName?: string;
  brand?: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => fetchReviews(productId),
    staleTime: 5 * 60_000,
  });

  const reviews = data ?? [];
  const average =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const badge = brandBadgeFor(productId);

  return (
    <section id="reviews" className="mt-14 border-t border-border pt-10">
      <h2 className="font-display text-2xl text-foreground">Reviews</h2>

      {(badge || reviews.length > 0) && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <BrandBadge productId={productId} />
          {reviews.length > 0 && (
            <div className="rounded-2xl border border-border bg-secondary/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Skin Grocer customers</p>
              <div className="mt-2 flex items-center gap-3">
                <Stars n={average} />
                <p className="text-sm text-foreground">
                  <span className="font-medium">{average.toFixed(1)} / 5</span>{' '}
                  <span className="text-muted-foreground">
                    · {reviews.length} review{reviews.length === 1 ? '' : 's'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <p className="mt-5 text-sm text-muted-foreground">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          No Skin Grocer reviews for this product yet — reviews appear here once customers who bought
          it leave one.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <figure key={r.id} className="rounded-2xl border border-border p-5">
              <Stars n={r.rating} />
              <blockquote className="mt-3 text-sm text-foreground/85">"{r.review_text}"</blockquote>
              <figcaption className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{r.customer_name ?? 'Skin Grocer customer'}</span>
                <span>· {new Date(r.created_at).toLocaleDateString('en-AU')}</span>
                {r.verified_purchase && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                    Verified Purchase
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <WriteReview productId={productId} productName={productName} brand={brand} />
    </section>
  );
}
