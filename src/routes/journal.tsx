import { createFileRoute, Link } from "@tanstack/react-router";
import { journalPosts } from "@/lib/journal-posts";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Skin Journal — Skin Grocer" },
      { name: "description", content: "Routines, ingredient deep-dives and K-beauty guides written by the Skin Grocer team for Australian skin." },
      { property: "og:title", content: "Skin Journal — Skin Grocer" },
      { property: "og:description", content: "Routines, ingredient deep-dives and K-beauty guides written by the Skin Grocer team for Australian skin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
  component: JournalPage,
});

function JournalPage() {
  const [featured, ...rest] = journalPosts;
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.25em] text-primary">Skin Journal</p>
      <h1 className="mt-3 text-5xl text-foreground md:text-7xl">
        Read up. <em className="not-italic text-primary">Glow up.</em>
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Routines, ingredient breakdowns and unfiltered K-beauty notes — written for Australian skin, weather and shopping habits.
      </p>

      {/* Featured */}
      <Link to="/journal/$slug" params={{ slug: featured.slug }} className="group relative z-10 mt-14 grid gap-8 md:grid-cols-2 md:items-center cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <img
            src={featured.cover}
            alt={featured.title}
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            Featured · {featured.category} · {featured.readTime}
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground transition-colors group-hover:text-primary md:text-5xl">
            {featured.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">{featured.excerpt}</p>
          <span className="mt-6 inline-flex items-center text-sm font-medium text-primary">Read the piece →</span>
        </div>
      </Link>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link to="/journal/$slug" params={{ slug: p.slug }} key={p.slug} className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src={p.cover}
                alt={p.title}
                loading="lazy"
                width={1024}
                height={1280}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                {p.category} · {p.readTime}
              </p>
              <h2 className="mt-2 font-display text-2xl text-foreground transition-colors group-hover:text-primary">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
