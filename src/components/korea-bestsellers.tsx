import { Link } from '@tanstack/react-router';

import { productSlug } from '@/lib/product-detail';
import {
  RANKING_SNAPSHOT_DATE,
  RANKING_SOURCE,
  RANKING_SOURCE_URL,
  STOCKED_RANKING,
} from '@/lib/korea-rankings';
import { koreanReview, REVIEW_SOURCE, REVIEW_SOURCE_URL } from '@/lib/korea-reviews';

const nf = new Intl.NumberFormat('en-AU');

/** How many ranked bestsellers to show in the compact top strip. */
const STRIP_COUNT = 6;

/**
 * Compact "Trending in Korea" strip pinned to the top of the shop — six of
 * this week's Hwahae-ranked bestsellers we hold in Melbourne, each with its
 * Korean rank and rating. Deliberately small so the shoppable grid stays
 * above the fold.
 */
export function KoreaBestsellers() {
  const strip = STOCKED_RANKING.slice(0, STRIP_COUNT);

  return (
    <section aria-labelledby="korea-bestsellers" className="border-b border-border pb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="korea-bestsellers" className="font-masthead text-xl leading-none text-foreground sm:text-2xl">
          Trending in Korea this week
          <span className="ml-3 align-middle text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
            화해 랭킹
          </span>
        </h2>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {RANKING_SOURCE} ·{' '}
          <a
            href={RANKING_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Hwahae
          </a>{' '}
          snapshot {RANKING_SNAPSHOT_DATE} — stocked in Melbourne now.
        </p>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {strip.map(({ entry, product }) => (
          <li key={product.priceId}>
            <Link
              to="/product/$slug"
              params={{ slug: productSlug(product) }}
              className="group block"
              aria-label={`${product.brand} ${product.name}, ranked ${entry.rank} in Korea`}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary p-3">
                <img
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute left-2 top-2 bg-foreground px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-background">
                  #{entry.rank}
                </span>
              </div>
              <p className="mt-2 truncate text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {product.brand}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-foreground group-hover:underline group-hover:underline-offset-4">
                {product.name}
              </p>
              <p className="mt-1 text-[10px] tabular-nums text-muted-foreground">
                {entry.rating.toFixed(2)} ★ · {nf.format(entry.reviews)} reviews
              </p>
              <p className="mt-0.5 text-xs tabular-nums text-foreground">{product.price}</p>
            </Link>

            {(() => {
              const review = koreanReview(product.priceId);
              if (!review) return null;
              return (
                <figure className="mt-2 border-l border-border pl-2.5">
                  <blockquote
                    lang="en"
                    className="line-clamp-4 text-[10px] leading-relaxed text-muted-foreground"
                  >
                    “{review.en}”
                  </blockquote>
                  <figcaption className="mt-1 text-[9px] leading-relaxed text-muted-foreground">
                    <span lang="ko">{review.author}</span>
                    {review.skinType ? ` · ${review.skinType}` : ''} ·{' '}
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noreferrer nofollow"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {REVIEW_SOURCE}
                    </a>
                  </figcaption>
                </figure>
              );
            })()}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[10px] leading-relaxed text-muted-foreground">
        Star ratings and review counts are Hwahae&rsquo;s published aggregates. The quotes are verbatim excerpts from
        real Korean shoppers&rsquo; reviews published on{' '}
        <a
          href={REVIEW_SOURCE_URL}
          target="_blank"
          rel="noreferrer nofollow"
          className="underline underline-offset-4 hover:text-foreground"
        >
          {REVIEW_SOURCE}
        </a>
        , translated into English — each one links back to the original.
      </p>
    </section>
  );
}
