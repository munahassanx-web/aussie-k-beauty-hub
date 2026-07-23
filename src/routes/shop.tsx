import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import maskMedihealSheet from "@/assets/mask-mediheal-sheet.jpg";
import maskDynastyCream from "@/assets/mask-dynasty-cream.jpg";
import maskNumbuzinEye from "@/assets/mask-numbuzin-eye.jpg";
import maskSomeByMiClay from "@/assets/mask-somebymi-clay.jpg";
import maskAbibSleeping from "@/assets/mask-abib-sleeping.jpg";
import maskNumbuzinVita from "@/assets/mask-numbuzin-vita.jpg";
import maskAnuaHeartleaf from "@/assets/mask-anua-heartleaf.jpg";
import maskSkin1004Centella from "@/assets/mask-skin1004-centella.jpg";
import productSnail from "@/assets/product-snail-essence.jpg";
import productCentellaToner from "@/assets/product-centella-toner.jpg";
import productVitC from "@/assets/product-vitc-serum.jpg";
import productRice from "@/assets/product-rice-cleanser.jpg";
import productReliefSun from "@/assets/product-relief-sun.jpg";
import productCicaCream from "@/assets/product-cica-cream.jpg";
import productHeartleaf from "@/assets/product-heartleaf-ampoule.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Skin Grocer" },
      { name: "description", content: "Browse authentic Korean skincare and premium imports — cleansers, serums, moisturisers, masks and SPF — locally stocked with next-day delivery." },
      { property: "og:title", content: "Shop — Skin Grocer" },
      { property: "og:description", content: "Authentic K-beauty, locally stocked in Australia." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

type Category = "Cleanse" | "Tone" | "Treat" | "Moisturise" | "Protect" | "Masks";

const items: { name: string; brand: string; price: string; priceId: string; tag: string | null; category: Category; image: string }[] = [
  { name: "Hydrating Snail Mucin Essence", brand: "COSRX", price: "$32", priceId: "snail_essence_onetime", tag: "Bestseller", category: "Treat", image: productSnail },
  { name: "Centella Calming Toner", brand: "SKIN1004", price: "$28", priceId: "centella_toner_onetime", tag: "New", category: "Tone", image: productCentellaToner },
  { name: "Vitamin C Brightening Serum", brand: "Beauty of Joseon", price: "$36", priceId: "vitc_serum_onetime", tag: null, category: "Treat", image: productVitC },
  { name: "Rice Probiotics Cleansing Foam", brand: "I'm From", price: "$30", priceId: "rice_cleanser_onetime", tag: null, category: "Cleanse", image: productRice },
  { name: "Relief Sun SPF50+", brand: "Beauty of Joseon", price: "$22", priceId: "relief_sun_onetime", tag: "Cult", category: "Protect", image: productReliefSun },
  { name: "Cica Recovery Cream", brand: "Anua", price: "$34", priceId: "cica_cream_onetime", tag: null, category: "Moisturise", image: productCicaCream },
  { name: "Heartleaf Soothing Ampoule", brand: "Anua", price: "$38", priceId: "heartleaf_ampoule_onetime", tag: "New", category: "Treat", image: productHeartleaf },
  { name: "Real Ferment Micro Essence Sheet Mask", brand: "Mediheal", price: "$6", priceId: "mask_mediheal_sheet_onetime", tag: "Bestseller", category: "Masks", image: maskMedihealSheet },
  { name: "Dynasty Cream Mask", brand: "Beauty of Joseon", price: "$5", priceId: "mask_dynasty_cream_onetime", tag: null, category: "Masks", image: maskDynastyCream },
  { name: "Bakuchiol Retinol Eye Mask", brand: "Numbuzin", price: "$32", priceId: "mask_numbuzin_eye_onetime", tag: "New", category: "Masks", image: maskNumbuzinEye },
  { name: "AHA-BHA-PHA 30 Days Miracle Clay Mask", brand: "Some By Mi", price: "$28", priceId: "mask_somebymi_clay_onetime", tag: null, category: "Masks", image: maskSomeByMiClay },
  { name: "Pep-Talk Peptide Sleeping Mask", brand: "Abib", price: "$34", priceId: "mask_abib_sleeping_onetime", tag: null, category: "Masks", image: maskAbibSleeping },
  { name: "Vita Propolis Ampoule Sheet Mask", brand: "Numbuzin", price: "$7", priceId: "mask_numbuzin_vita_onetime", tag: null, category: "Masks", image: maskNumbuzinVita },
  { name: "Heartleaf 77% Soothing Sheet Mask", brand: "Anua", price: "$6", priceId: "mask_anua_heartleaf_onetime", tag: "Cult", category: "Masks", image: maskAnuaHeartleaf },
  { name: "Madagascar Centella Hyalu-Cica Water-Fit Sun Mask", brand: "SKIN1004", price: "$8", priceId: "mask_skin1004_centella_onetime", tag: null, category: "Masks", image: maskSkin1004Centella },
];

const filters = ["All", "Cleanse", "Tone", "Treat", "Moisturise", "Protect", "Masks"] as const;

function Shop() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const { buy, modal } = useBuyNow();
  const visible = useMemo(
    () => (active === "All" ? items : items.filter((p) => p.category === active)),
    [active],
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">The shop</p>
        <h1 className="mt-3 text-5xl text-foreground md:text-6xl">Carefully sourced. <em className="not-italic text-primary">Always authentic.</em></h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Every product on Skin Grocer is sourced directly through verified
          brand partners and stocked here in Australia for next-day delivery.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {filters.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"}`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p) => (
          <div key={p.name} className="group">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              <img src={p.image} alt={p.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
