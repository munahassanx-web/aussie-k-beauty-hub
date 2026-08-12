import { createFileRoute, Link } from "@tanstack/react-router";
import featureSerum from "@/assets/learn-feature-serum.jpg";
import petri from "@/assets/learn-petri.jpg";
import portraitDeep from "@/assets/learn-portrait-deep.jpg";
import routineFlatlay from "@/assets/learn-routine-flatlay.jpg";

export const Route = createFileRoute("/learn/hub")({
  head: () => ({
    meta: [
      { title: "Learn Hub — Korean Skincare, Actually Explained | Skin Grocer" },
      {
        name: "description",
        content:
          "Ingredient science, Australian regulatory context and routine logic behind every K-beauty product we curate — explained quickly, never dumbed down.",
      },
      { property: "og:title", content: "Learn Hub — Korean Skincare, Actually Explained" },
      {
        property: "og:description",
        content:
          "Ingredients decoded, concerns addressed, routines simplified — the Skin Grocer Learn Hub.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/learn/hub" }],
  }),
  component: LearnHubPage,
});

const stats = [
  { big: "40", cap: "SKUs, each passing our 3-question filter" },
  { big: "9", cap: "Korean brands cross-validated via Hwahae & Glowpick" },
  { big: "32", cap: "Ingredients evaluated for Australian conditions" },
  { big: "100%", cap: "Australian regulatory context on every piece" },
];

type Article = { meta: string; title: string; blurb: string; read: string };

const pillars: {
  tag: string;
  heading: string;
  lede: string;
  count: string;
  image: string;
  reverse?: boolean;
  articles: Article[];
}[] = [
  {
    tag: "01",
    heading: "Ingredients, Decoded.",
    lede: "PDRN or peptides? Cica or ceramides? Your routine shouldn't require a chemistry degree. We read the research, then translate it — including what the TGA does and doesn't allow here.",
    count: "12 articles",
    image: petri,
    articles: [
      {
        meta: "Ingredient · Active",
        title: "PDRN: What Salmon DNA Actually Does For Your Skin",
        blurb:
          "The science behind the peptide everyone's suddenly stocking — and where to start.",
        read: "6 min read",
      },
      {
        meta: "Ingredient · Barrier",
        title: "Centella Asiatica: Why It's In Almost Everything We Stock",
        blurb: "Cica isn't a trend here — it's the backbone of our barrier-repair range.",
        read: "5 min read",
      },
      {
        meta: "Ingredient · Regulation",
        title: "TGA vs Korean Sunscreen Standards, Decoded",
        blurb: "Filters, testing and water resistance, compared side by side.",
        read: "7 min read",
      },
    ],
  },
  {
    tag: "02",
    heading: "Concerns, Addressed.",
    lede: "Pigmentation, sensitivity, barrier damage — shown on real Australian skin, across every tone, in the climate you actually live in.",
    count: "9 articles",
    image: portraitDeep,
    reverse: true,
    articles: [
      {
        meta: "Concern · Tone",
        title: "K-Beauty, Finally Demonstrated On Deeper Skin",
        blurb: "Redness, pigmentation and product cast, honestly shown.",
        read: "8 min read",
      },
      {
        meta: "Concern · Sensitivity",
        title: "Why Australian Barriers Struggle More Than Korean Skin",
        blurb: "Aircon, harder water, higher UV — the climate case.",
        read: "6 min read",
      },
      {
        meta: "Concern · Pigmentation",
        title: "Uneven Tone, Not \u201CWhitening\u201D: Getting The Language Right",
        blurb: "What to look for when you actually want brightness.",
        read: "4 min read",
      },
    ],
  },
  {
    tag: "03",
    heading: "Routines, Simplified.",
    lede: "Ten steps is a marketing structure, not a rule. Here's the order that holds up in a Brisbane summer and a Melbourne winter.",
    count: "11 articles",
    image: routineFlatlay,
    articles: [
      {
        meta: "Routine · Order",
        title: "The Correct Layering Order For Humid Australian Summers",
        blurb: "When Korean 7-step logic breaks down in 35°C heat.",
        read: "5 min read",
      },
      {
        meta: "Routine · Acids",
        title: "How Often Melanin-Rich Skin Should Actually Use Acids",
        blurb: "Frequency guidance by skin type and concern.",
        read: "6 min read",
      },
      {
        meta: "Routine · Climate",
        title: "Rebuilding Your Routine For Melbourne Winter vs Brisbane Summer",
        blurb: "How a routine should shift across Australian climate zones.",
        read: "7 min read",
      },
    ],
  },
];

