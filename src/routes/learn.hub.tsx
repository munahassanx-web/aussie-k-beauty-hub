import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import featureSerum from "@/assets/learn-feature-serum.jpg";
import petri from "@/assets/learn-petri.jpg";
import portraitDeep from "@/assets/learn-portrait-deep.jpg";
import routineFlatlay from "@/assets/learn-routine-flatlay.jpg";
import { articlesByPillar, getLearnArticle, type LearnArticle } from "@/lib/learn-articles";
import { filterArticles, tagGroups, tagsFor } from "@/lib/learn-tags";
import { FaqSection } from "@/components/faq-section";
import { TREND_FAQS, faqJsonLd } from "@/lib/faqs";

const learnSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  tag: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/learn/hub")({
  validateSearch: zodValidator(learnSearchSchema),
  head: () => ({
    meta: [
      { title: "Learn Hub — Seoul Skincare Logic, Written For Australia | Skin Grocer" },
      {
        name: "description",
        content:
          "Prevention-first Korean skincare, decoded for Australian climate and skin. What Korean women actually buy — sourced from Hwahae and Olive Young data, not TikTok.",
      },
      {
        property: "og:title",
        content: "Learn Hub — Seoul Skincare Logic, Written For Australia",
      },
      {
        property: "og:description",
        content:
          "Prevention over repair. Domestic Korean data over social trends. Ingredients, concerns and routines explained for Australian conditions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/learn/hub" }],
    scripts: [faqJsonLd(TREND_FAQS)],
  }),
  component: LearnHubPage,
});

const stats = [
  { big: "10M+", cap: "Korean-language reviews we read rankings from, not feeds" },
  { big: "85%", cap: "of Korea's domestic beauty retail we track for real demand" },
  { big: "12–18", cap: "months Australia usually lags Korean shelves. We close it" },
  { big: "0", cap: "products stocked on social virality alone" },
];

const feature = getLearnArticle("prevention-over-repair")!;
const secondaryFeatures = [
  getLearnArticle("seoul-vs-tiktok")!,
  getLearnArticle("pdrn-explained")!,
];

const pillars: {
  tag: string;
  heading: string;
  lede: string;
  image: string;
  reverse?: boolean;
  articles: LearnArticle[];
}[] = [
  {
    tag: "01",
    heading: "Ingredients, Decoded.",
    lede: "PDRN or peptides? Cica or ceramides? We read the Korean formulation data and the domestic review volume, then translate it — including what the TGA does and doesn't allow here.",
    image: petri,
    articles: articlesByPillar("ingredients"),
  },
  {
    tag: "02",
    heading: "Concerns, Addressed.",
    lede: "Pigmentation, sensitivity, barrier damage — written for the full range of Australian skin tones, in the climate you actually live in, not the one the product was formulated for.",
    image: portraitDeep,
    reverse: true,
    articles: articlesByPillar("concerns"),
  },
  {
    tag: "03",
    heading: "Routines, Simplified.",
    lede: "Ten steps is an export artefact, not a rule. Here's the order that holds up in a Brisbane summer, a Melbourne winter and an air-conditioned office.",
    image: routineFlatlay,
    articles: articlesByPillar("routines"),
  },
];

function ArticleCard({ a }: { a: LearnArticle }) {
  return (
    <Link
      to="/learn/article/$slug"
      params={{ slug: a.slug }}
      className="group flex h-full flex-col border-t border-foreground/15 pt-5 transition-colors hover:border-clay"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-clay">{a.meta}</p>
      <h3 className="mt-3 font-display text-xl leading-[1.2] text-foreground group-hover:text-primary md:text-[26px]">
        {a.title}
      </h3>
      <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{a.blurb}</p>
      <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
        {a.read}
      </p>
    </Link>
  );
}

