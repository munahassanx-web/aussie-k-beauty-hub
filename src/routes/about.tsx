import { createFileRoute, Link } from "@tanstack/react-router";
import glow from "@/assets/glow.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Skin Grocer" },
      { name: "description", content: "Skin Grocer is an Australian-owned team dedicated to authentic, clean and affordable Korean skincare — stocked locally, delivered same-day." },
      { property: "og:title", content: "About — Skin Grocer" },
      { property: "og:description", content: "An Australian team obsessed with authentic K-beauty." },
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
        <h1 className="mt-4 text-5xl text-foreground md:text-7xl">A grocer's approach <em className="not-italic text-primary">to skincare.</em></h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          We treat skincare like the corner grocer treats produce — pick the best,
          stock it fresh, know it inside out, and pass on a fair price.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 md:grid-cols-2">
        <img src={glow} alt="Glowing skin close-up" loading="lazy" width={1200} height={1400} className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
        <div className="space-y-5 text-muted-foreground">
          <p className="text-lg">
            Skin Grocer is a proudly <span className="font-medium text-foreground">Australian owned and operated</span> skincare destination,
            built by a small team who fell in love with Korean skincare and were
            tired of paying triple the price — or rolling the dice on knock-offs.
          </p>
          <p>
            We work directly with verified brand partners in Korea, Japan and a
            handful of other premium markets, then warehouse everything locally in
            Sydney. That means three things you can count on: <span className="font-medium text-foreground">authenticity</span>,
            <span className="font-medium text-foreground"> affordability</span>, and
            <span className="font-medium text-foreground"> same-day delivery</span>.
          </p>
          <p>
            And because skincare can be overwhelming, we don't just sell you a
            bottle and disappear. Every product ships with clear application
            guidance, and our team is on hand to help you build a ritual that
            actually fits your skin — from the very first cleanse to the final
            layer of SPF.
          </p>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl text-foreground md:text-5xl">What we stand for</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Authenticity, always", d: "Direct partnerships only. No grey-market, no guesswork." },
              { n: "02", t: "Fair, honest pricing", d: "We cut the import middlemen so you don't pay tourist tax." },
              { n: "03", t: "Service that stays", d: "We guide your routine long after the parcel lands." },
              { n: "04", t: "Locally stocked", d: "Every product warehoused in Sydney, ready to ship today." },
              { n: "05", t: "Clean by default", d: "We vet ingredient lists before anything earns a shelf." },
              { n: "06", t: "Community first", d: "A small Aussie team that answers every message." },
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
        <h2 className="text-4xl text-foreground md:text-5xl">Ready to glow?</h2>
        <p className="mt-4 text-muted-foreground">Browse the shelves or let us build your routine.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Shop the edit</Link>
          <Link to="/journey" className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium hover:bg-foreground/5">Start your journey</Link>
        </div>
      </section>
    </>
  );
}
