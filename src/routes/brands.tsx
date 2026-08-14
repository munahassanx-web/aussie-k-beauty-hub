import { createFileRoute, Link } from "@tanstack/react-router";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands — Skin Grocer" },
      { name: "description", content: "Shop our 13 hand-picked K-beauty brands — AESTURA, MEDICUBE, ROUND LAB, TORRIDEN, BIODANCE and more — locally stocked in Australia." },
      { property: "og:title", content: "K-Beauty Brands — Skin Grocer" },
      { property: "og:description", content: "Thirteen hand-picked Korean labels, warehoused in Melbourne for next-day delivery across Australia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/brands" },
    ],
    links: [{ rel: "canonical", href: "/brands" }],
  }),
  component: BrandsPage,
});

type BrandCard = {
  name: string;
  tag: string;
  hero: string; // signature product image
  from: string; // gradient start
  to: string; // gradient end
  ink: "light" | "dark";
};

const brands: BrandCard[] = [
  {
    name: "AESTURA",
    tag: "Dermatologist-backed barrier repair, born in a Korean hospital lab",
    hero: "/products/aestura/atobarrier365-cream.png",
    from: "#e8f0f7", to: "#b9cede", ink: "dark",
  },
  {
    name: "BIODANCE",
    tag: "Overnight bio-collagen masks that melt into the skin",
    hero: "/products/biodance/bio-collagen-real-deep-mask.png",
    from: "#f3ecff", to: "#c9b6f2", ink: "dark",
  },
  {
    name: "Beauty of Joseon",
    tag: "Korean heritage ingredients in modern formulas",
    hero: "/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.png",
    from: "#f7efe2", to: "#d8bd90", ink: "dark",
  },
  {
    name: "Dr.G",
    tag: "Clinical care for red, blemish-prone and reactive skin",
    hero: "/products/dr-g/red-blemish-clear-soothing-foam-150ml.png",
    from: "#eaf6f0", to: "#a8d3bd", ink: "dark",
  },
  {
    name: "HARUHARU WONDER",
    tag: "Fermented black rice, clean and low-irritation",
    hero: "/products/haruharu-wonder/black-rice-hyaluronic-toner-150ml.png",
    from: "#efeae6", to: "#8f8378", ink: "light",
  },
  {
    name: "ISNTREE",
    tag: "Ingredient-led hydration and gentle exfoliation",
    hero: "/products/isntree/hyaluronic-acid-water-essence-50ml.png",
    from: "#e9f4ef", to: "#9fc9b7", ink: "dark",
  },
  {
    name: "MEDICUBE",
    tag: "PDRN and exosome technology for visible results",
    hero: "/products/medicube/pdrn-pink-peptide-serum-30ml.png",
    from: "#ffeef4", to: "#f4a9c4", ink: "dark",
  },
  {
    name: "ROUND LAB",
    tag: "The 1025 Dokdo line — simple, everyday essentials",
    hero: "/products/round-lab/1025-dokdo-toner-100ml.png",
    from: "#e8f2fb", to: "#9dc2e6", ink: "dark",
  },
  {
    name: "S.NATURE",
    tag: "Aqua Oasis hydration built on squalane and botanicals",
    hero: "/products/s-nature/aqua-squalane-serum.png",
    from: "#e6f5f7", to: "#95cbd4", ink: "dark",
  },
  {
    name: "TIRTIR",
    tag: "Milky ceramide care with a cult following",
    hero: "/products/tirtir/ceramic-milk-ampoule-40ml.png",
    from: "#fdf3ee", to: "#e7b9a2", ink: "dark",
  },
  {
    name: "TORRIDEN",
    tag: "Low-molecular hyaluronic acid, deep dive hydration",
    hero: "/products/torriden/dive-in-serum.png",
    from: "#e7eefc", to: "#8ea6e8", ink: "light",
  },
  {
    name: "WELLAGE",
    tag: "Real Hyaluronic and PDRN ampoules from a K-derm favourite",
    hero: "/products/wellage/real-hyaluronic-blue-100-ampoule-60ml.png",
    from: "#e9edf8", to: "#7f93cf", ink: "light",
  },
  {
    name: "beplain",
    tag: "Mung bean cleansing and calm, pH-balanced basics",
    hero: "/products/beplain/mung-bean-cleansing-oil-200ml.png",
    from: "#f1f5e6", to: "#bfd08a", ink: "dark",
  },
];

function countFor(name: string) {
  return SHOP_PRODUCTS.filter((p) => p.brand.toLowerCase() === name.toLowerCase()).length;
}

function BrandsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.25em] text-primary">Shop by Brand</p>
      <h1 className="mt-3 text-5xl text-foreground md:text-7xl">13 hand-picked <em className="not-italic text-primary">brands</em>.</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Every brand on Skin Grocer is sourced through verified partners and
        warehoused locally in Melbourne for next-day delivery to metro and most
        regional areas (remote postcodes may take 1–2 extra days).
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const count = countFor(b.name);
          const light = b.ink === "light";
          return (
            <Link
              to="/shop"
              search={{ brand: b.name }}
              key={b.name}
              className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1"
              style={{ background: `linear-gradient(155deg, ${b.from} 0%, ${b.to} 100%)` }}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-50 blur-3xl"
                style={{ background: b.from }}
              />
              <div className="relative flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.15em] backdrop-blur ${light ? "bg-white/20 text-white" : "bg-white/60 text-foreground"}`}>
                  {count} {count === 1 ? "product" : "products"}
                </span>
                <span className={`text-lg transition-transform group-hover:translate-x-1 ${light ? "text-white" : "text-foreground"}`}>→</span>
              </div>

              <div className="relative flex flex-1 items-center justify-center">
                <img
                  src={b.hero}
                  alt={`${b.name} signature product`}
                  loading="lazy"
                  width={640}
                  height={640}
                  className="h-[68%] w-auto object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.22)] transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="relative">
                <h2 className={`font-display text-3xl leading-tight ${light ? "text-white" : "text-foreground"}`}>{b.name}</h2>
                <p className={`mt-1.5 text-xs leading-relaxed ${light ? "text-white/75" : "text-foreground/65"}`}>{b.tag}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
