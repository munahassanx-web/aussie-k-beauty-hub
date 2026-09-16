import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { brandBadgeFor } from '@/lib/brand-review-badges';
import {
  getReviewEligibility,
  listProductReviews,
  submitReview,
  type PublicReview,
} from '@/lib/reviews.functions';

const SKIN_TYPE_LABELS: Record<string, string> = {
  dry: 'Dry skin',
  oily: 'Oily skin',
  combination: 'Combination skin',
  balanced: 'Balanced skin',
  unspecified: '',
};

const TIME_USED_LABELS: Record<string, string> = {
  first_impressions: 'First impressions',
  under_2_weeks: 'Used under 2 weeks',
  '2_6_weeks': 'Used 2–6 weeks',
  over_6_weeks: 'Used over 6 weeks',
};

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

/** Star rating published on the brand's own website — clearly separated from Skin Grocer customer reviews. */
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

/** Keyboard-operable 1–5 star control. Rating is also stated in words, never colour alone. */
function RatingInput({ value, onChange, describedBy }: { value: number; onChange: (n: number) => void; describedBy?: string }) {
  return (
    <div>
      <div role="radiogroup" aria-label="Your rating" aria-describedby={describedBy} className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} out of 5 stars`}
            onClick={() => onChange(n)}
            className={`rounded-full border px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              value === n ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground'
            }`}
          >
            {n} ★
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Selected: {value} out of 5 stars</p>
    </div>
  );
}

function ReviewForm({
  productId,
  productName,
  brand,
  onDone,
}: {
  productId: string;
  productName: string;
  brand: string;
  onDone: () => void;
}) {
  const send = useServerFn(submitReview);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [skinType, setSkinType] = useState('');
  const [timeUsed, setTimeUsed] = useState('');
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const submit = useMutation({
    mutationFn: () =>
      send({
        data: {
          productId,
          productName,
          brand,
          rating,
          reviewText: text,
          title,
          skinType: skinType || undefined,
          timeUsed: timeUsed || undefined,
          customerName: name,
        },
      }),
    onSuccess: onDone,
    onError: (e: unknown) => setError(e instanceof Error ? e.message : 'We could not submit your review. Please try again.'),
  });

  // Keep the written review if something goes wrong; only move focus to the message.
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const textInvalid = text.trim().length > 0 && text.trim().length < 30;

  return (
    <form
      className="mt-5 space-y-5 rounded-2xl border border-border p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        if (submit.isPending) return;
        submit.mutate();
      }}
    >
      <p className="text-sm text-muted-foreground">
        Describe your experience with the product's texture, application and place in your routine.
        Individual experiences vary. Please do not include medical diagnoses, private information or
        claims that a cosmetic product treats disease.
      </p>

      <fieldset>
        <legend className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Your rating (required)</legend>
        <RatingInput value={rating} onChange={setRating} />
      </fieldset>

      <div>
        <label htmlFor="review-title" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Review title (optional)
        </label>
        <input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="review-text" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Your review (required)
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          minLength={30}
          maxLength={2000}
          rows={5}
          aria-describedby="review-text-help"
          aria-invalid={textInvalid || undefined}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        />
        <p id="review-text-help" className="mt-1 text-xs text-muted-foreground" aria-live="polite">
          {text.trim().length} of 2,000 characters
          {textInvalid ? ' — please write at least 30 characters.' : ' (minimum 30).'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="review-skin" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Skin type (optional)
          </label>
          <select
            id="review-skin"
            value={skinType}
            onChange={(e) => setSkinType(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
          >
            <option value="">Prefer not to say</option>
            <option value="dry">Dry</option>
            <option value="oily">Oily</option>
            <option value="combination">Combination</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>
        <div>
          <label htmlFor="review-time" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Approximate time used (optional)
          </label>
          <select
            id="review-time"
            value={timeUsed}
            onChange={(e) => setTimeUsed(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
          >
            <option value="">Prefer not to say</option>
            <option value="first_impressions">First impressions</option>
            <option value="under_2_weeks">Under 2 weeks</option>
            <option value="2_6_weeks">2–6 weeks</option>
            <option value="over_6_weeks">Over 6 weeks</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="review-name" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Display name (shown publicly)
        </label>
        <input
          id="review-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={60}
          placeholder="e.g. Mia T."
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Your full name, email and order details are never published.
        </p>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        By submitting, you confirm this reflects your genuine experience. Reviews may be moderated for
        privacy, abuse, spam and prohibited medical claims, but will not be rejected merely because
        they are critical.
      </p>

      {error && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submit.isPending}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {submit.isPending ? 'Submitting…' : 'Submit review'}
        </button>
        <button type="button" onClick={onDone} className="text-sm text-muted-foreground underline">
          Cancel
        </button>
      </div>
    </form>
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
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLParagraphElement | null>(null);

  const eligibility = useQuery({
    queryKey: ['review-eligibility', productId, user?.id],
    queryFn: () => checkEligibility({ data: { productId, productName, brand } }),
    enabled: Boolean(user),
    retry: false,
  });

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  if (loading) return null;

  if (!user) return <SignInToReview />;

  if (submitted) {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="mt-5 rounded-2xl border border-border bg-secondary/60 p-5 text-sm text-foreground"
      >
        Thank you — your review has been received and is pending moderation. It will appear here once
        it has been checked.
      </p>
    );
  }

  const data = eligibility.data;
  if (eligibility.isLoading || !data) return null;

  if (data.alreadySubmitted) {
    return (
      <p className="mt-5 text-sm text-muted-foreground">
        {data.pending
          ? 'Thanks — your review is pending moderation and will appear here once checked.'
          : 'Thanks for reviewing this product.'}
      </p>
    );
  }

  if (!data.eligible) {
    return (
      <div className="mt-5 rounded-2xl border border-border p-5">
        <p className="text-sm text-muted-foreground">
          No eligible purchase was found for this product. Reviews are available after your Skin
          Grocer order has been fulfilled.
        </p>
        <Link to="/account" className="mt-3 inline-block text-sm font-medium text-foreground underline">
          View my orders
        </Link>
      </div>
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
    <ReviewForm
      productId={productId}
      productName={productName}
      brand={brand}
      onDone={() => {
        setOpen(false);
        setSubmitted(true);
        void qc.invalidateQueries({ queryKey: ['review-eligibility', productId, user?.id] });
      }}
    />
  );
}

/** Signed-out CTA that returns the customer to this product's Reviews section. */
function SignInToReview() {
  const [href, setHref] = useState('/auth');
  useEffect(() => {
    const target = `${window.location.pathname}${window.location.search}#reviews`;
    setHref(`/auth?redirect=${encodeURIComponent(target)}`);
  }, []);
  return (
    <a
      href={href}
      className="mt-5 inline-block rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
    >
      Sign in to review a purchase
    </a>
  );
}

