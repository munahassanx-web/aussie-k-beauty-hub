import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getLearnArticle, learnArticles } from "@/lib/learn-articles";
import { ArticleProductPicks } from "@/components/article-product-picks";
import { GrocerStripe } from "@/components/grocer-stripe";

export const Route = createFileRoute("/learn/article/$slug")({
  loader: ({ params }) => {
    const article = getLearnArticle(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found | Skin Grocer" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.title} | Skin Grocer Learn`;
    const url = `https://skingrocer.com.au/learn/article/${loaderData.slug}`;
    const cover =
      typeof loaderData.cover === "string" && loaderData.cover
        ? /^https?:\/\//i.test(loaderData.cover)
          ? loaderData.cover
          : `https://skingrocer.com.au${loaderData.cover}`
        : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.blurb },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.blurb },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
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
                "@type": "Article",
                headline: loaderData.title,
                description: loaderData.standfirst,
                mainEntityOfPage: url,
                about: loaderData.keyPoints,
                articleSection: loaderData.pillar,
                ...(cover ? { image: cover } : {}),
                author: { "@type": "Organization", name: "Skin Grocer" },
                publisher: { "@type": "Organization", name: "Skin Grocer" },
                citation: loaderData.sources.map((s) => s.label),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Learn Hub",
                    item: "https://skingrocer.com.au/learn/hub",
                  },
                  { "@type": "ListItem", position: 2, name: loaderData.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-display text-3xl text-foreground">We haven't published this one yet</p>
      <Link to="/learn/hub" className="mt-6 inline-block text-sm text-primary underline">
        Back to the Learn Hub
      </Link>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const article = Route.useLoaderData();
  const related = article.related
    .map((s) => learnArticles.find((a) => a.slug === s))
    .filter(Boolean) as typeof learnArticles;

  return (
    <article>
      <header className="mx-auto max-w-3xl px-6 pt-16 pb-10 md:pt-24">
        <Link
          to="/learn/hub"
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-clay"
        >
          ← Learn Hub
        </Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-clay">
          {article.meta}
        </p>
        <h1 className="mt-5 font-display text-[36px] leading-[1.04] tracking-[-0.02em] text-foreground md:text-[56px]">
          {article.title}
        </h1>
        <p className="mt-7 text-[17px] leading-relaxed text-muted-foreground md:text-[19px]">
          {article.standfirst}
        </p>
        <p className="mt-7 border-t border-foreground/15 pt-5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
          {article.read} · Skin Grocer Curation Desk
        </p>
      </header>

      <div className="mx-auto max-w-5xl px-6">
        <figure className="overflow-hidden rounded-sm">
          <img
            src={article.cover}
            alt={article.coverAlt}
            className="h-[260px] w-full object-cover md:h-[440px]"
          />
          {/* Reusable Skin Grocer brand band — same motif as the site header */}
          <GrocerStripe className="h-[6px] w-full md:h-[10px]" />
        </figure>
      </div>

      <div className="mx-auto mt-14 max-w-3xl px-6">
        {article.sections.map((s) => (
          <section key={s.heading ?? s.body.slice(0, 24)} className="mb-10">
            {s.heading && (
              <h2 className="font-display text-[24px] leading-tight text-foreground md:text-[30px]">
                {s.heading}
              </h2>
            )}
            <p className="mt-4 text-[16px] leading-[1.75] text-muted-foreground">{s.body}</p>
          </section>
        ))}

        <aside className="mt-14 rounded-sm bg-sand px-7 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-clay">
            The short version
          </p>
          <ul className="mt-5 space-y-3">
            {article.keyPoints.map((k) => (
              <li key={k} className="flex gap-3 text-[15px] leading-relaxed text-foreground/80">
                <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-clay" />
                {k}
              </li>
            ))}
          </ul>
        </aside>

        <section className="mt-12 border-t border-foreground/15 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            What we read
          </p>
          <ul className="mt-4 space-y-2">
            {article.sources.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[13.5px] leading-relaxed text-muted-foreground underline underline-offset-4 hover:text-clay"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[12px] leading-relaxed text-muted-foreground/70">
            Educational only — not medical advice. Persistent or severe skin concerns deserve a
            dermatologist.
          </p>
        </section>
      </div>

      <ArticleProductPicks article={article} />

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-6 pb-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground">
            Keep reading
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                to="/learn/article/$slug"
                params={{ slug: a.slug }}
                className="group flex h-full flex-col border-t border-foreground/15 pt-5 transition-colors hover:border-clay"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-clay">
                  {a.meta}
                </p>
                <h3 className="mt-3 font-display text-xl leading-[1.2] text-foreground group-hover:text-primary">
                  {a.title}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                  {a.blurb}
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
                  {a.read}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
