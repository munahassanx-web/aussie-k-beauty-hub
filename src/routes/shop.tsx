import { createFileRoute, Link } from "@tanstack/react-router";
import products from "@/assets/products.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Skin Grocer" },
      { name: "description", content: "Browse authentic Korean skincare and premium imports — cleansers, serums, moisturisers, masks and SPF — locally stocked with same-day delivery." },
      { property: "og:title", content: "Shop — Skin Grocer" },
      { property: "og:description", content: "Authentic K-beauty, locally stocked in Australia." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

const items = [
  { name: "Hydrating Snail Mucin Essence", brand: "COSRX", price: "$32", tag: "Bestseller" },
  { name: "Centella Calming Toner", brand: "SKIN1004", price: "$28", tag: "New" },
  { name: "Vitamin C Brightening Serum", brand: "Beauty of Joseon", price: "$36", tag: null },
  { name: "Rice Probiotics Cleansing Foam", brand: "I'm From", price: "$30", tag: null },
  { name: "Relief Sun SPF50+", brand: "Beauty of Joseon", price: "$22", tag: "Cult" },
  { name: "Cica Recovery Cream", brand: "Anua", price: "$34", tag: null },
  { name: "Peach Sake Pore Mask", brand: "Some By Mi", price: "$26", tag: null },
  { name: "Heartleaf Soothing Ampoule", brand: "Anua", price: "$38", tag: "New" },
];

function Shop() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">The shop</p>
        <h1 className="mt-3 text-5xl text-foreground md:text-6xl">Carefully sourced. <em className="not-italic text-primary">Always authentic.</em></h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Every product on Skin Grocer is sourced directly through verified
          brand partners and stocked here in Australia for same-day delivery.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {["All", "Cleanse", "Tone", "Treat", "Moisturise", "Protect", "Masks"].map((c, i) => (
          <button key={c} className={`rounded-full border px-5 py-2 text-sm transition-colors ${i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <div key={p.name} className="group">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              <img src={products} alt={p.name} loading="lazy" width={1400} height={1000} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {p.tag && (
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur">{p.tag}</span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</p>
              <h3 className="mt-1 font-display text-lg text-foreground">{p.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-foreground">{p.price}</span>
                <button className="text-xs font-medium uppercase tracking-wider text-primary hover:underline">Add +</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 rounded-3xl bg-secondary/60 p-10 text-center md:p-16">
        <h2 className="text-3xl text-foreground md:text-4xl">Not sure where to start?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Tell us a bit about your skin and we'll build a routine for you — from your first cleanse to your final SPF.
        </p>
        <Link to="/journey" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          Start your journey
        </Link>
      </div>
    </div>
  );
}
