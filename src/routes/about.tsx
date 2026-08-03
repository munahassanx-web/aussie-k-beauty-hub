import { createFileRoute, Link } from "@tanstack/react-router";
import verifyAsset from "@/assets/verify-batch-code.png.asset.json";
import packingAsset from "@/assets/packing-wax-seal.png.asset.json";
import warehouseStockAsset from "@/assets/warehouse-stock.png.asset.json";
import deskFlatlay from "@/assets/founder-desk-flatlay.jpg";
import signatureAsset from "@/assets/signature-skin-grocer.png";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Skin Grocer" },
      { name: "description", content: "A Melbourne-based team sourcing authentic K-beauty directly from Korea, batch-verifying every arrival, and shipping locally with a provenance card in every parcel." },
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
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Our story</p>
        <h1 className="mt-4 text-5xl text-foreground md:text-7xl">
          Proof, not promises.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          You shouldn't have to gamble on whether your K-beauty is real. So we built the shelf we couldn't find — sourced direct, checked by hand, sent from Melbourne.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <figure className="overflow-hidden rounded-[2rem]">
          <img
            src={verifyAsset.url}
            alt="Gloved hands checking a batch code on a Korean skincare bottle with a jeweller's loupe against a verification checklist"
            loading="lazy"
            width={1200}
            height={896}
            className="aspect-[16/10] w-full object-cover"
          />
        </figure>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <p className="font-display text-2xl leading-snug text-foreground md:col-span-1">
            Every bottle we sell has been in our hands before it reaches yours.
          </p>
          <div className="space-y-4 text-muted-foreground md:col-span-2">
            <p>
              We buy through verified brand partners and official Korean distributors — never grey-market middlemen. Every carton that lands in Melbourne is opened, and every batch code, seal and expiry is cross-checked before a single unit goes live.
            </p>
            <p>
              If it doesn't match the manifest, it goes straight back. If we wouldn't put it on our own faces, it never makes the shelf.
            </p>
            <p className="font-display text-xl text-foreground">
              Authenticity isn't a marketing word for us. It's the whole point.
            </p>
          </div>
        </div>
      </section>


      {/* A note from the team */}
      <section className="border-y border-border/60 bg-background py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">A note from us</p>
            <h2 className="mt-4 text-4xl text-foreground md:text-5xl">Small team. Real stock. No guesswork.</h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                We are a small Melbourne-based team built by people who were tired of gambling on overseas checkouts and hoping the bottle that finally turned up was real.
              </p>
              <p>
                So we do the checking ourselves. We know which distributor each carton came from, we cross-check the batch codes and seals before anything is packed, and if we would not put it on our own faces, it does not go on the shelf.
              </p>
              <p>
                If something is not right, you are not emailing a call centre — you are emailing us. That is the whole promise, and it is not a big one to keep when the team is this small.
              </p>
            </div>
            <div className="mt-8">
              <img
                src={signatureAsset}
                alt="Handwritten signature from the Skin Grocer team"
                loading="lazy"
                width={288}
                height={96}
                className="h-16 w-auto opacity-90"
              />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Skin Grocer · Melbourne, Australia · Est. by skin nerds
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Message us directly</Link>
              <Link to="/journey" className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium hover:bg-foreground/5">See how we verify</Link>
            </div>
          </div>
          <figure className="m-0">
            <img
              src={deskFlatlay}
              alt="Hands writing a note at the Skin Grocer desk, surrounded by Korean skincare samples and a provenance card"
              loading="lazy"
              width={1024}
              height={768}
              className="aspect-[4/3] w-full rounded-[2rem] object-cover"
            />
            <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Melbourne · Where every order is checked by hand
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Proof of process */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Proof, not promises</p>
          <h2 className="mt-4 text-4xl text-foreground md:text-5xl">What actually happens before it reaches you</h2>
          <p className="mt-4 text-muted-foreground">
            Authenticity is a process, not a badge. Here is ours — the same three steps behind every order.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              img: warehouseStockAsset.url,
              alt: "Cartons of Korean skincare stock being handled on shelves in the Melbourne warehouse",
              step: "Step 01",
              t: "Sourced direct, stocked locally",
              d: "We buy through verified brand partners and official distributors only, then warehouse it all in Melbourne — so nothing sits on a container for a month.",
            },
            {
              img: verifyAsset.url,
              alt: "Hands checking a batch code on a skincare bottle against a verification sheet",
              step: "Step 02",
              t: "Every batch checked by hand",
              d: "Batch codes, seals and expiry dates are cross-checked against the supplier manifest before stock is listed. Anything that does not match goes straight back.",
            },
            {
              img: packingAsset.url,
              alt: "An order being packed by hand into a cream box with a wax-sealed provenance card",

              step: "Step 03",
              t: "Packed with a provenance card",
              d: "Your order ships with a card tracing the product from its Korean source to our Melbourne shelf — so you can see the chain, not just trust it.",
            },
          ].map((s) => (
            <article key={s.step} className="overflow-hidden rounded-3xl border border-border/60 bg-background">
              <img
                src={s.img}
                alt={s.alt}
                loading="lazy"
                width={1408}
                height={1008}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-7">
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent">{s.step}</p>
                <h3 className="mt-3 font-display text-xl text-foreground">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </article>
          ))}
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

