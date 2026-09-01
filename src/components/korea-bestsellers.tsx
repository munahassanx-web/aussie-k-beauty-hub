import { useRef, useState, type UIEvent } from 'react';
import { Link } from '@tanstack/react-router';

import { productSlug } from '@/lib/product-detail';
import { SHOP_PRODUCTS, type ShopProduct } from '@/lib/shop-catalog';

const nf = new Intl.NumberFormat('en-AU');

const HWAHAE_URL = 'https://www.hwahae.com/en/rankings/global';

type SnapshotEntry = {
  rank: number;
  priceId: string;
  /** Hwahae community rating out of 5, at the snapshot date. */
  rating: number;
  /** Number of Hwahae reviews behind that rating. */
  reviews: number;
  /** Restrained editorial summary — not a customer quotation. */
  radar: string;
};

/**
 * Hwahae Global Trending Ranking snapshot, checked 31 August 2026.
 * Rankings, ratings and review totals are Hwahae's published figures at
 * that date and can change; only products we hold in Melbourne are listed.
 */
const SNAPSHOT: SnapshotEntry[] = [
  {
    rank: 1,
    priceId: 'aestura_atobarrier365_cream_onetime',
    rating: 4.68,
    reviews: 18243,
    radar: 'A richer moisturising cream frequently discussed for dryness and barrier-focused routines.',
  },
  {
    rank: 2,
    priceId: 'beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime',
    rating: 4.63,
    reviews: 50369,
    radar: 'A low-pH cleansing foam known for its mung-bean formula and comfortable daily-cleansing format.',
  },
  {
    rank: 3,
    priceId: 'torriden_dive_in_serum_onetime',
    rating: 4.61,
    reviews: 85572,
    radar: 'A lightweight hydrating serum commonly chosen by customers who dislike heavy or sticky textures.',
  },
  {
    rank: 9,
    priceId: 's_nature_aqua_oasis_toner_onetime',
    rating: 4.75,
    reviews: 28657,
    radar: 'A layerable hydrating toner with a light format suited to simple routines.',
  },
  {
    rank: 10,
    priceId: 's_nature_aqua_squalane_moisturizing_cream_onetime',
    rating: 4.58,
    reviews: 43078,
    radar: 'A lighter moisturising option for customers who find rich creams uncomfortable.',
  },
  {
    rank: 14,
    priceId: 'wellage_real_hyaluronic_soothing_cream_80ml_onetime',
    rating: 4.64,
    reviews: 3867,
    radar: 'A gel-cream style moisturiser selected for lightweight hydration.',
  },
];

const BY_PRICE_ID = new Map(SHOP_PRODUCTS.map((p) => [p.priceId, p]));

const CARDS: Array<{ entry: SnapshotEntry; product: ShopProduct }> = SNAPSHOT.flatMap((entry) => {
  const product = BY_PRICE_ID.get(entry.priceId);
  return product ? [{ entry, product }] : [];
});

/**
 * Compact "Korean-market signals" strip pinned to the top of the shop — a
 * dated Hwahae Global Trending Ranking snapshot limited to products we hold
 * in Melbourne. Six compact cards: a horizontal row on desktop, a swipeable
 * track with position indicators on mobile. No autoplay.
 */
export function KoreaBestsellers() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = (e: UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const card = el.querySelector('li');
    if (!card) return;
    const step = card.clientWidth + 16;
    setActive(Math.min(CARDS.length - 1, Math.round(el.scrollLeft / step)));
  };

  return (
    <section aria-labelledby="korea-market-signals" className="border-b border-border pb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="korea-market-signals" className="font-masthead text-xl leading-none text-foreground sm:text-2xl">
          Korean-market signals
          <span className="ml-3 align-middle text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
            화해 랭킹
          </span>
        </h2>
      </div>

      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        A dated snapshot of stocked products appearing in Hwahae&rsquo;s Global Trending Ranking. Rankings and review
        totals can change.
      </p>
      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
        Source:{' '}
        <a
          href={HWAHAE_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Hwahae Global
        </a>{' '}
        · Snapshot: 31 August 2026
      </p>

      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:snap-none lg:grid-cols-6 lg:gap-x-5 lg:overflow-visible lg:pb-0"
      >
        {CARDS.map(({ entry, product }) => (
          <li key={product.priceId} className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
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
                {entry.rating.toFixed(2)} ★ · {nf.format(entry.reviews)} Hwahae reviews
              </p>
              <p className="mt-0.5 text-xs tabular-nums text-foreground">
                Skin Grocer price: {product.price.replace('$', 'A$')}
              </p>
            </Link>
            <div className="mt-2 border-l border-border pl-2.5">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Why it is on our radar
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{entry.radar}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-center gap-2 lg:hidden" aria-hidden="true">
        {CARDS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === active ? 'bg-foreground' : 'bg-border'}`}
          />
        ))}
      </div>

      <p className="mt-5 text-[10px] leading-relaxed text-muted-foreground">
        Rankings, ratings and review totals belong to Hwahae and may change after the stated snapshot date. Placement
        is not proof that a product will suit every person. Skin Grocer prices are Australian retail prices.
      </p>
    </section>
  );
}
