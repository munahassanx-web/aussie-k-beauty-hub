import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Palette, ScanLine, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import tonerCutout from "@/assets/haruharu-toner-cutout.png";

type ShelfPalette = "seoul" | "jeju" | "plum" | "coast";

const SHELF_PALETTES: { id: ShelfPalette; label: string; swatch: string }[] = [
  { id: "seoul", label: "Seoul Night", swatch: "oklch(0.19 0.025 262)" },
  { id: "jeju", label: "Jeju Morning", swatch: "oklch(0.28 0.035 145)" },
  { id: "plum", label: "Gyeongbok Plum", swatch: "oklch(0.24 0.04 340)" },
  { id: "coast", label: "Busan Coast", swatch: "oklch(0.26 0.04 200)" },
];

const SHELF_PICKS = [
  "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime",
  "beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime",
  "medicube_pdrn_pink_peptide_serum_30ml_onetime",
  "round_lab_1025_dokdo_toner_100ml_onetime",
] as const;

const SERVICES = [
  { icon: BadgeCheck, title: "Seoul verified", body: "Checked before dispatch" },
  { icon: Truck, title: "Next-day dispatch", body: "Shipped from Melbourne" },
  { icon: ScanLine, title: "QR routine guide", body: "In every order" },
] as const;

const TICKER = [
  "Seoul verified",
  "Next-day Melbourne dispatch",
  "Free express shipping over $100",
  "Personalised consultation",
  "Authenticity guaranteed",
];

