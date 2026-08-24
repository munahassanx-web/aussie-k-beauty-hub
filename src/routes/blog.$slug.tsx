import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GroceryLabel, SectionHeading } from "@/components/grocery-label";
import { getIssue, newsletterIssues } from "@/lib/newsletter-issues";
import { getPublishedIssue } from "@/lib/published-issues.functions";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function parseIssueDateToIso(dateStr: string): string | undefined {
  const match = dateStr.match(
    /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/,
  );
  if (!match) return undefined;
  const [, day, month, year] = match;
  const monthIndex = MONTHS.indexOf(month as (typeof MONTHS)[number]);
  if (monthIndex === -1) return undefined;
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const HOUSE_BYLINE = "The Skin Grocer Team";
const SITE_LOGO_URL =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/gwAaOXihtTTGgkEaOKEPWaclwS23/social-images/social-1784706252879-hf_20260721_011553_e0d5b100-374e-4eb3-a3e3-9303ef469a0d.webp";


export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const issue = getIssue(params.slug) ?? (await getPublishedIssue({ data: { slug: params.slug } }));
    if (!issue) throw notFound();
    return { issue };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Issue unavailable — Skin Grocer" }, { name: "robots", content: "noindex" }] };
    }
    const { issue } = loaderData;
    const title = `${issue.title} — Skin Grocer Blog`;
    const url = `https://skingrocer.com.au/blog/${issue.slug}`;
    const cover = typeof issue.cover === "string" && issue.cover
      ? (/^https?:\/\//i.test(issue.cover) ? issue.cover : `https://skingrocer.com.au${issue.cover}`)
      : undefined;
    const datePublished = parseIssueDateToIso(issue.date);
    return {
      meta: [
        { title },
        { name: "description", content: issue.standfirst },
        { property: "og:title", content: title },
        { property: "og:description", content: issue.standfirst },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(cover
          ? [
              { property: "og:image", content: cover },
              { name: "twitter:image", content: cover },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                headline: issue.title,
                description: issue.standfirst,
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": url,
                },
                ...(cover ? { image: cover } : {}),
                ...(datePublished
                  ? { datePublished, dateModified: datePublished }
                  : {}),
                author: {
                  "@type": "Organization",
                  name: HOUSE_BYLINE,
                },
                publisher: {
                  "@type": "Organization",
                  name: "Skin Grocer",
                  logo: {
                    "@type": "ImageObject",
                    url: SITE_LOGO_URL,
                  },
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Blog", item: "https://skingrocer.com.au/blog" },
                  { "@type": "ListItem", position: 2, name: issue.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },

  notFoundComponent: IssueNotFound,
  component: IssuePage,
});

function IssueNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl text-grocer-brown">That post isn’t on the shelf</h1>
      <Link
        to="/blog"
        className="mt-8 inline-block border-b-2 border-grocer-tomato pb-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-grocer-tomato"
      >
        Back to the blog
      </Link>
    </div>
  );
}

function ProductTile({
  name,
  brand,
  price,
  image,
  note,
}: {
  name: string;
  brand: string;
  price?: string;
  image?: string;
  note?: string;
}) {
  return (
    <Link
      to="/shop"
      className="group flex flex-col rounded-sm border-2 border-grocer-brown/15 bg-background p-4 transition-colors hover:border-grocer-tomato"
    >
      {image ? (
        <div className="aspect-square overflow-hidden rounded-sm bg-grocer-cream">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-grocer-green">
        {brand}
      </p>
      <p className="mt-1 font-display text-lg leading-tight text-grocer-brown">{name}</p>
      {note ? <p className="mt-2 text-[13px] leading-relaxed text-foreground/65">{note}</p> : null}
      {price ? <p className="mt-3 text-sm text-grocer-tomato">{price}</p> : null}
    </Link>
  );
}

function IssuePage() {
  const { issue } = Route.useLoaderData();
  const others = newsletterIssues.filter((i) => i.slug !== issue.slug);

  return (
    <article className="bg-grocer-cream">
      {/* Masthead */}
      <header className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center md:pt-24">
        <p className="font-display text-[13px] uppercase tracking-[0.34em] text-grocer-green">
          Skin Grocer Blog · No. {issue.number}
        </p>
        <p className="mt-6 font-display text-sm uppercase tracking-[0.26em] text-grocer-tomato">
          {issue.theme}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-[40px] uppercase leading-[0.94] tracking-[-0.03em] text-grocer-brown md:text-[76px]">
          {issue.title}
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-foreground/70">
          {issue.standfirst}
        </p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-foreground/45">
          Written by <span className="text-grocer-green">{HOUSE_BYLINE}</span> — {issue.date}
        </p>
      </header>

      <img
        src={issue.cover}
        alt={issue.coverAlt}
        className="mx-auto h-[280px] w-full max-w-6xl object-cover px-6 md:h-[440px]"
      />

      <div className="mx-auto max-w-5xl px-6">
        {/* 01 — The big skin question */}
        <section className="border-t-2 border-grocer-brown/15 py-16 md:py-20">
          <SectionHeading
            index="01"
            label="🧠 The big skin question"
            tone="green"
            title={issue.bigQuestion.question}
          />
          <div className="max-w-3xl space-y-5 text-[15.5px] leading-[1.75] text-foreground/80">
            {issue.bigQuestion.body.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-8 rounded-sm border-2 border-grocer-tomato/30 bg-background p-6 md:grid-cols-[260px_1fr] md:p-8">
            {issue.bigQuestion.pick.image ? (
              <img
                src={issue.bigQuestion.pick.image}
                alt={issue.bigQuestion.pick.name}
                loading="lazy"
                className="h-64 w-full rounded-sm object-cover"
              />
            ) : null}
            <div>
              <GroceryLabel tone="tomato">🛒 Our pick</GroceryLabel>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-grocer-green">
                {issue.bigQuestion.pick.brand}
              </p>
              <h3 className="mt-1 font-display text-3xl text-grocer-brown">
                {issue.bigQuestion.pick.name}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/70">
                {issue.bigQuestion.pick.note}
              </p>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-grocer-brown">
                ⭐ Why we picked it
              </p>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-foreground/80">
                {issue.bigQuestion.pick.reasons.map((r) => (
                  <li key={r} className="flex gap-3">
                    <span className="text-grocer-green">—</span>
                    {r}
                  </li>
                ))}
              </ul>
              <Link
                to="/shop"
                className="mt-7 inline-block rounded-full bg-grocer-brown px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-background transition-transform duration-300 hover:-translate-y-0.5"
              >
                Shop toner →
              </Link>
            </div>
          </div>
        </section>

        {/* 02 — Seoul to Melbourne */}
        <section className="border-t-2 border-grocer-brown/15 py-16 md:py-20">
          <SectionHeading
            index="02"
            label="🇰🇷 Seoul → Melbourne"
            tone="brown"
            title={`${issue.seoul.ingredient}: what Korea already knows`}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-sm border-2 border-grocer-brown/15 bg-background p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">
                Korea
              </p>
              <p className="mt-2 text-2xl">{issue.seoul.koreaHeat}</p>
            </div>
            <div className="rounded-sm border-2 border-grocer-brown/15 bg-background p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">
                Australia
              </p>
              <p className="mt-2 text-2xl">{issue.seoul.australiaHeat}</p>
            </div>
          </div>

          <dl className="mt-10 max-w-3xl space-y-7">
            <div>
              <dt className="font-display text-xl text-grocer-brown">What is it?</dt>
              <dd className="mt-2 text-[15.5px] leading-[1.75] text-foreground/80">
                {issue.seoul.whatIsIt}
              </dd>
            </div>
            <div>
              <dt className="font-display text-xl text-grocer-brown">Why Koreans love it</dt>
              <dd className="mt-2 text-[15.5px] leading-[1.75] text-foreground/80">
                {issue.seoul.whyKoreansLove}
              </dd>
            </div>
            <div>
              <dt className="font-display text-xl text-grocer-brown">Should Australians care?</dt>
              <dd className="mt-2 text-[15.5px] leading-[1.75] text-foreground/80">
                {issue.seoul.shouldAussiesCare}
              </dd>
            </div>
          </dl>

          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-grocer-green">
            Try it
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {issue.seoul.tryIt.map((p) => (
              <ProductTile key={p.name} {...p} />
            ))}
          </div>
        </section>

        {/* 03 — The aisle */}
        <section className="border-t-2 border-grocer-brown/15 py-16 md:py-20">
          <SectionHeading
            index="03"
            label="🛒 The skin grocery aisle"
            tone="butter"
            title="If your skin is feeling…"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {issue.aisle.map((a) => (
              <Link
                key={a.concern}
                to="/shop"
                className="group flex gap-4 rounded-sm border-2 border-grocer-brown/15 bg-background p-4 transition-colors hover:border-grocer-green"
              >
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.pick}
                    loading="lazy"
                    className="h-24 w-24 shrink-0 rounded-sm object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-display text-xl uppercase tracking-[0.04em] text-grocer-brown">
                    {a.emoji} {a.concern}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-grocer-green">
                    {a.brand}
                  </p>
                  <p className="text-[14px] leading-snug text-foreground">{a.pick}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground/65">{a.why}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-[13px] italic text-foreground/60">
            One product per concern. Not seventeen. That's curation.
          </p>
        </section>

        {/* 04 — 5-minute routine */}
        <section className="border-t-2 border-grocer-brown/15 py-16 md:py-20">
          <SectionHeading
            index="04"
            label="⏱ The 5-minute routine"
            tone="green"
            title="The “I can't be bothered” routine"
          />
          <p className="max-w-2xl text-[15.5px] leading-[1.75] text-foreground/80">
            {issue.fiveMinute.intro}
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {issue.fiveMinute.steps.map((s) => (
              <Link
                key={s.step}
                to="/shop"
                className="group rounded-sm border-2 border-grocer-brown/15 bg-background p-4 transition-colors hover:border-grocer-tomato"
              >
                {s.image ? (
                  <div className="aspect-square overflow-hidden rounded-sm bg-grocer-cream">
                    <img
                      src={s.image}
                      alt={s.pick}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <p className="mt-4 font-display text-lg text-grocer-brown">{s.step}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/65">{s.what}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-grocer-green">
                  {s.brand}
                </p>
                <p className="text-[13.5px] leading-snug text-foreground">{s.pick}</p>
              </Link>
            ))}
          </div>
          <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-grocer-brown">
            {issue.fiveMinute.closer}
          </p>
        </section>

        {/* 05 — Skin for everyone */}
        <section className="border-t-2 border-grocer-brown/15 py-16 md:py-20">
          <SectionHeading
            index="05"
            label="🌏 Skin for everyone"
            tone="brown"
            title={issue.everyone.topic}
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
            <img
              src={issue.everyone.image}
              alt={issue.everyone.imageAlt}
              loading="lazy"
              className="h-[360px] w-full rounded-sm object-cover lg:h-[520px]"
            />
            <div className="space-y-5 text-[15.5px] leading-[1.75] text-foreground/80">
              {issue.everyone.body.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
              <Link
                to="/learn/article/$slug"
                params={{ slug: "deeper-skin-tones-k-beauty" }}
                className="inline-block border-b-2 border-grocer-tomato pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-grocer-tomato"
              >
                Read the full guide →
              </Link>
            </div>
          </div>
        </section>

        {/* 06 — We tried it */}
        <section className="border-t-2 border-grocer-brown/15 py-16 md:py-20">
          <SectionHeading
            index="06"
            label="⭐ We tested it"
            tone="butter"
            title={`${issue.weTriedIt.duration.split(",")[0]} with ${issue.weTriedIt.brand} ${issue.weTriedIt.product}`}
          />
          <div className="grid gap-8 rounded-sm border-2 border-grocer-brown/15 bg-background p-6 md:grid-cols-[240px_1fr] md:p-8">
            {issue.weTriedIt.image ? (
              <img
                src={issue.weTriedIt.image}
                alt={issue.weTriedIt.product}
                loading="lazy"
                className="h-56 w-full rounded-sm object-cover"
              />
            ) : null}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/55">
                {issue.weTriedIt.duration}
              </p>
              <dl className="mt-5 divide-y divide-grocer-brown/10">
                {issue.weTriedIt.scores.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-[13.5px] uppercase tracking-[0.12em] text-foreground/70">
                      {s.label}
                    </dt>
                    <dd className="text-[15px] text-grocer-brown">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-grocer-tomato">
                Our verdict
              </p>
              <p className="mt-2 font-display text-xl leading-snug text-grocer-brown">
                “{issue.weTriedIt.verdict}”
              </p>
            </div>
          </div>
        </section>

        {/* 07 — The basket */}
        <section className="border-t-2 border-grocer-brown/15 py-16 md:py-20">
          <SectionHeading
            index="07"
            label="🧺 This fortnight's basket"
            tone="tomato"
            title={`The Skin Grocery Basket — ${issue.basket.forWho}`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {issue.basket.items.map((p) => (
              <ProductTile key={p.name} {...p} />
            ))}
          </div>
          <Link
            to="/shop"
            className="mt-9 inline-block rounded-full bg-grocer-tomato px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            Build the basket →
          </Link>
        </section>

        {/* 08 — Ask the grocer */}
        <section className="border-t-2 border-grocer-brown/15 py-16 md:py-20">
          <SectionHeading
            index="08"
            label="💌 Ask the grocer"
            tone="green"
            title={issue.askTheGrocer.prompt}
          />
          <ol className="grid gap-4 sm:grid-cols-2">
            {issue.askTheGrocer.options.map((o, idx) => (
              <li
                key={o}
                className="flex gap-4 rounded-sm border-2 border-grocer-brown/15 bg-background p-5"
              >
                <span className="font-display text-2xl text-grocer-butter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-[15px] leading-snug text-foreground/85">{o}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-foreground/70">
            Tell us which one to dig into next. We actually read them — and the answers become the
            next issue.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-full bg-grocer-brown px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            Send us your question
          </Link>
        </section>
      </div>

      {/* More issues */}
      <section className="border-t-2 border-grocer-brown/15 bg-background px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-[28px] uppercase tracking-[-0.02em] text-grocer-brown">
            More from the blog
          </h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/blog/$slug"
                params={{ slug: o.slug }}
                className="rounded-sm border-2 border-grocer-brown/20 px-5 py-3 text-[13px] text-grocer-brown hover:border-grocer-tomato"
              >
                Issue {o.number} — {o.theme}
              </Link>
            ))}
            <Link
              to="/blog"
              className="rounded-sm border-2 border-grocer-brown/20 px-5 py-3 text-[13px] text-grocer-brown hover:border-grocer-tomato"
            >
              All posts →
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
