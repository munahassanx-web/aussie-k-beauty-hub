import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import glow from "@/assets/glow.jpg";
import products from "@/assets/products.jpg";
import vending from "@/assets/vending.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skin Grocer — Authentic Korean Skincare, Same-Day in Australia" },
      { name: "description", content: "Australian-owned. Authentic K-beauty and premium imports, locally stocked with same-day delivery and expert guidance from start to glow." },
      { property: "og:title", content: "Skin Grocer — Authentic K-Beauty in Australia" },
      { property: "og:description", content: "Authentic, clean, affordable skincare from Korea, delivered same-day across Australia." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Proudly Australian owned
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] text-foreground md:text-7xl">
              Authentic Korean skincare,<br />
              <em className="text-primary not-italic">delivered today.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              We're a small Australian team obsessed with sourcing clean, authentic
              and genuinely affordable skincare from Korea and other hard-to-find
              corners of the world — stocked locally, shipped same-day, and guided
              every step of the way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
                Shop the edit
              </Link>
              <Link to="/journey" className="rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium text-foreground hover:bg-foreground/5">
                Start your journey →
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Delivery</dt>
                <dd className="mt-1 font-display text-2xl text-foreground">Same-day</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Stocked</dt>
                <dd className="mt-1 font-display text-2xl text-foreground">Locally</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">100%</dt>
                <dd className="mt-1 font-display text-2xl text-foreground">Authentic</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/15 blur-2xl" />
            <img
              src={hero}
              alt="Premium Korean skincare bottles arranged on linen"
              width={1600}
              height={1200}
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-background p-4 shadow-xl md:block">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Sourced in</p>
              <p className="font-display text-xl text-foreground">Seoul → Sydney</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISE STRIP */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-4">
          {[
            { t: "Same-day delivery", d: "Order by 1pm — at your door tonight." },
            { t: "Locally stocked", d: "Every product warehoused in Australia." },
            { t: "Guided routines", d: "Application notes with every product." },
            { t: "Verified authentic", d: "Sourced directly from brand partners." },
          ].map((f) => (
            <div key={t(f.t)} className="flex flex-col gap-1">
              <p className="font-display text-lg text-foreground">{f.t}</p>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">
        <img src={glow} alt="Woman applying serum, glowing skin" loading="lazy" width={1200} height={1400} className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Our promise</p>
          <h2 className="mt-3 text-4xl text-foreground md:text-5xl">A skincare aisle worth trusting.</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Skin Grocer was born from the frustration of paying inflated
            mark-ups for K-beauty in Australia — or worse, receiving
            counterfeit products from grey-market sellers. We're a dedicated
            team committed to bringing you the same shelves you'd find walking
            through Myeongdong, at prices that feel fair.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              ["Clean formulas", "Carefully vetted ingredient lists — no nasties, ever."],
              ["Hard-to-find imports", "Cult Korean and Japanese brands you can't get on the high street."],
              ["End-to-end guidance", "From your very first cleanse to your final SPF."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div>
                  <p className="font-medium text-foreground">{t}</p>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/about" className="mt-8 inline-block text-sm font-medium text-primary hover:underline">
            Read our story →
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">The edit</p>
              <h2 className="mt-3 text-4xl text-foreground md:text-5xl">Shop by ritual</h2>
            </div>
            <Link to="/shop" className="hidden text-sm font-medium text-primary hover:underline md:block">View all →</Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: "Cleanse", d: "Gentle gels, oils & balms.", c: "from-clay/30" },
              { t: "Treat", d: "Serums, essences & ampoules.", c: "from-primary/30" },
              { t: "Protect", d: "Moisturisers & daily SPF.", c: "from-accent/30" },
            ].map((c) => (
              <Link to="/shop" key={c.t} className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
                <img src={products} alt={c.t} loading="lazy" width={1400} height={1000} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-t ${c.c} via-foreground/10 to-foreground/70`} />
                <div className="absolute bottom-0 p-7 text-background">
                  <h3 className="text-3xl text-background">{c.t}</h3>
                  <p className="mt-1 text-sm opacity-90">{c.d}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VENDING / LOCATIONS */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Find us in the wild</p>
          <h2 className="mt-3 text-4xl text-foreground md:text-5xl">Skincare. From a vending machine.</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Our beautifully designed Skin Grocer vending machines bring authentic
            K-beauty essentials to gyms, salons and lifestyle spaces around
            Australia — stocked with the same trusted products you'd buy online.
          </p>
          <Link to="/contact" className="mt-8 inline-flex rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium text-foreground hover:bg-foreground/5">
            Host a machine →
          </Link>
        </div>
        <img src={vending} alt="Skin Grocer vending machine" loading="lazy" width={1000} height={1300} className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
      </section>

      {/* TESTIMONIAL TEASE */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">Reviews</p>
          <blockquote className="mt-6 font-display text-3xl leading-tight md:text-5xl">
            "Finally — a place I can buy real COSRX without flying to Seoul.
            Ordered at noon, it was at my door by 6pm."
          </blockquote>
          <p className="mt-6 text-sm opacity-80">Mia T. — Bondi, NSW</p>
          <Link to="/reviews" className="mt-10 inline-flex rounded-full bg-background px-7 py-3 text-sm font-medium text-foreground hover:opacity-90">
            Read more reviews
          </Link>
        </div>
      </section>
    </>
  );
}

// tiny helper so duplicate keys don't clash
function t(s: string) { return s; }
