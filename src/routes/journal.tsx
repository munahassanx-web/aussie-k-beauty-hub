import { createFileRoute, Link } from "@tanstack/react-router";
import glow from "@/assets/glow.jpg";
import products from "@/assets/products.jpg";
import skinMacro from "@/assets/skin-macro.jpg";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Skin Journal — Skin Grocer" },
      { name: "description", content: "Routines, ingredient deep-dives and K-beauty guides from the Skin Grocer team." },
      { property: "og:title", content: "Skin Journal — Skin Grocer" },
      { property: "og:url", content: "/journal" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
  component: JournalPage,
});

const posts = [
  { t: "The 10-step routine, demystified", c: "Routines", img: glow, read: "6 min" },
  { t: "Snail mucin: why your skin loves it", c: "Ingredients", img: products, read: "4 min" },
  { t: "Sunscreen, every single day", c: "Education", img: skinMacro, read: "3 min" },
  { t: "Building a barrier-first routine", c: "Routines", img: glow, read: "5 min" },
  { t: "Centella vs Heartleaf — what's the difference?", c: "Ingredients", img: skinMacro, read: "4 min" },
  { t: "Layering serums without pilling", c: "How-to", img: products, read: "3 min" },
];

function JournalPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.25em] text-primary">Skin Journal</p>
      <h1 className="mt-3 text-5xl text-foreground md:text-7xl">Read up. <em className="not-italic text-primary">Glow up.</em></h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Routines, ingredient breakdowns and unfiltered K-beauty notes from our team.
      </p>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link to="/journal" key={p.t} className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img src={p.img} alt={p.t} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">{p.c} · {p.read}</p>
              <h2 className="mt-2 font-display text-2xl text-foreground transition-colors group-hover:text-primary">{p.t}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