function LearnFinder() {
  const { q, tag } = Route.useSearch();
  const navigate = useNavigate({ from: "/learn/hub" });
  const groups = tagGroups();
  const isFiltering = q.trim().length > 0 || tag.length > 0;
  const results = isFiltering ? filterArticles(q, tag) : [];

  const setSearch = (next: { q?: string; tag?: string }) =>
    navigate({ search: (prev) => ({ ...prev, ...next }), replace: true });

  return (
    <section
      id="find"
      aria-labelledby="find-heading"
      className="mx-auto max-w-6xl border-t border-foreground/15 px-6 py-10 md:py-12"
    >
      <h2
        id="find-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground"
      >
        Find an article
      </h2>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <label htmlFor="learn-search" className="sr-only">
          Search Learn articles by ingredient, concern or routine step
        </label>
        <input
          id="learn-search"
          type="search"
          value={q}
          onChange={(e) => setSearch({ q: e.target.value })}
          placeholder="Search ingredients, concerns, routine steps…"
          className="w-full rounded-full border border-foreground/25 bg-background px-5 py-3 text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-clay md:max-w-md"
        />
        {isFiltering && (
          <button
            type="button"
            onClick={() => setSearch({ q: "", tag: "" })}
            className="self-start text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4 hover:text-clay"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-7 space-y-4">
        {groups.map((g) => (
          <div key={g.group} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="w-28 shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
              {g.group}
            </span>
            {g.tags.map((t) => {
              const active = tag === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSearch({ tag: active ? "" : t })}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/20 text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {isFiltering && (
        <div className="mt-10" aria-live="polite">
          <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            {results.length} {results.length === 1 ? "article" : "articles"}
            {tag && ` tagged ${tag}`}
            {q.trim() && ` matching “${q.trim()}”`}
          </p>
          {results.length === 0 ? (
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Nothing matches yet. Try a broader term — “barrier”, “sunscreen”, “PDRN” — or{" "}
              <Link to="/learn" className="underline underline-offset-4 hover:text-clay">
                browse the ingredient encyclopedia
              </Link>
              .
            </p>
          ) : (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((a) => (
                <div key={a.slug}>
                  <ArticleCard a={a} />
                  <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
                    {tagsFor(a).slice(0, 4).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function LearnHubPage() {
  const seoul = articlesByPillar("seoul");
  const { q, tag } = Route.useSearch();
  const isFiltering = q.trim().length > 0 || tag.length > 0;

  return (
    <div>
      {/* Hero */}
      <section className="px-6 pt-20 pb-14 text-center md:pt-28 md:pb-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-clay">
          Seoul → Melbourne · The Skin Grocer Learn Hub
        </p>
        <h1 className="mx-auto mt-7 max-w-5xl font-display text-[42px] uppercase leading-[0.92] tracking-[-0.03em] text-foreground sm:text-6xl md:text-[86px]">
          Fix it before
          <br />
          it breaks.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Korean women aren't chasing glass skin — they're managing skin health so nothing ever
          needs correcting. We read the Korean-language rankings, reviews and regulation, then write
          it up for Australian climate, Australian skin tones and Australian rules.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-[12.5px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground/70">
          Sourced from domestic Korean demand data. Never from a fifteen-second video.
        </p>
      </section>

      {/* Latest articles */}
      <section className="mx-auto max-w-6xl border-t border-foreground/15 px-6 py-10 md:py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground">
          Start here
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <article className="grid gap-7 sm:grid-cols-2 sm:items-center">
            <img
              src={feature.cover}
              alt={feature.coverAlt}
              width={1408}
              height={1008}
              className="h-full max-h-[420px] w-full rounded-sm object-cover"
            />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-clay">
                {feature.meta}
              </p>
              <h2 className="mt-3 font-display text-[30px] leading-[1.12] text-foreground md:text-[38px]">
                {feature.title}
              </h2>
              <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {feature.read} · Skin Grocer Curation Desk
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {feature.standfirst}
              </p>
              <Link
                to="/learn/article/$slug"
                params={{ slug: feature.slug }}
                className="mt-6 inline-block border-b border-foreground pb-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-clay hover:text-clay"
              >
                Read more
              </Link>
            </div>
          </article>

          <div className="space-y-8 lg:border-l lg:border-foreground/15 lg:pl-14">
            {secondaryFeatures.map((c) => (
              <Link
                key={c.slug}
                to="/learn/article/$slug"
                params={{ slug: c.slug }}
                className="group block"
              >
                <img
                  src={c.cover}
                  alt={c.coverAlt}
                  loading="lazy"
                  className="h-44 w-full rounded-sm object-cover"
                />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-lg leading-snug text-foreground group-hover:text-primary">
                    {c.title}
                  </h3>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {c.read}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seoul Signal band */}
      <section className="mt-6 bg-ink px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-background/60">
            The Seoul Signal
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[30px] leading-[1.05] text-background md:text-[46px]">
            We don't report what's trending. We report what Korean women repurchase.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[13.5px] leading-relaxed text-background/70">
            Every piece here starts with domestic Korean signals — Hwahae review volume, Olive Young
            Korea category rankings, real shelf space in Seoul — then gets cross-checked against
            Australian UV, humidity, water hardness and TGA rules before we publish or stock a thing.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.cap} className="text-center">
              <p className="font-display text-5xl leading-none text-background md:text-6xl">
                {s.big}
              </p>
              <p className="mx-auto mt-4 max-w-[190px] text-[11px] uppercase leading-relaxed tracking-[0.14em] text-background/60">
                {s.cap}
              </p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2">
          {seoul.map((a) => (
            <Link
              key={a.slug}
              to="/learn/article/$slug"
              params={{ slug: a.slug }}
              className="group flex h-full flex-col border-t border-background/25 pt-5 transition-colors hover:border-background"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-background/60">
                {a.meta}
              </p>
              <h3 className="mt-3 font-display text-xl leading-[1.2] text-background md:text-[26px]">
                {a.title}
              </h3>
              <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-background/65">
                {a.blurb}
              </p>
              <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-background/50">
                {a.read}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <div className="mx-auto max-w-6xl px-6">
        {pillars.map((p) => (
          <section key={p.heading} className="border-b border-foreground/15 py-16 md:py-24">
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                p.reverse ? "lg:[&>figure]:order-2" : ""
              }`}
            >
              <figure className="overflow-hidden rounded-sm">
                <img
                  src={p.image}
                  alt={p.heading}
                  loading="lazy"
                  className="h-[300px] w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04] md:h-[440px]"
                />
              </figure>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-clay">
                  {p.tag} — {p.articles.length} articles
                </span>
                <h2 className="mt-5 font-display text-[34px] uppercase leading-[0.96] tracking-[-0.02em] text-foreground md:text-[52px]">
                  {p.heading}
                </h2>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  {p.lede}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/learn/article/$slug"
                    params={{ slug: p.articles[0].slug }}
                    className="rounded-full bg-foreground px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-85"
                  >
                    Start reading
                  </Link>
                  <Link
                    to="/learn"
                    className="rounded-full border border-foreground px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    Ingredient dictionary
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {p.articles.map((a) => (
                <ArticleCard key={a.slug} a={a} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <FaqSection
        id="trends-faq"
        eyebrow="Seoul signal"
        title="What Korea is buying now — and what to ignore."
        intro="Trend questions answered from Korean domestic demand data, then pressure-tested against Australian climate and regulation."
        items={TREND_FAQS}
        tone="sand"
      />

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 rounded-sm bg-sand px-8 py-14 md:grid-cols-[1.2fr_1fr] md:px-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-clay">
              The Seoul Signal · Fortnightly
            </p>
            <h2 className="mt-5 font-display text-[34px] uppercase leading-[0.98] tracking-[-0.02em] text-foreground md:text-5xl">
              What Seoul is buying, before Australia hears about it.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-foreground/70">
              Every two weeks: what's climbing the Korean domestic rankings, what Korean women are
              actually repurchasing, and which of it is worth your money in an Australian climate.
            </p>
          </div>
          <div className="md:justify-self-end">
            <Link
              to="/contact"
              className="inline-block rounded-full bg-foreground px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-85"
            >
              Subscribe
            </Link>
            <p className="mt-5 max-w-xs text-[12px] leading-relaxed text-foreground/60">
              Prefer the A–Z?{" "}
              <Link to="/learn" className="underline underline-offset-4 hover:text-clay">
                Browse the full ingredient encyclopedia
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
