import { createFileRoute, Link } from "@tanstack/react-router";

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
  { big: "0", cap: "\u201CWhat is double cleansing\u201D explainers — you already know" },
  { big: "100%", cap: "Australian regulatory context on every ingredient piece" },
];

type Article = {
  thumb: string;
  meta: string;
  title: string;
  blurb: string;
  read: string;
};

const pillars: { tag: string; heading: string; count: string; articles: Article[] }[] = [
  {
    tag: "01",
    heading: "Ingredients, Decoded",
    count: "12 articles",
    articles: [
      {
        thumb: "PDRN",
        meta: "Ingredient · Active",
        title: "PDRN: What Salmon DNA Actually Does For Your Skin",
        blurb:
          "The science behind the peptide everyone's suddenly stocking — and which of our PDRN products it's actually worth starting with.",
        read: "6 min read",
      },
      {
        thumb: "Cica",
        meta: "Ingredient · Barrier",
        title: "Centella Asiatica: Why It's In Almost Everything We Stock",
        blurb:
          "Cica isn't a trend ingredient here — it's the backbone of our barrier-repair range. Here's the actual mechanism.",
        read: "5 min read",
      },
      {
        thumb: "SPF",
        meta: "Ingredient · Regulation",
        title: "TGA vs Korean Sunscreen Standards, Decoded",
        blurb:
          "The regulatory gap that shapes what we stock — filters, testing and water resistance, compared side by side.",
        read: "7 min read",
      },
    ],
  },
  {
    tag: "02",
    heading: "Concerns, Addressed",
    count: "9 articles",
    articles: [
      {
        thumb: "Deep Skin",
        meta: "Concern · Tone",
        title: "K-Beauty, Finally Demonstrated On Deeper Skin",
        blurb:
          "Real routines on brown and deep skin tones — redness, pigmentation and product cast, honestly shown.",
        read: "8 min read",
      },
      {
        thumb: "Barrier",
        meta: "Concern · Sensitivity",
        title: "Why Australian Skin Barriers Struggle More Than Korean Skin",
        blurb:
          "Aircon, harder water, higher UV — the climate case for why \u201Cit worked in Seoul\u201D isn't the full story.",
        read: "6 min read",
      },
      {
        thumb: "Tone",
        meta: "Concern · Pigmentation",
        title: "Uneven Tone, Not \u201CWhitening\u201D: Getting The Language Right",
        blurb:
          "Why we don't use Korean marketing terms as-is, and what to look for instead when you actually want brightness.",
        read: "4 min read",
      },
    ],
  },
  {
    tag: "03",
    heading: "Routines, Simplified",
    count: "11 articles",
    articles: [
      {
        thumb: "Layering",
        meta: "Routine · Order",
        title: "The Correct Layering Order For Humid Australian Summers",
        blurb: "When to go lighter, and when Korean 7-step logic actually breaks down in 35°C heat.",
        read: "5 min read",
      },
      {
        thumb: "Actives",
        meta: "Routine · Acids",
        title: "How Often Melanin-Rich Skin Should Actually Use Acids",
        blurb:
          "A straight answer, not a generic \u201Cpatch test first\u201D — frequency guidance by skin type and concern.",
        read: "6 min read",
      },
      {
        thumb: "Seasonal",
        meta: "Routine · Climate",
        title: "Rebuilding Your Routine For Melbourne Winter vs Brisbane Summer",
        blurb:
          "Same brand, different climate zones — how your routine should actually shift across Australia.",
        read: "7 min read",
      },
    ],
  },
];

function LearnHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          The Skin Grocer Learn Hub
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.08] text-foreground md:text-6xl">
          Korean skincare, <em className="text-clay">actually explained.</em>
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          Not beginner tutorials. The ingredient science, the regulation, and the routine logic
          behind every product we curate — broken down so it's quick to read, never dumbed down.
        </p>
      </header>

      <section className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.cap}
            className="border-b border-border px-5 py-6 text-center last:border-b-0 sm:[&:nth-child(-n+2)]:border-b sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <p className="font-display text-3xl leading-none text-primary">{s.big}</p>
            <p className="mt-2 text-[11.5px] leading-snug text-muted-foreground">{s.cap}</p>
          </div>
        ))}
      </section>

      <div className="mt-16 space-y-14">
        {pillars.map((p) => (
          <section key={p.heading}>
            <div className="flex flex-wrap items-baseline gap-3 border-b-2 border-foreground pb-3">
              <span className="rounded-full bg-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-background">
                {p.tag}
              </span>
              <h2 className="font-display text-2xl text-foreground md:text-3xl">{p.heading}</h2>
              <span className="ml-auto text-[13px] text-muted-foreground">{p.count}</span>
            </div>

            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {p.articles.map((a) => (
                <li key={a.title}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary">
                    <div className="flex h-32 items-center justify-center bg-gradient-to-br from-sand to-secondary">
                      <span className="font-display text-[15px] uppercase tracking-[0.06em] text-primary/80">
                        {a.thumb}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-clay">
                        {a.meta}
                      </p>
                      <h3 className="mt-2 text-[15px] font-bold leading-snug text-foreground">
                        {a.title}
                      </h3>
                      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                        {a.blurb}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11.5px] text-muted-foreground">
                        <span>{a.read}</span>
                        <Link to="/learn" className="font-bold text-primary hover:underline">
                          Read →
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-6 mb-4 rounded-3xl bg-gradient-to-b from-foreground to-ink px-7 py-12 text-center">
        <h2 className="font-display text-3xl text-background">Get the fortnightly version</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-background/70">
          The Curation Desk newsletter pulls the newest pieces from Learn into your inbox every two
          weeks, plus what's actually happening in Korea right now.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Subscribe →
        </Link>
      </section>

      <p className="mx-auto max-w-lg border-t border-border pt-6 text-center text-[11.5px] text-muted-foreground">
        Prefer the A–Z?{" "}
        <Link to="/learn" className="text-primary hover:underline">
          Browse the full ingredient encyclopedia
        </Link>
        .
      </p>
    </div>
  );
}
