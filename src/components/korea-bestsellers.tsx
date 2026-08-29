import { Link } from '@tanstack/react-router';

import { ProductCard } from '@/components/product-card';
import { Reveal } from '@/components/reveal';
import {
  RANKING_SNAPSHOT_DATE,
  RANKING_SOURCE,
  RANKING_SOURCE_URL,
  STOCKED_RANKING,
  WATCHLIST_RANKING,
} from '@/lib/korea-rankings';

const nf = new Intl.NumberFormat('en-AU');

/**
 * "This week in Korea" — the Hwahae Global Trending Ranking, matched against
 * what we actually hold in Melbourne. Stocked entries get a real packshot and
 * a buy button; entries we haven't landed yet are shown as a typographic
 * watchlist rather than dressed up with stand-in imagery.
 */
export function KoreaBestsellers() {
  return (
    <section aria-labelledby="korea-bestsellers" className="border-b border-border pb-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
        <div className="max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
            This week in Korea <span className="ml-3 opacity-50">화해 랭킹</span>
          </p>
          <h2 id="korea-bestsellers" className="mt-4 font-masthead text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95] text-foreground">
            The bestsellers Seoul is
            <span className="block font-light italic">actually buying.</span>
          </h2>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          Ranked by{' '}
          <a
            href={RANKING_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            {RANKING_SOURCE}
          </a>
          , Korea&rsquo;s largest independent review platform. Snapshot taken {RANKING_SNAPSHOT_DATE}.
        </p>
      </div>

      {/* In stock now */}
      <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
        {STOCKED_RANKING.map(({ entry, product }, i) => (
          <Reveal key={product.priceId} delay={(i % 3) * 60}>
            <div>
              <div className="mb-3 flex items-baseline gap-3 border-b border-border/70 pb-2">
                <span className="font-masthead text-2xl leading-none text-foreground tabular-nums">
                  {String(entry.rank).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {entry.rating.toFixed(2)} ★ · {nf.format(entry.reviews)} reviews
                </span>
              </div>
              <ProductCard product={product} eager={i < 3} />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{entry.note}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Watchlist — not landed yet */}
      <div className="mt-16 border-t border-border pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
              On our radar <span className="ml-3 opacity-50">입고 예정</span>
            </p>
            <h3 className="mt-3 font-masthead text-2xl text-foreground">
              Ranking in Korea, not yet on our shelf.
            </h3>
          </div>
          <Link
            to="/restock"
            className="group relative inline-flex items-center py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground"
          >
            Ask us to stock it
            <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100" />
          </Link>
        </div>

        <ul className="mt-8 grid gap-x-10 md:grid-cols-2">
          {WATCHLIST_RANKING.map((e) => (
            <li
              key={`${e.brand}-${e.name}`}
              className="flex items-start gap-5 border-b border-border/70 py-5"
            >
              <span className="mt-1 font-masthead text-xl leading-none text-muted-foreground tabular-nums">
                {String(e.rank).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{e.brand}</p>
                <p className="mt-1 font-display text-[1.02rem] leading-snug text-foreground">{e.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {e.size} · {e.rating.toFixed(2)} ★ · {nf.format(e.reviews)} reviews
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{e.note}</p>
              </div>
              <span className="ml-auto shrink-0 self-start bg-secondary px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Coming soon
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
