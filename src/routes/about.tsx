import { createFileRoute, Link } from "@tanstack/react-router";
import ourStoryAsset from "@/assets/our-story.jpg.asset.json";
import founderAsset from "@/assets/founder-portrait.jpg.asset.json";
import warehouseAsset from "@/assets/warehouse-pack.jpg.asset.json";
import batchVerifyAsset from "@/assets/batch-verify.jpg.asset.json";
const ourStory = ourStoryAsset.url;


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Skin Grocer" },
      { name: "description", content: "Founded by a Melbourne mum who couldn't find authentic K-beauty without fakes, fees or long waits. Skin Grocer sources directly from Korea, verifies every batch, and ships locally from Melbourne." },
      { property: "og:title", content: "About — Skin Grocer" },
      { property: "og:description", content: "Australian K-beauty built on authenticity: direct from Seoul, verified in Melbourne, guided like a friend." },
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
          Built from one woman's<br className="hidden md:block" /> frustration. Made for every Australian<br className="hidden md:block" /> who was tired of guessing.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Skin Grocer started when a Melbourne mum couldn't find the Korean skincare she kept hearing about — without the fakes, the foreign fees, or the four-week wait. Today we are the place she wished existed.
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
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            It started at a kitchen table in Melbourne. As a stay-at-home mum, I wanted the skincare everyone was raving about — the gentle Korean formulas, the glass-skin serums, the sunscreens that actually felt good. But getting my hands on them meant navigating overseas websites I didn't trust, paying currency conversion and shipping fees, and waiting weeks for a parcel that might — or might not — be the real thing.
          </p>
          <p>
            I was not particularly tech-savvy. Neither were most of my friends. We just wanted someone to cut through the noise and tell us <span className="font-medium text-foreground">what to use, when to use it, and why it suited our skin and our Australian climate</span>. Not a sales pitch. Not a 12-step routine. Just honest guidance from someone who got it.
          </p>
          <p>
            So I built exactly that. Skin Grocer is a small, Melbourne-based team that sources real Korean skincare directly from verified brand partners, warehouses it locally, and answers every question like we are chatting over a cup of tea. <span className="font-medium text-foreground">No call centres. No confusing routines. No inflated prices. No grey-market stock.</span>
          </p>
          <p>
            Authenticity is not a marketing word for us — it is the whole point. Every batch is tracked, every product is the genuine article, and we are constantly bringing in the Korean brands the Australian market has not seen yet. Because busy mums, working women, and anyone who does not have time to wander a shopping mall deserve skincare that works — and a team they can trust.
          </p>
          <p className="font-display text-xl text-foreground">
            Great skin should not be a part-time job. And it should never come with a side of doubt.
          </p>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl text-foreground md:text-5xl">What we stand for</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            These six principles guide every product we stock, every answer we give, and every order we pack.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Authenticity, always", d: "Direct brand partnerships. Every product is the real thing, sourced through verified channels — never grey-market copies." },
              { n: "02", t: "Built by a mum, for real life", d: "Simple routines, clear guidance, and a team that understands busy schedules and tired skin." },
              { n: "03", t: "Locally stocked in Melbourne", d: "Everything is warehoused here, so orders ship fast — no overseas waits, no surprise delays." },
              { n: "04", t: "Honest guidance", d: "We explain how to use each product and why it suits your skin, your climate and your goals." },
              { n: "05", t: "Fair local pricing", d: "No currency conversion sting, no inflated import mark-ups. Just Australian prices for Australian women." },
              { n: "06", t: "Community first", d: "A small team that reads and replies to every message personally. You are never just an order number." },
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

