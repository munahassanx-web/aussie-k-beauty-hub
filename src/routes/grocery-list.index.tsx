import { createFileRoute, Link } from "@tanstack/react-router";
import { GroceryLabel } from "@/components/grocery-label";
import { newsletterIssues, upcomingIssues } from "@/lib/newsletter-issues";
import issue01 from "@/assets/issues/issue-01-hydration.jpg";
import issue02 from "@/assets/issues/issue-02-barrier.jpg";
import issue03 from "@/assets/issues/issue-03-routine.jpg";
import issue04 from "@/assets/issues/issue-04-pdrn.jpg";
import issue05 from "@/assets/issues/issue-05-pigmentation.jpg";
import issue06 from "@/assets/issues/issue-06-undiscovered.jpg";

const issueCovers: Record<string, { src: string; alt: string }> = {
  "01": { src: issue01, alt: "Macro droplet of clear hydrating serum beading on cool glass" },
  "02": { src: issue02, alt: "Translucent lipid layers illustrating an intact skin barrier" },
  "03": { src: issue03, alt: "Woman pressing moisturiser into her cheek in morning light" },
  "04": { src: issue04, alt: "Pink ampoule fluid drawing into fine strands on a lab slide" },
  "05": { src: issue05, alt: "Close crop of sun pigmentation and freckles in hard sunlight" },
  "06": { src: issue06, alt: "Neon-lit Seoul side street at dusk with hangul signage" },
};

export const Route = createFileRoute("/grocery-list/")({
  head: () => ({
    meta: [
      { title: "The Skin Grocery List — Skin Grocer's Fortnightly K-Beauty Newsletter" },
      {
        name: "description",
        content:
          "A fortnightly, collectible newsletter: what Korea is actually using, whether it works on Australian skin, and one curated basket per issue. No SALE SALE SALE.",
      },
      { property: "og:title", content: "The Skin Grocery List — Fortnightly from Skin Grocer" },
      {
        property: "og:description",
        content:
          "Korea → Australia skincare translation, one issue at a time. Ingredients decoded, products tested, baskets curated.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/grocery-list" }],
  }),
  component: GroceryListIndex,
});

function GroceryListIndex() {
  const latest = newsletterIssues[0];

  return (
    <div className="bg-grocer-cream">
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center md:pt-28">
        <div className="flex justify-center gap-2">
          <GroceryLabel tone="tomato">🛒 Fortnightly</GroceryLabel>
          <GroceryLabel tone="green">🇰🇷 From Korea</GroceryLabel>
          <GroceryLabel tone="butter">🇦🇺 For Australian climate</GroceryLabel>
        </div>
        <h1 className="mx-auto mt-8 max-w-4xl font-display text-[44px] uppercase leading-[0.9] tracking-[-0.03em] text-grocer-brown sm:text-6xl md:text-[84px]">
          The Skin
          <br />
          Grocery List
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-foreground/70">
          We don't just tell you what's trending in Korea. We work out whether it's actually worth
          putting on Australian skin — then we pick one product per problem, not seventeen.
        </p>
      </section>

      {/* Latest issue */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <Link
          to="/grocery-list/$slug"
          params={{ slug: latest.slug }}
          className="group grid gap-8 border-y-2 border-grocer-brown/20 py-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14"
        >
          <img
            src={latest.cover}
            alt={latest.coverAlt}
            className="h-[280px] w-full rounded-sm object-cover md:h-[420px]"
          />
          <div>
            <GroceryLabel tone="tomato">🥬 Fresh · Issue {latest.number}</GroceryLabel>
            <p className="mt-5 font-display text-sm uppercase tracking-[0.24em] text-grocer-green">
              {latest.theme}
            </p>
            <h2 className="mt-3 font-display text-[34px] leading-[1.03] text-grocer-brown md:text-[52px]">
              {latest.title}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-foreground/70">
              {latest.standfirst}
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-foreground/50">
              {latest.date}
            </p>
            <span className="mt-6 inline-block border-b-2 border-grocer-tomato pb-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-grocer-tomato transition-transform duration-300 group-hover:translate-x-1">
              Read issue {latest.number} →
            </span>
          </div>
        </Link>
      </section>

      {/* Collect the set */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="font-display text-[28px] uppercase tracking-[-0.02em] text-grocer-brown md:text-4xl">
            Collect the set
          </h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">
            One issue, one subject
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {newsletterIssues.map((i) => (
            <Link
              key={i.slug}
              to="/grocery-list/$slug"
              params={{ slug: i.slug }}
              className="group flex flex-col overflow-hidden rounded-sm border-2 border-grocer-brown/20 bg-background transition-colors hover:border-grocer-tomato"
            >
              {issueCovers[i.number] && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={issueCovers[i.number].src}
                    alt={issueCovers[i.number].alt}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-sm bg-background/90 px-2.5 py-1 font-display text-lg leading-none text-grocer-brown">
                    {i.number}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-grocer-green">
                    {i.theme}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-grocer-brown">
                    {i.title}
                  </h3>
                </div>
                <span className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-grocer-tomato">
                  Read now →
                </span>
              </div>
            </Link>
          ))}

          {upcomingIssues.map((i) => (
            <div
              key={i.number}
              className="flex flex-col overflow-hidden rounded-sm border-2 border-dashed border-grocer-brown/20 opacity-90"
            >
              {issueCovers[i.number] && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={issueCovers[i.number].src}
                    alt={issueCovers[i.number].alt}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover grayscale-[35%]"
                  />
                  <span className="absolute left-4 top-4 rounded-sm bg-background/90 px-2.5 py-1 font-display text-lg leading-none text-grocer-brown/70">
                    {i.number}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-grocer-brown/50">
                    {i.theme}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-grocer-brown/70">
                    {i.title}
                  </h3>
                </div>
                <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
                  Coming · Hero: {i.heroes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe */}
      <section className="border-t-2 border-grocer-brown/20 bg-background px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <GroceryLabel tone="green">💌 Every fortnight</GroceryLabel>
          <h2 className="mt-6 font-display text-[32px] uppercase leading-[0.98] tracking-[-0.02em] text-grocer-brown md:text-5xl">
            Get the list before the shelf moves.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-foreground/70">
            One email a fortnight. One subject, properly explained. A basket of three to five things
            we'd actually buy. No countdown timers.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-grocer-tomato px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            Subscribe free
          </Link>
        </div>
      </section>
    </div>
  );
}
