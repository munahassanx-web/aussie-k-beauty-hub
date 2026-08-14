import { createFileRoute, Link } from "@tanstack/react-router";
import brandShot from "@/assets/brand-spotlight.jpg";

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

const brands: { name: string; tag: string }[] = [
  { name: "AESTURA", tag: "Dermatologist-backed barrier repair, born in a Korean hospital lab" },
  { name: "BIODANCE", tag: "Overnight bio-collagen masks that melt into the skin" },
  { name: "Beauty of Joseon", tag: "Korean heritage ingredients in modern formulas" },
  { name: "Dr.G", tag: "Clinical care for red, blemish-prone and reactive skin" },
  { name: "HARUHARU WONDER", tag: "Fermented black rice, clean and low-irritation" },
  { name: "ISNTREE", tag: "Ingredient-led hydration and gentle exfoliation" },
  { name: "MEDICUBE", tag: "PDRN and exosome technology for visible results" },
  { name: "ROUND LAB", tag: "The 1025 Dokdo line — simple, everyday essentials" },
  { name: "S.NATURE", tag: "Aqua Oasis hydration built on squalane and botanicals" },
  { name: "TIRTIR", tag: "Milky ceramide care with a cult following" },
  { name: "TORRIDEN", tag: "Low-molecular hyaluronic acid, deep dive hydration" },
  { name: "WELLAGE", tag: "Real Hyaluronic and PDRN ampoules from a K-derm favourite" },
  { name: "beplain", tag: "Mung bean cleansing and calm, pH-balanced basics" },
];

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
