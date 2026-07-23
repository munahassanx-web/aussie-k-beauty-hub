import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getJournalPost, journalPosts } from "@/lib/journal-posts";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const post = getJournalPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Skin Journal" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} — Skin Journal` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: JournalPostPage,
});

function PostNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Article not found</h1>
      <p className="mt-3 text-muted-foreground">That piece may have moved. Head back to the Journal.</p>
      <Link to="/journal" className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground">
        Back to Journal
      </Link>
    </div>
  );
}

function JournalPostPage() {
  const { post } = Route.useLoaderData();
  const related = journalPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="pb-24">
      {/* Hero */}
      <header className="mx-auto max-w-4xl px-6 pt-16 text-center">
        <Link to="/journal" className="text-xs uppercase tracking-[0.25em] text-primary hover:underline">
          ← Skin Journal
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-accent">
          {post.category} · {post.readTime} · {post.publishedOn}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-6xl">
          {post.title}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">{post.excerpt}</p>
        <p className="mt-4 text-sm text-muted-foreground">By {post.author}</p>
      </header>

      <div className="mx-auto mt-12 max-w-5xl px-6">
        <div className="aspect-[16/9] overflow-hidden rounded-3xl">
          <img src={post.cover} alt={post.title} width={1600} height={900} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto mt-16 grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          {post.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 className="font-display text-2xl text-foreground md:text-3xl">{s.heading}</h2>}
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}

          <section className="rounded-3xl bg-accent/5 p-8">
            <h2 className="font-display text-2xl">Key takeaways</h2>
            <ul className="mt-4 space-y-2">
              {post.takeaways.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Product picks</p>
            <ul className="mt-4 space-y-4">
              {post.productPicks.map((p) => (
                <li key={p.name}>
                  <p className="font-display text-lg text-foreground">{p.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.why}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/shop"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Shop the picks
            </Link>
          </div>

          <div className="rounded-3xl bg-primary/5 p-6">
            <p className="font-display text-lg text-foreground">Not sure where to start?</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Take our 2-minute skin quiz for a routine matched to your skin and Australian climate.
            </p>
            <Link
              to="/consultation"
              className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Start the quiz →
            </Link>
          </div>
        </aside>
      </div>

      {/* Related */}
      <div className="mx-auto mt-24 max-w-7xl px-6">
        <h2 className="font-display text-3xl">Keep reading</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {related.map((r) => (
            <Link to="/journal/$slug" params={{ slug: r.slug }} key={r.slug} className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                <img src={r.cover} alt={r.title} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-accent">{r.category} · {r.readTime}</p>
              <h3 className="mt-2 font-display text-xl transition-colors group-hover:text-primary">{r.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
