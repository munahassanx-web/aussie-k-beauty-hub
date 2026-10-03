import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { newsletterIssues } from "@/lib/newsletter-issues";
import { RANKING_SNAPSHOT_DATE, RANKING_SOURCE, RANKING_SOURCE_URL } from "@/lib/korea-rankings";
import { trackUi } from "@/lib/analytics";

/**
 * THE SEOUL SIGNAL — compact homepage teaser. One image, one feature story,
 * a dated source record and two links. Full methodology lives on the article
 * and Learn Hub.
 */

/** Most recent published issue — a real, routed article. */
const feature = newsletterIssues.find((i) => i.published) ?? newsletterIssues[0]!;

/** Genuine date the Hwahae ranking was last researched (not today's date). */
const LAST_CHECKED = RANKING_SNAPSHOT_DATE;
const LAST_CHECKED_ISO = "2026-08-28";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper";

export function KoreaRightNow() {
  const sectionRef = useRef<HTMLElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !seen.current) {
            seen.current = true;
            trackUi("seoul_signal_feature_view", { issue: feature.number });
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink text-paper" aria-labelledby="the-seoul-signal">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image (first on mobile) */}
          <figure className="m-0">
            <img
              src={feature.cover}
              alt={feature.coverAlt}
              loading="lazy"
              decoding="async"
              width={1200}
              height={900}
              className="aspect-[4/3] w-full bg-paper/5 object-cover lg:max-h-[620px]"
            />
            <figcaption className="mt-3 text-[11.5px] leading-relaxed text-paper/55">
              Products pictured are stocked Skin Grocer lines and are not presented as ranked.
            </figcaption>
          </figure>

          {/* Story */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-paper/70">
              The Seoul Signal
            </p>
            <h2
              id="the-seoul-signal"
              className="mt-4 font-display text-[30px] leading-[1.06] text-paper md:text-[40px]"
            >
              What is gaining attention in Korean skincare&mdash;and what matters here.
            </h2>
            <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-paper/75">
              We examine Korean beauty-platform rankings, retail activity and customer
              conversations, then consider the formulas and their relevance for Australian
              routines.
            </p>
            <p className="mt-3 max-w-xl border-l border-paper/25 pl-4 text-[13px] leading-relaxed text-paper/65">
              Popularity is a signal to investigate&mdash;not proof that a product works or suits
              everyone.
            </p>

            <article className="mt-10 border-t border-paper/20 pt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
                Korea market note
              </p>
              <h3 className="mt-3 font-display text-2xl leading-snug text-paper md:text-[28px]">
                The quieter barrier creams, hydrating toners and daily formulas gaining attention
                in Korea
              </h3>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-paper/75">
                A closer look at products receiving Korean ranking and review activity&mdash;and
                why some differ from the products dominating international social media.
              </p>

              <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-paper/15 pt-5 text-[12.5px] sm:grid-cols-3">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/55">
                    Source
                  </dt>
                  <dd className="mt-1 text-paper/80">
                    <a
                      href={RANKING_SOURCE_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={() => trackUi("seoul_signal_source_click", { source: RANKING_SOURCE })}
                      className={`underline underline-offset-4 hover:text-paper ${focusRing}`}
                    >
                      {RANKING_SOURCE}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/55">
                    Last checked
                  </dt>
                  <dd className="mt-1 text-paper/80">
                    <time dateTime={LAST_CHECKED_ISO}>{LAST_CHECKED}</time>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/55">
                    Signal type
                  </dt>
                  <dd className="mt-1 text-paper/80">
                    Platform ranking and aggregated customer reviews
                  </dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link
                  to="/blog/$slug"
                  params={{ slug: feature.slug }}
                  onClick={() =>
                    trackUi("seoul_signal_article_click", { issue: feature.number, slug: feature.slug })
                  }
                  className={`inline-flex min-h-11 items-center border-b border-paper pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper ${focusRing}`}
                >
                  Read the latest Seoul Signal →
                </Link>
                <Link
                  to="/learn/hub"
                  onClick={() => trackUi("seoul_signal_methodology_click", {})}
                  className={`inline-flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/75 underline underline-offset-4 hover:text-paper ${focusRing}`}
                >
                  How we evaluate Korean-market signals →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
