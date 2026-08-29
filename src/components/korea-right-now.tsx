import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { NewsletterForm } from "@/components/newsletter-form";
import { getLearnArticle } from "@/lib/learn-articles";
import { newsletterIssues } from "@/lib/newsletter-issues";
import { RANKING_SNAPSHOT_DATE, RANKING_SOURCE, RANKING_SOURCE_URL } from "@/lib/korea-rankings";
import { productSlug } from "@/lib/product-detail";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { trackUi } from "@/lib/analytics";

/**
 * THE SEOUL SIGNAL — Skin Grocer's Korean-market intelligence feature.
 *
 * Editorial only: one feature story, a methodology panel, a dated source note
 * and three compact secondary reads. No product carousel, no Add to Bag.
 */

/** Most recent published issue of the Seoul Signal — a real, routed article. */
const feature = newsletterIssues.find((i) => i.published) ?? newsletterIssues[0]!;

/** Date the Korean-market signals behind this edit were last verified. */
const LAST_CHECKED = RANKING_SNAPSHOT_DATE; // "28 August 2026"
const LAST_CHECKED_ISO = "2026-08-28";
/** Days since the check, evaluated at render — drives the archive label. */
const ARCHIVE_AFTER_DAYS = 30;

const SIGNAL_STEPS = [
  {
    n: "01",
    title: "Korea signal",
    body: "Documented Korean rankings, retail activity or customer conversation.",
  },
  {
    n: "02",
    title: "Formula check",
    body: "Ingredients, concentrations where verified, texture and complete-formula context.",
  },
  {
    n: "03",
    title: "Australia fit",
    body: "Climate, lifestyle, lawful supply and practical routine relevance.",
  },
  {
    n: "04",
    title: "Skin Grocer view",
    body: "Why the topic matters, its limitations and who may want to investigate further.",
  },
];

const SECONDARY = [
  { slug: "new-launch-watchlist", label: "Seoul watchlist" },
  { slug: "seoul-vs-tiktok", label: "Data" },
  { slug: "prevention-over-repair", label: "Philosophy" },
]
  .map((s) => ({ ...s, article: getLearnArticle(s.slug) }))
  .filter((s): s is typeof s & { article: NonNullable<ReturnType<typeof getLearnArticle>> } =>
    Boolean(s.article),
  );

const pdrnProduct = SHOP_PRODUCTS.find(
  (p) => p.priceId === "medicube_pdrn_pink_peptide_serum_30ml_onetime",
);

function isArchive(): boolean {
  const checked = new Date(LAST_CHECKED_ISO).getTime();
  return (Date.now() - checked) / 86_400_000 > ARCHIVE_AFTER_DAYS;
}

