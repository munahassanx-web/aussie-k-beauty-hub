import { createFileRoute, Link } from "@tanstack/react-router";
import brandShot from "@/assets/brand-spotlight.jpg";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands — Skin Grocer" },
      { name: "description", content: "Shop authentic K-beauty brands — COSRX, Beauty of Joseon, Anua, Laneige, Sulwhasoo and more — locally stocked in Australia." },
      { property: "og:title", content: "K-Beauty Brands — Skin Grocer" },
      { property: "og:url", content: "/brands" },
    ],
    links: [{ rel: "canonical", href: "/brands" }],
  }),
  component: BrandsPage,
});

const brands: { name: string; tag: string }[] = [
  { name: "COSRX", tag: "Clinical skincare, minimal ingredients" },
  { name: "Beauty of Joseon", tag: "Korean heritage meets modern formulas" },
  { name: "Anua", tag: "Heartleaf & gentle formulations" },
  { name: "SKIN1004", tag: "Madagascar centella hero brand" },
  { name: "Numbuzin", tag: "Numbered formulas for real skin problems" },
  { name: "Abib", tag: "Barrier-first heritage skincare" },
  { name: "Mediheal", tag: "The original K-beauty sheet mask leader" },
  { name: "Some By Mi", tag: "Miracle solutions for troubled skin" },
  { name: "I'm From", tag: "Single-hero ingredient formulas" },
];

function BrandsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.25em] text-primary">Shop by Brand</p>
      <h1 className="mt-3 text-5xl text-foreground md:text-7xl">K-beauty <em className="not-italic text-primary">brands</em>.</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Every brand on Skin Grocer is sourced through verified partners and
        warehoused locally in Melbourne for next-day delivery.
      </p>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((b) => (
          <Link
            to="/shop"
            search={{ brand: b.name }}
            key={b.name}
            className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-3xl bg-foreground p-6 transition-transform hover:-translate-y-1"
          >
            <img src={brandShot} alt={b.name} loading="lazy" width={1024} height={1024} className="absolute inset-0 h-full w-full object-cover opacity-55 transition-opacity duration-500 group-hover:opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
            <h2 className="relative font-display text-3xl text-background">{b.name}</h2>
            <p className="relative mt-1 text-xs text-background/70">{b.tag}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

