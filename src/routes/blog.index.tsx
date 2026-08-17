import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { NewsletterForm } from "@/components/newsletter-form";
import { newsletterIssues, upcomingIssues } from "@/lib/newsletter-issues";
import { listPublishedIssues } from "@/lib/published-issues.functions";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
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

/** "The Hydration Issue" → "hydration" — a Nudie-style lowercase topic tag. */
function categoryOf(theme: string) {
  return theme.replace(/^the\s+/i, "").replace(/\s+issue$/i, "").trim().toLowerCase() || "k-beauty";
}

function excerpt(text: string, max = 150) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max)).trim()}…`;
}

export const Route = createFileRoute("/blog/")({
  loader: async () => ({ published: await listPublishedIssues() }),
  head: () => ({
    meta: [
      { title: "The Skin Grocer Blog — Korean Skincare, Written for Australia" },
      {
        name: "description",
        content:
          "K-beauty explained for Australian skin: ingredient deep dives, Seoul trend reports, honest product tests and curated routines from the Skin Grocer team.",
      },
      { property: "og:title", content: "The Skin Grocer Blog — K-Beauty for Australian Skin" },
      {
        property: "og:description",
        content:
          "Ingredients decoded, Korean trends translated, products tested on real Australian skin. New posts every fortnight.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { published } = Route.useLoaderData();
  const posts = useMemo(() => [...published, ...newsletterIssues], [published]);
  const liveNumbers = new Set(posts.map((i) => i.number));
  const upcoming = upcomingIssues.filter((i) => !liveNumbers.has(i.number));

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => categoryOf(p.theme)))),
    [posts],
  );
  const [active, setActive] = useState<string>("all");

  const [featured, ...rest] = posts;
  const filtered = rest.filter((p) => active === "all" || categoryOf(p.theme) === active);

  const shopNow = SHOP_PRODUCTS.filter((p) => !p.comingSoon).slice(0, 6);

  return (
    <div className="bg-background">
      {/* Masthead */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center md:pt-28">
        <Reveal>
          <p className="eyebrow eyebrow-rule justify-center text-clay">Skin Grocer Journal</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="display-hero mx-auto mt-6 max-w-4xl">The Blog</h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-2xl text-[15.5px] leading-relaxed text-foreground/70">
            Korean skincare, translated for Australian weather. Ingredient explainers, Seoul trend
            reports, honest product tests and the routines we'd actually build — one subject at a
            time, no SALE SALE SALE.
          </p>
        </Reveal>
      </section>

      {/* Featured post — big editorial card, Nudie-style */}
      {featured ? (
        <section className="mx-auto max-w-6xl px-6 pb-14">
          <Reveal>
            <Link
              to="/blog/$slug"
              params={{ slug: featured.slug }}
              className="group grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-14"
            >
              <div className="media-frame overflow-hidden rounded-sm">
                <img
                  src={featured.cover || issueCovers[featured.number]?.src}
                  alt={featured.coverAlt}
                  className="h-[300px] w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04] md:h-[460px]"
                />
              </div>
              <div>
                <span className="inline-block rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                  {categoryOf(featured.theme)}
                </span>
                <h2 className="display-section mt-5 leading-[1.02]">{featured.title}</h2>
                <p className="mt-5 text-[15px] leading-relaxed text-foreground/70">
                  {excerpt(featured.standfirst, 220)}
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {featured.date}
                </p>
                <span className="arrow-slide mt-7 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  <span className="underline-grow">Read more</span>
                  <span className="arrow">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      ) : null}

      {/* Category filter */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center gap-2 border-y border-border/70 py-5">
          <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Topics
          </span>
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/70 hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Post grid */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, idx) => (
            <Reveal key={p.slug} delay={idx * 70}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="group flex h-full flex-col">
                <div className="media-frame aspect-[4/3] overflow-hidden rounded-sm">
                  <img
                    src={p.cover || issueCovers[p.number]?.src}
                    alt={p.coverAlt || issueCovers[p.number]?.alt || p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
                  />
                </div>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-clay">
                  {categoryOf(p.theme)}
                </p>
                <h3 className="mt-2 font-display text-[24px] leading-[1.15] text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-foreground/65">
                  {excerpt(p.standfirst)}
                </p>
                <span className="arrow-slide mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <span className="underline-grow">Read more</span>
                  <span className="arrow">→</span>
                </span>
              </Link>
            </Reveal>
          ))}

          {upcoming.map((u) => (
            <div key={u.number} className="flex h-full flex-col opacity-80">
              <div className="aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src={issueCovers[u.number]?.src}
                  alt={issueCovers[u.number]?.alt ?? u.title}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[45%]"
                />
              </div>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {categoryOf(u.theme)} · coming soon
              </p>
              <h3 className="mt-2 font-display text-[24px] leading-[1.15] text-foreground/70">
                {u.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-foreground/55">
                In the works. Hero products: {u.heroes}.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop now strip — Nudie pairs every blog with product */}
      <section className="border-y border-border/70 bg-sand/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="display-section">Shop the reads</h2>
            <Link
              to="/shop"
              className="arrow-slide inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary"
            >
              <span className="underline-grow">All products</span>
              <span className="arrow">→</span>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {shopNow.map((p) => (
              <Link key={p.priceId} to="/shop" className="group">
                <div className="aspect-square overflow-hidden rounded-sm bg-background">
                  <img
                    src={p.image}
                    alt={`${p.brand} ${p.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                  {p.brand}
                </p>
                <p className="text-[13px] leading-snug text-foreground">{p.name}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="eyebrow eyebrow-rule justify-center text-clay">Every fortnight</p>
          <h2 className="display-section mt-5">Never miss a post.</h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/70">
            One email a fortnight with the new post, the products behind it, and what Korea is
            actually buying right now. No countdown timers.
          </p>
          <NewsletterForm source="footer" />
        </div>
      </section>
    </div>
  );
}
