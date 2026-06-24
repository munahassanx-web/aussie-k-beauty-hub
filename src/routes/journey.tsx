import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Your Journey — Skin Grocer" },
      { name: "description", content: "Expert guidance for every step of your skincare ritual — from your first cleanse to your final SPF. Detailed application notes for every product." },
      { property: "og:title", content: "Your Skincare Journey — Skin Grocer" },
      { property: "og:description", content: "From first cleanse to final SPF — guided every step." },
      { property: "og:url", content: "/journey" },
    ],
    links: [{ rel: "canonical", href: "/journey" }],
  }),
  component: Journey,
});

const steps = [
  { n: "01", t: "Cleanse", d: "Start clean. A gentle gel or oil to lift the day off your skin — never stripping.", time: "AM + PM" },
  { n: "02", t: "Tone", d: "Rebalance and prep. A hydrating toner softens skin so everything that follows works harder.", time: "AM + PM" },
  { n: "03", t: "Treat", d: "Target what matters. Essences, ampoules and serums chosen for your specific goals.", time: "AM + PM" },
  { n: "04", t: "Hydrate", d: "Seal in moisture. A lightweight or rich cream depending on your skin's mood.", time: "AM + PM" },
  { n: "05", t: "Protect", d: "Never skip SPF. The single most important step in any skincare ritual — full stop.", time: "AM only" },
];

function Journey() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Your routine</p>
        <h1 className="mt-4 text-5xl text-foreground md:text-7xl">From first cleanse <em className="not-italic text-primary">to final glow.</em></h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Skincare isn't complicated when someone walks you through it. Here's
          the ritual we recommend to every new Skin Grocer — and the guidance
          we'll continue to offer long after.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <ol className="relative space-y-6 border-l-2 border-primary/20 pl-8 md:space-y-10 md:pl-12">
          {steps.map((s) => (
            <li key={s.n} className="relative">
              <span className="absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground md:-left-[50px]">
                {s.n.slice(1)}
              </span>
              <div className="rounded-2xl bg-secondary/50 p-7 md:p-10">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-3xl text-foreground md:text-4xl">{s.t}</h2>
                  <span className="text-xs uppercase tracking-[0.2em] text-accent">{s.time}</span>
                </div>
                <p className="mt-3 text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-4xl text-foreground md:text-5xl">Application, by us.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Every Skin Grocer product ships with our own application notes — written
            in plain English, not lifted from the back of the box. Here's the kind
            of guidance you'll receive:
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              { t: "Snail Mucin Essence", d: "After toner, dispense 3–4 drops, pat (don't rub) until absorbed. Layer twice for extra hydration." },
              { t: "Vitamin C Serum", d: "AM only. Apply 2 drops onto clean, dry skin before moisturiser. Always follow with SPF." },
              { t: "Centella Toner", d: "After cleansing, decant onto cotton pad or palms. Sweep upward, neck to forehead." },
              { t: "SPF50+ Sun Cream", d: "Final step every morning. Use two fingers' worth for face and neck. Reapply every 2 hours." },
            ].map((g) => (
              <div key={g.t} className="rounded-2xl bg-background p-7">
                <h3 className="font-display text-xl text-foreground">{g.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl text-foreground md:text-5xl">Got a question? We've got time.</h2>
        <p className="mt-4 text-muted-foreground">Drop us a message and our team will guide your next step — no pressure, no upsell.</p>
        <Link to="/contact" className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Chat with our team</Link>
      </section>
    </>
  );
}
