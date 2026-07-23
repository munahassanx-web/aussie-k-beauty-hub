import { createFileRoute, Link } from "@tanstack/react-router";
import ourStoryAsset from "@/assets/our-story.jpg.asset.json";
const ourStory = ourStoryAsset.url;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Skin Grocer" },
      { name: "description", content: "Skin Grocer was started by a Melbourne mum who struggled to find authentic, accessible Korean skincare. Locally stocked, honestly guided, delivered next-day across Australia." },
      { property: "og:title", content: "About — Skin Grocer" },
      { property: "og:description", content: "Melbourne-based K-beauty, founded by a mum who made skincare simpler for every Australian woman." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Our story</p>
        <h1 className="mt-4 text-5xl text-foreground md:text-7xl">
          Skincare that fits <em className="not-italic text-primary">real life.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Founded by a Melbourne mum who was tired of fakes, foreign shipping fees,
          and guessing what actually worked. Skin Grocer was built for every woman
          who wants a simple, trusted routine without the mall run.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 md:grid-cols-2">
        <img
          src={ourStory}
          alt="A woman at home applying moisturiser"
          loading="lazy"
          width={1200}
          height={1400}
          className="aspect-[4/5] w-full rounded-[2rem] object-cover"
        />
        <div className="space-y-5 text-muted-foreground">
          <p className="text-lg">
            Skin Grocer started at a kitchen table in Melbourne. As a stay-at-home mum, I found it hard to get my hands on
            <span className="font-medium text-foreground"> authentic K-beauty</span>.
            The good brands were overseas, the local shelves were limited, and ordering online meant currency fees, long waits, and the risk of knock-offs.
          </p>
          <p>
            I was not especially tech-savvy, and neither were most of my friends. We just wanted a reliable place to buy the skincare we kept hearing about — and someone to tell us
            <span className="font-medium text-foreground"> how and when to use it</span>,
            in a language that made sense for our skin and our climate.
          </p>
          <p>
            So I built exactly that. A small, Melbourne-based team that sources real Korean skincare directly from verified brand partners, warehouses it locally, and answers every question like we are talking over a cup of tea. No call centres, no confusing routines, no inflated prices.
          </p>
          <p>
            Today we are focused on bringing the Korean products the Australian market has not seen yet — the gentle, results-driven formulas that work for busy mums, working women, and anyone who does not have time to wander a shopping mall. Because great skin should not be a part-time job.
          </p>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl text-foreground md:text-5xl">What we stand for</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Authenticity, always", d: "Direct brand partnerships. Every product is the real thing, no grey-market copies." },
              { n: "02", t: "Built by a mum, for mums", d: "Simple routines, clear guidance, and a team that understands real schedules." },
              { n: "03", t: "Locally stocked", d: "Everything is warehoused in Melbourne, so orders ship fast — no overseas waits." },
              { n: "04", t: "Honest guidance", d: "We explain how to use each product and why it suits your skin." },
              { n: "05", t: "Fair local pricing", d: "No surprise currency fees or inflated import mark-ups. Just Australian prices." },
              { n: "06", t: "Community first", d: "A small team that reads and replies to every message personally." },
            ].map((v) => (
              <div key={v.n} className="rounded-3xl bg-background p-8">
                <p className="font-display text-3xl text-accent">{v.n}</p>
                <h3 className="mt-4 font-display text-xl text-foreground">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl text-foreground md:text-5xl">Ready to simplify your routine?</h2>
        <p className="mt-4 text-muted-foreground">Shop the edit or take the quiz for a personalised ritual.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Shop the edit</Link>
          <Link to="/consultation" className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium hover:bg-foreground/5">Take the skin quiz</Link>
        </div>
      </section>
    </>
  );
}
