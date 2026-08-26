import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BadgeCheck, Palette, ScanLine, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import tonerCutout from "@/assets/haruharu-toner-cutout.png";

type ShelfPalette = "seoul" | "jeju" | "plum" | "coast" | "dawn" | "blossom" | "sage";

const SHELF_PALETTES: { id: ShelfPalette; label: string; swatch: string }[] = [
  { id: "seoul", label: "Seoul Night", swatch: "oklch(0.19 0.025 262)" },
  { id: "jeju", label: "Jeju Morning", swatch: "oklch(0.28 0.035 145)" },
  { id: "plum", label: "Gyeongbok Plum", swatch: "oklch(0.24 0.04 340)" },
  { id: "coast", label: "Busan Coast", swatch: "oklch(0.26 0.04 200)" },
  { id: "dawn", label: "Seoul Dawn", swatch: "oklch(0.965 0.012 75)" },
  { id: "blossom", label: "Cherry Blossom", swatch: "oklch(0.955 0.015 340)" },
  { id: "sage", label: "Soft Sage", swatch: "oklch(0.96 0.018 135)" },
];

const STAGE_PICKS = [
  "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime",
  "medicube_pdrn_pink_peptide_serum_30ml_onetime",
  "beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime",
  "round_lab_1025_dokdo_toner_100ml_onetime",
] as const;

const BADGES = [
  { icon: Truck, label: "Melbourne dispatched" },
  { icon: BadgeCheck, label: "100% Seoul verified" },
  { icon: ScanLine, label: "QR routine guide" },
] as const;

