import { Link } from '@tanstack/react-router';

import {
  RANKING_SNAPSHOT_DATE,
  WATCHLIST_RANKING,
} from '@/lib/korea-rankings';

const nf = new Intl.NumberFormat('en-AU');

/**
 * "On our radar" — products ranking on Hwahae in Korea that we haven't
 * landed yet. Shown at the bottom of the shop with packshots and their
 * Korean rank/rating so customers can see what's coming and ask us to
 * stock it.
 */
export function KoreaWatchlist() {
  return (
    <section aria-labelledby="korea-watchlist" className="mt-16 border-t border-border pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
            On our radar <span className="ml-3 opacity-50">입고 예정</span>
          </p>
          <h2 id="korea-watchlist" className="mt-3 font-masthead text-2xl text-foreground sm:text-3xl">
            Ranking in Korea, not yet on our shelf.
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Also climbing the Hwahae ranking this week (snapshot {RANKING_SNAPSHOT_DATE}) — we're working on
            landing these in Melbourne.
          </p>
        </div>
        <Link
          to="/stock-request"
          className="group relative inline-flex items-center py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground"
        >
          Ask us to stock it
          <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100" />
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {WATCHLIST_RANKING.map((e) => (
          <li key={`${e.brand}-${e.name}`}>
            <div className="relative aspect-square overflow-hidden bg-secondary p-3">
              {e.image && (
                <img
                  src={e.image}
                  alt={`${e.brand} ${e.name}`}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="h-full w-full object-contain"
                />
              )}
              <span className="absolute left-2 top-2 bg-foreground px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-background">
                #{e.rank}
              </span>
              <span className="absolute right-2 top-2 bg-background px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Coming soon
              </span>
            </div>
            <p className="mt-2 truncate text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{e.brand}</p>
            <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-foreground">{e.name}</p>
            <p className="mt-1 text-[10px] tabular-nums text-muted-foreground">
              {e.rating.toFixed(2)} ★ · {nf.format(e.reviews)} Korean reviews
            </p>
            <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">{e.note}</p>
            <Link
              to="/stock-request"
              search={{ brand: e.brand, product: e.name }}
              className="mt-2 inline-flex min-h-9 items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground underline underline-offset-4 hover:text-primary"
            >
              Ask us to stock it
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