export function KoreaRightNow() {
  const sectionRef = useRef<HTMLElement>(null);
  const seen = useRef(false);
  const archive = isArchive();

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
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* Masthead */}
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-paper/70">
            The Seoul Signal
          </p>
          <h2
            id="the-seoul-signal"
            className="mt-4 font-display text-[34px] leading-[1.04] text-paper md:text-5xl"
          >
            What Korea is buying&mdash;and what that means here.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-paper/80">
            A fortnightly edit of the products, ingredients and conversations gaining attention in
            Korea&mdash;checked against formulation, evidence and relevance for Australian routines.
          </p>
          <p className="mt-4 max-w-2xl border-l border-paper/25 pl-4 text-[13px] leading-relaxed text-paper/65">
            Popularity tells us what deserves investigation. It does not prove that a product will
            suit every person or deliver a guaranteed result.
          </p>
        </div>

        {/* Feature + methodology */}
        <div className="mt-14 grid gap-12 border-t border-paper/20 pt-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          {/* 60% — featured story */}
          <article>
            <figure className="m-0">
              <img
                src={feature.cover}
                alt={feature.coverAlt}
                loading="lazy"
                decoding="async"
                width={1200}
                height={750}
                className="aspect-[16/10] w-full bg-paper/5 object-cover"
              />
              <figcaption className="mt-3 text-[11.5px] leading-relaxed text-paper/55">
                {feature.coverAlt}. Products pictured are stocked Skin Grocer lines and are not
                presented as ranked.
              </figcaption>
            </figure>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
              Issue {feature.number} · Korea now
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/55">
              {archive ? "Archive signal · " : ""}Last checked{" "}
              <time dateTime={LAST_CHECKED_ISO}>{LAST_CHECKED}</time> · {feature.date} ·{" "}
              {"7 min read"}
            </p>

            <h3 className="mt-5 font-display text-3xl leading-tight text-paper md:text-[40px]">
              {feature.title}
            </h3>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-paper/75">
              {feature.standfirst}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link
                to="/blog/$slug"
                params={{ slug: feature.slug }}
                onClick={() =>
                  trackUi("seoul_signal_article_click", { issue: feature.number, slug: feature.slug })
                }
                className="inline-flex min-h-11 items-center border-b border-paper pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper"
              >
                Read the Seoul Signal →
              </Link>
              <Link
                to="/learn/hub"
                onClick={() => trackUi("seoul_signal_methodology_click", {})}
                className="inline-flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/75 underline underline-offset-4 hover:text-paper"
              >
                How we check Korean-market signals →
              </Link>
            </div>

            {/* Source transparency */}
            <dl className="mt-8 grid gap-x-8 gap-y-3 border-t border-paper/20 pt-6 text-[12.5px] sm:grid-cols-3">
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
                    className="underline underline-offset-4 hover:text-paper"
                  >
                    {RANKING_SOURCE} (opens in a new tab)
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/55">
                  Date checked
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
                  Retail ranking · customer-review aggregate
                </dd>
              </div>
            </dl>
          </article>

          {/* 40% — methodology + evidence note */}
          <aside className="flex flex-col gap-10">
            <div className="border border-paper/20 p-7">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper">
                How to read the signal
              </h3>
              <ol className="mt-6 flex flex-col">
                {SIGNAL_STEPS.map((s) => (
                  <li key={s.n} className="border-t border-paper/15 py-4 first:border-t-0 first:pt-0">
                    <div className="flex gap-4">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/60">
                        {s.n}
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper">
                          {s.title}
                        </p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-paper/70">{s.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-paper/15 pt-5 text-[13px] leading-relaxed text-paper/70">
                No single ranking, review platform or viral post decides what enters the Skin Grocer
                edit.
              </p>
            </div>

            {/* PDRN — evidence-labelled editorial note, no purchase prompt */}
            <div className="border border-paper/20 p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/60">
                Under examination
              </p>
              <h3 className="mt-3 font-display text-[22px] leading-snug text-paper">
                PDRN has moved from the treatment room into skincare&mdash;but what does that
                actually mean?
              </h3>
              <p className="mt-2 inline-block border border-paper/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">
                Evidence status · Emerging for topical cosmetic use
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-paper/75">
                PDRN is appearing across Korean cosmetic formulas, but topical products are not
                equivalent to professional treatments. We examine the formula, the supporting
                ingredients and what customers should realistically expect.
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-paper/70">
                <span className="font-semibold text-paper/85">What is established:</span> the
                complete product may provide hydration and cosmetic skin-conditioning benefits
                depending on its overall formulation.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-paper/70">
                <span className="font-semibold text-paper/85">What remains uncertain:</span>{" "}
                independent evidence for dramatic topical PDRN results remains limited, and
                injectable-treatment evidence should not be transferred to a serum.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/learn/article/$slug"
                  params={{ slug: "pdrn-explained" }}
                  onClick={() =>
                    trackUi("seoul_signal_article_click", { slug: "pdrn-explained" })
                  }
                  className="inline-flex min-h-11 items-center border-b border-paper pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper self-start"
                >
                  Read the PDRN explainer →
                </Link>
                {pdrnProduct && (
                  <Link
                    to="/product/$slug"
                    params={{ slug: productSlug(pdrnProduct) }}
                    className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/65 underline underline-offset-4 hover:text-paper self-start"
                  >
                    View the product →
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Secondary stories */}
        <div className="mt-16 border-t border-paper/20 pt-10">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
            Also in the signal
          </h3>
          <div className="mt-6 grid gap-px bg-paper/15 md:grid-cols-3">
            {SECONDARY.map(({ article, label }) => (
              <Link
                key={article.slug}
                to="/learn/article/$slug"
                params={{ slug: article.slug }}
                onClick={() =>
                  trackUi("seoul_signal_secondary_story_click", { slug: article.slug })
                }
                className="group flex flex-col bg-ink p-6 transition-colors hover:bg-paper/5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/60">
                  {label}
                </p>
                <h4 className="mt-2 font-display text-lg leading-snug text-paper">
                  {article.title}
                </h4>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-paper/70">
                  {article.blurb}
                </p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/60">
                  {article.read} · Read →
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 grid gap-8 border-t border-paper/20 pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
          <div>
            <h3 className="font-display text-2xl leading-tight text-paper md:text-3xl">
              Want the next Seoul Signal?
            </h3>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-paper/75">
              New Korean-market notes when there is something worth knowing&mdash;not every time
              something goes viral.
            </p>
          </div>
          <div className="max-w-md">
            <NewsletterForm
              source="homepage"
              variant="dark"
              submitLabel="Join the Seoul Signal"
              onEvent={(stage) =>
                trackUi(
                  stage === "submit"
                    ? "seoul_signal_newsletter_submit"
                    : stage === "success"
                      ? "seoul_signal_newsletter_success"
                      : "seoul_signal_newsletter_error",
                  {},
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