export function EditorialDepthHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<ShelfPalette>(() => {
    if (typeof window === "undefined") return "seoul";
    const saved = window.localStorage.getItem("sg-shelf-palette");
    return SHELF_PALETTES.some((p) => p.id === saved) ? (saved as ShelfPalette) : "seoul";
  });
  const [paletteOpen, setPaletteOpen] = useState(false);

  const picks = useMemo(
    () =>
      STAGE_PICKS.map((priceId) => {
        const product = SHOP_PRODUCTS.find((p) => p.priceId === priceId);
        if (!product) return null;
        return {
          product,
          slug: productSlug(product),
          image: priceId.startsWith("haruharu") ? tonerCutout : product.image,
        };
      }).filter((p): p is NonNullable<typeof p> => p !== null),
    [],
  );

  const [hero, medicube, joseon, dokdo] = picks;

  const choose = (id: ShelfPalette) => {
    setPalette(id);
    window.localStorage.setItem("sg-shelf-palette", id);
  };

  const track = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    el.style.setProperty("--hx", ((event.clientX - b.left) / b.width - 0.5).toFixed(3));
    el.style.setProperty("--hy", ((event.clientY - b.top) / b.height - 0.5).toFixed(3));
  };

  const reset = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--hx", "0");
    el.style.setProperty("--hy", "0");
  };

  if (!hero || !medicube || !joseon || !dokdo) return null;

  return (
    <section aria-labelledby="depth-hero-heading" className="bg-background px-4 pb-10 pt-6 sm:px-8 lg:px-12">
      <div
        ref={stageRef}
        data-shelf-palette={palette}
        onPointerMove={track}
        onPointerLeave={reset}
        className="relative isolate mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[2.5rem] bg-shelf-bg text-shelf-ink shadow-2xl lg:flex-row lg:items-center"
      >
        {/* Ambient depth */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-[10%] -top-[10%] h-[55%] w-[55%] rounded-full bg-shelf-gold blur-[130px] opacity-40" />
          <div className="absolute -bottom-[15%] -right-[10%] h-[50%] w-[50%] rounded-full bg-shelf-line blur-[110px]" />
        </div>

        {/* Palette toggle */}
        <div className="absolute right-5 top-5 z-40 md:right-8 md:top-8">
          <div
            className="relative rounded-full border border-shelf-line/60 bg-shelf-bg/80 p-1.5 shadow-lg backdrop-blur-md"
            onMouseEnter={() => setPaletteOpen(true)}
            onMouseLeave={() => setPaletteOpen(false)}
          >
            <button
              type="button"
              aria-label="Colour worlds"
              aria-expanded={paletteOpen}
              onClick={() => setPaletteOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-shelf-gold transition hover:bg-shelf-line/30"
            >
              <Palette className="h-4 w-4" />
            </button>
            <div
              className={`absolute right-0 top-full mt-2 flex flex-col gap-2 rounded-2xl border border-shelf-line/60 bg-shelf-bg/95 p-2 shadow-xl backdrop-blur-md transition-all duration-200 ${
                paletteOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              {SHELF_PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => choose(p.id)}
                  aria-pressed={palette === p.id}
                  className={`flex items-center gap-2 rounded-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                    palette === p.id
                      ? "bg-shelf-gold/20 text-shelf-gold"
                      : "text-shelf-muted hover:bg-shelf-line/30 hover:text-shelf-ink"
                  }`}
                >
                  <span className="h-5 w-5 rounded-full border border-shelf-line/50 shadow-sm" style={{ background: p.swatch }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copy column */}
        <div className="relative z-20 flex w-full flex-col justify-center px-8 pb-4 pt-16 sm:px-12 lg:w-[46%] lg:py-24 lg:pl-16 lg:pr-4">
          <div className="mb-8 flex flex-wrap items-center gap-2.5">
            {BADGES.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-shelf-line/60 bg-shelf-line/15 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-shelf-muted"
              >
                <b.icon className="h-3 w-3 text-shelf-gold" />
                {b.label}
              </span>
            ))}
          </div>

          <h1
            id="depth-hero-heading"
            className="font-masthead text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.95] tracking-tight"
          >
            Seoul
            <span className="block italic text-shelf-gold">curation.</span>
          </h1>

          <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-shelf-muted">
            Authentic Korean skincare, verified at the source and matched to your skin through a
            free skin-clinic-grade consultation — then dispatched from Melbourne by morning.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              className="h-14 rounded-full bg-shelf-ink px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-shelf-bg shadow-xl transition hover:scale-[1.03] active:scale-95"
            >
              <Link to="/consultation" search={{}}>
                Start my consultation <Sparkles />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-shelf-line bg-transparent px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-shelf-ink shadow-none hover:bg-shelf-line/30 hover:text-shelf-ink"
            >
              <Link to="/shop">
                Shop the shelf <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        {/* 3D stage */}
        <div className="relative z-10 flex w-full flex-1 items-center justify-center px-6 pb-20 pt-6 lg:w-[54%] lg:py-24 lg:pr-16">
          <div
            className="depth-stage relative aspect-square w-full max-w-[34rem]"
            style={{ perspective: "1200px" }}
          >
            {/* Shelf floor line */}
            <div aria-hidden="true" className="absolute bottom-[16%] left-[10%] h-px w-[80%] bg-shelf-line/50 blur-[1px]" />

            {/* Back-left: Round Lab Dokdo */}
            <Link
              to="/product/$slug"
              params={{ slug: dokdo.slug }}
              aria-label={`${dokdo.product.brand} ${dokdo.product.name}`}
              className="depth-layer depth-back group absolute left-[2%] top-[8%] z-10 block w-[30%] opacity-70"
              style={{ transform: "translate3d(calc(var(--hx,0)*10px), calc(var(--hy,0)*6px), -80px) rotate(-4deg)" }}
            >
              <div className="rounded-2xl border border-shelf-line/40 bg-shelf-line/15 p-4 backdrop-blur-sm transition group-hover:border-shelf-gold/50">
                <img src={dokdo.image} alt="" loading="lazy" className="mx-auto h-32 w-auto object-contain md:h-44" />
                <p className="mt-2 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-shelf-muted">Round Lab</p>
              </div>
              <span aria-hidden="true" className="mx-auto -mt-1 block h-3 w-[70%] rounded-[100%] bg-black/40 blur-lg" />
            </Link>

            {/* Back-right: Beauty of Joseon */}
            <Link
              to="/product/$slug"
              params={{ slug: joseon.slug }}
              aria-label={`${joseon.product.brand} ${joseon.product.name}`}
              className="depth-layer absolute right-[4%] top-[2%] z-20 block w-[26%]"
              style={{ transform: "translate3d(calc(var(--hx,0)*22px), calc(var(--hy,0)*12px), -30px) rotate(6deg)" }}
            >
              <div className="rounded-2xl border border-shelf-line/40 bg-shelf-line/15 p-4 backdrop-blur-sm transition hover:border-shelf-gold/50">
                <img src={joseon.image} alt="" loading="lazy" className="mx-auto h-32 w-auto object-contain md:h-44" />
                <p className="mt-2 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-shelf-muted">Beauty of Joseon</p>
              </div>
              <span aria-hidden="true" className="mx-auto -mt-1 block h-3 w-[70%] rounded-[100%] bg-black/40 blur-lg" />
            </Link>

            {/* Front-left: Medicube */}
            <Link
              to="/product/$slug"
              params={{ slug: medicube.slug }}
              aria-label={`${medicube.product.brand} ${medicube.product.name}`}
              className="depth-layer absolute bottom-[16%] left-[6%] z-30 block w-[28%]"
              style={{ transform: "translate3d(calc(var(--hx,0)*34px), calc(var(--hy,0)*18px), 40px) rotate(-8deg)" }}
            >
              <div className="rounded-2xl border border-shelf-line/40 bg-shelf-line/20 p-4 backdrop-blur-md transition hover:border-shelf-gold/50">
                <img src={medicube.image} alt="" loading="lazy" className="mx-auto h-32 w-auto object-contain md:h-48" />
                <p className="mt-2 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-shelf-muted">Medicube</p>
              </div>
              <span aria-hidden="true" className="mx-auto -mt-1 block h-3.5 w-[75%] rounded-[100%] bg-black/50 blur-lg" />
            </Link>

            {/* Center hero: Haruharu */}
            <Link
              to="/product/$slug"
              params={{ slug: hero.slug }}
              aria-label={`${hero.product.brand} ${hero.product.name}`}
              className="depth-layer absolute left-1/2 top-1/2 z-40 block w-[38%] -translate-x-1/2 -translate-y-1/2"
              style={{
                transform:
                  "translate(-50%,-50%) translate3d(calc(var(--hx,0)*48px), calc(var(--hy,0)*26px), 90px) rotateY(calc(var(--hx,0)*14deg)) rotateX(calc(var(--hy,0)*-10deg))",
              }}
            >
              <div className="rounded-[1.75rem] border border-shelf-tile/10 bg-shelf-tile p-6 pb-4 text-shelf-tile-ink shadow-[0_50px_90px_-20px_rgba(0,0,0,0.6)]">
                <img
                  src={hero.image}
                  alt=""
                  fetchPriority="high"
                  className="mx-auto h-48 w-auto object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.2)] md:h-64"
                />
                <p className="mt-3 text-center text-[8px] font-bold uppercase tracking-[0.28em] text-shelf-tile-ink/55">
                  {hero.product.brand}
                </p>
                <p className="mt-1 text-center font-masthead text-sm italic leading-tight md:text-base">
                  {hero.product.name}
                </p>
                <p className="mt-2 inline-flex w-full items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-shelf-tile-ink/70">
                  {hero.product.price} <ArrowUpRight className="h-3 w-3" />
                </p>
              </div>
              <span aria-hidden="true" className="mx-auto -mt-1 block h-4 w-[70%] rounded-[100%] bg-black/60 blur-xl" />
            </Link>

            {/* Floating clinic badge */}
            <div
              className="depth-layer absolute bottom-[10%] right-[2%] z-50 hidden md:block"
              style={{ transform: "translate3d(calc(var(--hx,0)*58px), calc(var(--hy,0)*30px), 110px)" }}
            >
              <div className="flex items-center gap-3 rounded-2xl border border-shelf-line/50 bg-shelf-line/20 p-4 shadow-2xl backdrop-blur-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-shelf-gold/20">
                  <Sparkles className="h-4 w-4 text-shelf-gold" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-shelf-ink">Skin-clinic grade</p>
                  <p className="text-[9px] uppercase tracking-[0.14em] text-shelf-muted">Free personalised routine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