type Sort = 'recent' | 'highest' | 'lowest';

export function ProductReviews({
  productId,
  productName = '',
  brand = '',
}: {
  productId: string;
  productName?: string;
  brand?: string;
}) {
  const fetchReviews = useServerFn(listProductReviews);
  const [sort, setSort] = useState<Sort>('recent');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => fetchReviews({ data: { productId } }),
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const reviews = (data ?? []) as PublicReview[];
  const sorted = useMemo(() => {
    const list = [...reviews];
    if (sort === 'highest') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'lowest') list.sort((a, b) => a.rating - b.rating);
    else list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    return list;
  }, [reviews, sort]);

  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section id="reviews" className="mt-14 scroll-mt-24 border-t border-border pt-10">
      <h2 className="font-display text-2xl text-foreground">Reviews</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <BrandBadge productId={productId} />
        {count > 0 && (
          <div className="rounded-2xl border border-border bg-secondary/60 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Skin Grocer customers</p>
            <div className="mt-2 flex items-center gap-3">
              <Stars n={average} />
              <p className="text-sm text-foreground">
                <span className="font-medium">{average.toFixed(1)} / 5</span>{' '}
                <span className="text-muted-foreground">
                  · {count} approved review{count === 1 ? '' : 's'}
                </span>
              </p>
            </div>
            <dl className="mt-4 space-y-1">
              {distribution.map(({ star, n }) => (
                <div key={star} className="flex items-center gap-3 text-xs text-muted-foreground">
                  <dt className="w-16">{star} star{star === 1 ? '' : 's'}</dt>
                  <dd className="flex-1">
                    <span className="block h-1.5 rounded-full bg-border">
                      <span
                        className="block h-1.5 rounded-full bg-foreground"
                        style={{ width: `${count ? (n / count) * 100 : 0}%` }}
                      />
                    </span>
                  </dd>
                  <dd className="w-6 text-right tabular-nums">{n}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">
          Loading reviews…
        </p>
      ) : isError ? (
        <p className="mt-5 text-sm text-destructive" role="alert">
          Reviews are temporarily unavailable. Please try again later.
        </p>
      ) : count === 0 ? (
        <div className="mt-4 max-w-xl space-y-3">
          <p className="text-sm text-muted-foreground">
            Real customer reviews will appear here after verified Skin Grocer purchasers have had time
            to use this product.
          </p>
          <p className="text-sm text-muted-foreground">
            We publish genuine positive and critical experiences. Reviews are not written or edited by
            Skin Grocer.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-3">
            <label htmlFor="review-sort" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Sort
            </label>
            <select
              id="review-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="recent">Most recent</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {sorted.map((r) => (
              <figure key={r.id} className="rounded-2xl border border-border p-5">
                <Stars n={r.rating} />
                <p className="sr-only">{r.rating} out of 5 stars</p>
                {r.title && <p className="mt-3 font-medium text-foreground">{r.title}</p>}
                <blockquote className="mt-2 text-sm text-foreground/85">{r.review_text}</blockquote>
                <figcaption className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{r.customer_name ?? 'Skin Grocer customer'}</span>
                  <span>· {new Date(r.created_at).toLocaleDateString('en-AU')}</span>
                  {r.verified_purchase && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                      Verified Skin Grocer purchaser
                    </span>
                  )}
                  {r.skin_type && SKIN_TYPE_LABELS[r.skin_type] && <span>· {SKIN_TYPE_LABELS[r.skin_type]}</span>}
                  {r.time_used && TIME_USED_LABELS[r.time_used] && <span>· {TIME_USED_LABELS[r.time_used]}</span>}
                </figcaption>
                {r.response_text && (
                  <div className="mt-4 rounded-xl bg-secondary/60 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Response from Skin Grocer
                    </p>
                    <p className="mt-2 text-sm text-foreground/85">{r.response_text}</p>
                  </div>
                )}
              </figure>
            ))}
          </div>
        </>
      )}

      <WriteReview productId={productId} productName={productName} brand={brand} />
    </section>
  );
}