export function SeoulShelfHero() {
  const stageRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPicked, setUserPicked] = useState(false);
  const [palette, setPalette] = useState<ShelfPalette>("seoul");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("sg-shelf-palette") : null;
    if (saved && SHELF_PALETTES.some((p) => p.id === saved)) {
      setPalette(saved as ShelfPalette);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sg-shelf-palette", palette);
    }
  }, [palette]);

  const picks = useMemo(
    () =>
      SHELF_PICKS.map((priceId) => {
        const product = SHOP_PRODUCTS.find((p) => p.priceId === priceId);
        if (!product) return null;
        return {
          product,
          slug: productSlug(product),
          // The Haruharu packshot ships as a transparent cutout — sit it straight on the navy.
          image: priceId.startsWith("haruharu") ? tonerCutout : product.image,
        };
      }).filter((p): p is NonNullable<typeof p> => p !== null),
    [],
  );

  const active = picks[activeIndex] ?? picks[0];

  useEffect(() => {
    if (userPicked || picks.length < 2) return;
    const timer = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % picks.length),
      4800,
    );
    return () => window.clearInterval(timer);
  }, [userPicked, picks.length]);

  const choose = (index: number) => {
    setUserPicked(true);
    setActiveIndex(index);
  };

  const setPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stageRef.current?.style.setProperty("--shelf-x", x.toFixed(3));
    stageRef.current?.style.setProperty("--shelf-y", y.toFixed(3));
  };

  if (!active) return null;

  return (
    <section
      ref={stageRef}
      data-shelf-palette={palette}
      aria-labelledby="shelf-heading"
      onPointerMove={setPointer}
      className="relative isolate flex min-h-[calc(100svh-7rem)] flex-col overflow-hidden bg-shelf-bg text-shelf-ink md:min-h-[calc(100svh-10rem)]"
    >
      {/* Ambient glows + shelf grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[12%] -top-[18%] h-[55%] w-[55%] rounded-full bg-hanbok opacity-40 blur-[140px]" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[45%] w-[45%] rounded-full bg-rose-gold opacity-[0.14] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(var(--shelf-line)_1px,transparent_1px),linear-gradient(90deg,var(--shelf-line)_1px,transparent_1px)] [background-size:120px_120px]" />
      </div>

      {/* Palette toggle */}
      <div className="absolute right-4 top-4 z-30 md:right-8 md:top-8">
        <div
          className="relative rounded-full border border-shelf-line/60 bg-shelf-bg/80 p-1.5 shadow-lg backdrop-blur-md"
          onMouseEnter={() => setPaletteOpen(true)}
          onMouseLeave={() => setPaletteOpen(false)}
        >
          <button
            type="button"
            aria-label="Colour worlds"
            aria-expanded={paletteOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-shelf-gold transition hover:bg-shelf-line/30"
          >
            <Palette className="h-4 w-4" />
          </button>
          <div
            className={`absolute right-0 top-full mt-2 flex flex-col gap-2 rounded-2xl border border-shelf-line/60 bg-shelf-bg/95 p-2 shadow-xl backdrop-blur-md transition-all duration-200 ${
              paletteOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            {SHELF_PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPalette(p.id)}
                aria-pressed={palette === p.id}
                className={`flex items-center gap-2 rounded-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                  palette === p.id ? "bg-shelf-gold/20 text-shelf-gold" : "text-shelf-muted hover:bg-shelf-line/30 hover:text-shelf-ink"
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-shelf-line/50 shadow-sm"
                  style={{ background: p.swatch }}
                />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 pb-28 pt-16 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:pt-10">
        {/* Editorial column */}
        <div className="flex flex-col items-start">
          <p className="mb-8 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-shelf-gold">
            <span className="h-px w-8 bg-shelf-gold" />
            Stocked in Seoul · Shopped in Melbourne
          </p>
          <h1
            id="shelf-heading"
            className="font-masthead text-[clamp(3.4rem,7vw,7rem)] italic leading-[0.9] tracking-tight"
          >
            Groceries
            <span className="block not-italic font-black tracking-tighter">for your skin.</span>
          </h1>

          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-shelf-muted">
            The Seoul shelf, curated like your weekly shop — every product verified at the source,
            matched to your skin by a real consultation, and dispatched from Melbourne by morning.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              className="h-14 rounded-full bg-shelf-gold px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-shelf-bg shadow-xl shadow-shelf-gold/20 hover:bg-shelf-ink"
            >
              <Link to="/consultation" search={{}}>
                Start my consultation <Sparkles />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-shelf-line bg-transparent px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-shelf-ink shadow-none hover:bg-shelf-line/40 hover:text-shelf-ink"
            >
              <Link to="/shop">Shop the shelf <ArrowRight /></Link>
            </Button>
          </div>

          {/* Services row */}
          <div className="mt-14 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-shelf-line/70 bg-shelf-line/10 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-shelf-gold/60 hover:bg-shelf-line/25"
              >
                <service.icon className="h-4 w-4 text-shelf-gold transition-transform duration-300 group-hover:-translate-y-0.5" />
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-shelf-ink">
                  {service.title}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-shelf-muted">
                  {service.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shelf stage */}
        <div className="flex flex-col items-center">
          {/* Featured slot — cream grocer tile */}
          <div
            className="relative w-full max-w-sm"
            style={{
              transform:
                "translate(calc(var(--shelf-x, 0) * 14px), calc(var(--shelf-y, 0) * 10px))",
            }}
          >
            <div className="relative overflow-hidden rounded-[2rem] rounded-t-[10rem] border border-shelf-tile/10 bg-shelf-tile p-8 pb-6 text-shelf-bg shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)]">
              <p className="text-center text-[9px] font-bold uppercase tracking-[0.3em] text-shelf-bg/50">
                This week&apos;s shelf · {String(activeIndex + 1).padStart(2, "0")}/{String(picks.length).padStart(2, "0")}
              </p>
              <div key={active.slug} className="animate-[shelf-swap_0.55s_cubic-bezier(0.22,1,0.36,1)]">
                <div className="mx-auto mt-6 flex h-64 items-center justify-center md:h-72">
                  <img
                    src={active.image}
                    alt={`${active.product.brand} ${active.product.name}`}
                    className="max-h-full w-auto object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.18)]"
                    fetchPriority={activeIndex === 0 ? "high" : "auto"}
                  />
                </div>
                <div className="mt-6 border-t border-shelf-bg/10 pt-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-shelf-bg/55">
                    {active.product.brand}
                  </p>
                  <p className="mx-auto mt-1 max-w-[16rem] text-pretty px-2 font-masthead text-xl italic leading-tight text-shelf-bg">
                    {active.product.name}
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-4">
                    <span className="text-sm font-semibold tracking-wide">{active.product.price}</span>
                    <Link
                      to="/product/$slug"
                      params={{ slug: active.slug }}
                      className="group inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-shelf-bg/70 transition hover:text-shelf-bg"
                    >
                      View product
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shelf rail */}
          <div className="relative mt-10 w-full max-w-md">
            <div className="grid grid-cols-4 gap-3">
              {picks.map((pick, index) => (
                <button
                  key={pick.slug}
                  type="button"
                  onClick={() => choose(index)}
                  aria-pressed={index === activeIndex}
                  aria-label={`Feature ${pick.product.brand} ${pick.product.name}`}
                  className={`group relative rounded-2xl border p-3 pt-5 backdrop-blur-sm transition-all duration-300 ${
                    index === activeIndex
                      ? "-translate-y-2 border-shelf-gold/70 bg-shelf-line/30"
                      : "border-shelf-line/60 bg-shelf-line/10 hover:-translate-y-1 hover:border-shelf-line hover:bg-shelf-line/20"
                  }`}
                >
                  <span className="mx-auto flex h-16 items-center justify-center md:h-20">
                    <img
                      src={pick.image}
                      alt=""
                      loading="lazy"
                      className={`max-h-full w-auto object-contain transition duration-300 ${
                        index === activeIndex ? "scale-105" : "opacity-80 group-hover:opacity-100"
                      }`}
                    />
                  </span>
                  <span className="mt-3 block truncate text-center text-[8px] font-bold uppercase tracking-[0.18em] text-shelf-muted">
                    {pick.product.brand}
                  </span>
                </button>
              ))}
            </div>
            {/* Shelf line */}
            <div aria-hidden="true" className="mt-[-0.75rem] h-px w-full bg-gradient-to-r from-transparent via-shelf-line to-transparent" />
            <p className="mt-4 text-center text-[9px] uppercase tracking-[0.3em] text-shelf-muted">
              Tap a product to restock the tile
            </p>
          </div>
        </div>
      </div>

      {/* Services ticker */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-shelf-line/60">
        <div className="relative flex overflow-hidden py-4">
          <div className="flex min-w-max animate-[shelf-marquee_28s_linear_infinite] items-center gap-10 pr-10 text-[9px] font-semibold uppercase tracking-[0.3em] text-shelf-muted">
            {[...TICKER, ...TICKER].map((item, index) => (
              <span key={index} className="flex items-center gap-10">
                <span>{item}</span>
                <span className="h-1 w-1 rounded-full bg-shelf-gold" />
              </span>
            ))}
          </div>
        </div>
        <a
          href="#skin-grocer-promise"
          className="absolute bottom-4 right-6 hidden items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-shelf-muted transition hover:text-shelf-gold md:flex"
        >
          Enter the story <ArrowDown className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