function ArticleCard({ a }: { a: Article }) {
  return (
    <Link
      to="/learn"
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

function LearnHubPage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-6 pt-20 pb-14 text-center md:pt-28 md:pb-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-clay">
          The Skin Grocer Learn Hub
        </p>
        <h1 className="mx-auto mt-7 max-w-5xl font-display text-[42px] uppercase leading-[0.92] tracking-[-0.03em] text-foreground sm:text-6xl md:text-[86px]">
          Korean skincare,
          <br />
          actually explained.
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Not beginner tutorials. The ingredient science, the Australian regulation and the routine
          logic behind every product we curate — quick to read, never dumbed down.
        </p>
      </section>

      {/* Latest articles */}
      <section className="mx-auto max-w-6xl border-t border-foreground/15 px-6 py-10 md:py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground">
          Latest Articles
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <article className="grid gap-7 sm:grid-cols-2 sm:items-center">
            <img
              src={featureSerum}
              alt="Glass test tubes and a gold dropper filled with serum"
              width={1408}
              height={1008}
              className="h-full max-h-[420px] w-full rounded-sm object-cover"
            />
            <div>
              <h2 className="font-display text-[30px] leading-[1.12] text-foreground md:text-[38px]">
                Can You Layer Vitamin C And PDRN Together?
              </h2>
              <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                8 min read · Skin Grocer Curation Desk
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                There's more information about what goes into our products than ever — and with it,
                a lot of myths about which actives can share a shelf. Here's what the formulation
                data actually supports.
              </p>
              <Link
                to="/learn"
                className="mt-6 inline-block border-b border-foreground pb-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-clay hover:text-clay"
              >
                Read more
              </Link>
            </div>
          </article>

          <div className="space-y-8 lg:border-l lg:border-foreground/15 lg:pl-14">
            {[
              {
                img: petri,
                title: "The Beginner's Guide To K-Beauty Actives",
                read: "4 min read",
              },
              {
                img: routineFlatlay,
                title: "How To Use Niacinamide In A Humid Climate",
                read: "8 min read",
              },
            ].map((c) => (
              <Link key={c.title} to="/learn" className="group block">
                <img
                  src={c.img}
                  alt={c.title}
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

      {/* Stats band */}
      <section className="mt-6 bg-ink px-6 py-16 md:py-20">
        <p className="mx-auto max-w-2xl text-center text-[13px] leading-relaxed text-background/70">
          Since day one in Melbourne, every product we list has been researched, batch-verified and
          written up before it reaches a shelf.
        </p>
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
                  {p.tag} — {p.count}
                </span>
                <h2 className="mt-5 font-display text-[34px] uppercase leading-[0.96] tracking-[-0.02em] text-foreground md:text-[52px]">
                  {p.heading}
                </h2>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  {p.lede}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/learn"
                    className="rounded-full bg-foreground px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-85"
                  >
                    Explore articles
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
                <ArticleCard key={a.title} a={a} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 rounded-sm bg-sand px-8 py-14 md:grid-cols-[1.2fr_1fr] md:px-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-clay">
              The Curation Desk
            </p>
            <h2 className="mt-5 font-display text-[34px] uppercase leading-[0.98] tracking-[-0.02em] text-foreground md:text-5xl">
              Get the fortnightly version.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-foreground/70">
              The newest pieces from Learn, plus what's actually happening in Korea right now — in
              your inbox every two weeks.
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
