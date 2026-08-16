import { createFileRoute, Link } from "@tanstack/react-router";
import customers from "@/assets/customers.jpg";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Skin Grocer" },
      { name: "description", content: "Real Australian customers on Skin Grocer's authentic K-beauty, next-day delivery and personal skincare guidance." },
      { property: "og:title", content: "Reviews — Skin Grocer" },
      { property: "og:description", content: "What Australia is saying about Skin Grocer." },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: Reviews,
});

const reviews = [
  { n: "Mia T.", l: "Bondi, NSW", r: 5, q: "Finally a place I can buy real COSRX without flying to Seoul. Ordered at noon, at my door by 6pm. Wild." },
  { n: "Aisha K.", l: "Melbourne, VIC", r: 5, q: "The guidance is what sets them apart. They actually messaged me with a routine after I bought my first cleanser." },
  { n: "Jordan P.", l: "Brisbane, QLD", r: 5, q: "Authentic Beauty of Joseon SPF at a fair price, delivered the next day. I've ordered four times in two months." },
  { n: "Sara L.", l: "Perth, WA", r: 5, q: "I had no idea where to start with K-beauty. Skin Grocer built me a five-step ritual and my skin has never looked better." },
  { n: "Chen W.", l: "Sydney, NSW", r: 5, q: "Genuine products, genuine people. The fact that they're a small Aussie team really shows in the service." },
  { n: "Priya R.", l: "Adelaide, SA", r: 5, q: "I cancelled my Yesstyle account. Same brands, faster shipping, and someone to ask when I'm confused." },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-accent" aria-label={`${n} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < n ? "currentColor" : "none"} stroke="currentColor" className="h-4 w-4">
          <path strokeWidth="1.5" d="M10 2l2.4 5 5.6.8-4 4 1 5.6L10 14.8 5 17.4 6 11.8 2 7.8 7.6 7z" />
        </svg>
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <>
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Reviews</p>
            <h1 className="mt-4 text-5xl text-foreground md:text-7xl">Loved by skin <em className="not-italic text-primary">all over Australia.</em></h1>
            <p className="mt-8 text-sm text-muted-foreground">Real feedback from real customers.</p>
          </div>
          <img src={customers} alt="Happy Skin Grocer customers" loading="lazy" width={1400} height={900} className="aspect-[4/3] w-full rounded-[2rem] object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.n} className="flex flex-col justify-between rounded-3xl bg-secondary/60 p-8">
              <div>
                <Stars n={r.r} />
                <blockquote className="mt-5 font-display text-xl leading-snug text-foreground">"{r.q}"</blockquote>
              </div>
              <figcaption className="mt-6 border-t border-border pt-4">
                <p className="font-medium text-foreground">{r.n}</p>
                <p className="text-sm text-muted-foreground">{r.l}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl">Your turn to glow.</h2>
          <Link to="/shop" className="mt-8 inline-flex rounded-full bg-background px-7 py-3 text-sm font-medium text-foreground hover:opacity-90">Shop the edit</Link>
        </div>
      </section>
    </>
  );
}
