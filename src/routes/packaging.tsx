import { createFileRoute } from "@tanstack/react-router";
import pdf from "@/assets/print/skin-grocer-packaging-mockup.pdf.asset.json";
import { BrandWordmark } from "@/components/brand-wordmark";

export const Route = createFileRoute("/packaging")({
  head: () => ({
    meta: [
      { title: "Packaging — The Grocer Stripe | Skin Grocer" },
      { name: "description", content: "Skin Grocer's navy-and-cream stripe packaging: mailer box, tissue, seal sticker and thank-you card, with a print-ready PDF." },
      { property: "og:title", content: "Packaging — The Grocer Stripe | Skin Grocer" },
      { property: "og:description", content: "Navy-and-cream stripe packaging with a print-ready PDF mockup." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PackagingPage,
});

const PRODUCTS = [
  { brand: "Beauty of Joseon", name: "Ginseng Cleansing Oil", img: "/products/beauty-of-joseon/ginseng-cleansing-oil-210ml.webp" },
  { brand: "Round Lab", name: "1025 Dokdo Toner", img: "/products/round-lab/1025-dokdo-toner-100ml.webp" },
  { brand: "Isntree", name: "Hyaluronic Acid Water Essence", img: "/products/isntree/hyaluronic-acid-water-essence-50ml.webp" },
  { brand: "Haruharu Wonder", name: "Black Rice Ceramide Cream", img: "/products/haruharu-wonder/black-rice-5-ceramide-barrier-moisturizing-cream.webp" },
  { brand: "Torriden", name: "Dive In Serum", img: "/products/torriden/dive-in-serum.webp" },
  { brand: "Biodance", name: "Bio-Collagen Real Deep Mask", img: "/products/biodance/bio-collagen-real-deep-mask.webp" },
];

const COLOURS = [
  ["Grocer Navy", "var(--pack-navy)", "#141F2C"],
  ["Grocer Cream", "var(--pack-cream)", "#F2EDE7"],
  ["Soft Silver", "var(--pack-silver)", "#C9CEC2"],
  ["Champagne Gold", "var(--pack-gold)", "#E2C58F"],
];

const navy = { backgroundColor: "var(--pack-navy)", color: "var(--pack-cream)" };
const cream = { backgroundColor: "var(--pack-cream)", color: "var(--pack-navy)" };

function PackagingPage() {
  return (
    <main style={{ color: "var(--pack-navy)" }}>
      <div className="pack-stripe h-4" />
      <section className="mx-auto max-w-6xl px-5 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em]">The Grocer Stripe</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Packaging, ready to print</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm opacity-80">Mailer box, tissue, seal sticker and thank-you card in navy and cream — with our real products inside.</p>
        <a href={pdf.url} download="skin-grocer-packaging-mockup.pdf" className="mt-7 inline-block rounded-full px-7 py-3 text-sm font-semibold" style={navy}>
          Download print-ready PDF
        </a>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl" style={navy}>
          <div className="pack-stripe h-12" />
          <div className="flex flex-col items-center px-6 py-16">
            <BrandWordmark size="xl" />
            <p className="mt-4 text-[11px] uppercase tracking-[0.3em]">Seoul Sourced. Skin Assured.</p>
            <span className="mt-3 h-px w-14" style={{ backgroundColor: "var(--pack-gold)" }} />
          </div>
          <p className="pb-4 text-center text-xs opacity-70">Mailer box lid</p>
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-wrap content-center justify-center gap-4 rounded-xl p-6 font-serif" style={cream}>
              {Array.from({ length: 12 }).map((_, i) => <span key={i}>sg</span>)}
              <p className="w-full text-center text-xs opacity-70">Tissue</p>
            </div>
            <div className="flex items-center justify-center rounded-xl border p-6" style={{ borderColor: "var(--pack-silver)" }}>
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full" style={navy}>
                <span className="text-[8px] tracking-[0.25em]">SEOUL SOURCED</span>
                <span className="font-serif text-4xl">sg</span>
                <span className="text-[8px] tracking-[0.25em]">SKIN ASSURED</span>
              </div>
            </div>
          </div>
          <div className="flex overflow-hidden rounded-xl border" style={{ borderColor: "var(--pack-silver)" }}>
            <div className="pack-stripe w-4" />
            <div className="p-6 text-left">
              <p className="font-serif text-2xl">Thank you, [name].</p>
              <p className="font-serif text-lg">Your selection is confirmed.</p>
              <p className="mt-3 text-xs opacity-70">Scan the QR on your parcel to check authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-center font-serif text-3xl">Inside the box</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article key={p.name} className="overflow-hidden rounded-xl" style={cream}>
              <div className="pack-stripe h-3" />
              <div className="m-4 flex aspect-square items-center justify-center rounded-lg" style={{ backgroundColor: "var(--paper, white)" }}>
                <img src={p.img} alt={`${p.brand} ${p.name}`} loading="lazy" className="h-full w-full object-contain p-4" />
              </div>
              <div className="px-4 pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">{p.brand}</p>
                <p className="font-serif text-lg">{p.name}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="text-center font-serif text-2xl">Print colours</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {COLOURS.map(([n, v, hex]) => (
            <div key={n} className="rounded-xl border p-3" style={{ borderColor: "var(--pack-silver)" }}>
              <div className="h-16 rounded-md" style={{ backgroundColor: v }} />
              <p className="mt-2 text-sm font-semibold">{n}</p>
              <p className="text-xs opacity-70">{hex}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="pack-stripe h-4" />
    </main>
  );
}
