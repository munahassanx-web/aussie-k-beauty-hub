import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { trackUi } from "@/lib/analytics";
import heroModel from "@/assets/hero-korean-model.webp";

/** Korean label on the bottle → what it means in English. */
const CHIPS = [
  {
    ko: "세라마이드",
    en: "Ceramides",
    className: "left-[4%] top-[10%] md:-left-[3%] md:top-[20%]",
  },
  { ko: "물광 피부", en: "Glass skin", className: "right-[5%] bottom-[8%]" },
];

/** The words customers already search for, in English and Korean. */
const GLOW_WORDS: [string, string][] = [
  ["glass skin", "물광"],
  ["cica", "병풀"],
  ["honey glow", "꿀광"],
  ["hydration", "수분"],
  ["barrier", "장벽"],
];

function TranslateChip({
  ko,
  en,
  on,
  className,
  onToggle,
}: {
  ko: string;
  en: string;
  on: boolean;
  className: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${ko}: ${en}`}
      className={`absolute z-20 flex items-center gap-2.5 rounded-full bg-paper/95 px-4 py-2.5 text-[13px] font-semibold text-ink shadow-[0_14px_34px_rgba(58,38,32,0.18)] backdrop-blur transition-transform hover:scale-[1.04] ${className}`}
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-glaze" />
      <span aria-hidden="true" className="grid">
        <span
          className={`[grid-area:1/1] font-[family-name:var(--font-hangul)] transition-all duration-300 ${on ? "-translate-y-1.5 opacity-0" : "opacity-100"}`}
        >
          {ko}
        </span>
        <span
          className={`[grid-area:1/1] transition-all duration-300 ${on ? "opacity-100" : "translate-y-1.5 opacity-0"}`}
        >
          {en}
        </span>
      </span>
    </button>
  );
}

/**
 * Glass Skin Club (물광) homepage hero: one message, one real product, and
 * ingredient labels that translate from Korean to English.
 */
export function GlassSkinHero() {
  const reduce = useReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 60, y: 40 });
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((i) => i + 1), 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || !photoRef.current) return;
    const r = photoRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({ x: x - 0.5, y: y - 0.5 });
    setSheen({ x: x * 100, y: y * 100 });
  };

  return (
    <section
      aria-labelledby="glass-skin-heading"
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative grid overflow-hidden bg-paper text-ink md:min-h-[620px] md:grid-cols-[1fr_1.05fr]"
    >
      <div className="relative z-10 flex flex-col justify-center gap-6 px-6 py-12 md:py-16 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] md:pr-10">
        <span className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-full bg-blush px-4 py-2 text-[13px]">
          <b className="font-[family-name:var(--font-hangul)] font-bold text-hanbok">물광 피부</b>
          <span className="text-ink/80">mulgwang · the Korean &ldquo;water-glow&rdquo; skin</span>
        </span>
        <h1
          id="glass-skin-heading"
          className="text-[clamp(3.25rem,7.2vw,7rem)] font-light lowercase leading-[0.95] tracking-[-0.045em]"
        >
          the korean glow, <span className="text-hanbok">made simple.</span>
        </h1>
        <p className="max-w-[36ch] text-lg leading-relaxed text-clay">
          Skincare chosen in Seoul, checked in Melbourne and explained in plain English. Start with
          three products, not ten.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/shop"
            onClick={() => trackUi("hero_shop_click", { slide_id: "glass_skin_club" })}
            className="inline-flex items-center gap-2 rounded-full bg-hanbok-deep px-7 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-paper transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-hanbok focus-visible:ring-offset-2"
          >
            Shop the edit <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/consultation"
            onClick={() => trackUi("hero_routine_finder_click", { slide_id: "glass_skin_club" })}
            className="inline-flex items-center rounded-full border-[1.5px] border-hanbok-deep px-7 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-hanbok-deep transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-hanbok focus-visible:ring-offset-2"
          >
            Find my routine
          </Link>
        </div>
        <a
          href="#glass-skin-club"
          className="w-fit text-sm text-clay underline-offset-4 hover:text-ink hover:underline"
        >
          Join the Glass Skin Club for new arrivals and routine notes →
        </a>
      </div>

      <div ref={photoRef} className="relative min-h-[440px] overflow-hidden md:min-h-0">
        <img
          src={heroModel}
          alt="Woman with glowing, hydrated-looking skin in soft daylight"
          width={1536}
          height={1024}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[60%_25%] md:object-[30%_30%]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background: `radial-gradient(280px 280px at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,0.4), rgba(255,255,255,0) 70%)`,
          }}
        />
        <Link
          to="/product/$slug"
          params={{ slug: "aestura-atobarrier365-cream" }}
          onClick={() => trackUi("hero_product_click", { slide_id: "glass_skin_club" })}
          aria-label="AESTURA Atobarrier365 Cream, A$55"
          className="absolute bottom-[6%] left-[4%] z-10 w-[30%] max-w-[230px] transition-transform duration-300 ease-out md:-left-[6%] md:w-[28%]"
          style={
            reduce
              ? undefined
              : {
                  transform: `translate3d(${tilt.x * 22}px, ${tilt.y * 22}px, 0) rotateY(${tilt.x * 12}deg)`,
                }
          }
        >
          <img
            src="/products/aestura/atobarrier365-cream.webp"
            alt=""
            width={1400}
            height={1400}
            className="drop-shadow-[0_26px_30px_rgba(58,38,32,0.28)] motion-safe:animate-[sg-bob_7s_ease-in-out_infinite]"
          />
        </Link>
        {CHIPS.map((chip, i) => (
          <TranslateChip
            key={chip.ko}
            ko={chip.ko}
            en={chip.en}
            className={chip.className}
            on={pinned[i] ?? (!reduce && (active + i) % 2 === 0)}
            onToggle={() =>
              setPinned((p) => ({ ...p, [i]: !(p[i] ?? (!reduce && (active + i) % 2 === 0)) }))
            }
          />
        ))}
      </div>
    </section>
  );
}

/** Scrolling band of the glow words in English and Korean. */
export function GlowWordBand() {
  const run = [...GLOW_WORDS, ...GLOW_WORDS];
  return (
    <div className="overflow-hidden whitespace-nowrap bg-hanbok-deep py-3.5 text-paper">
      <p className="sr-only">
        Glass skin (물광), cica (병풀), honey glow (꿀광), hydration (수분), barrier (장벽).
      </p>
      <div
        aria-hidden="true"
        className="inline-block motion-safe:animate-[sg-marquee_32s_linear_infinite]"
      >
        {[0, 1].map((copy) => (
          <span key={copy}>
            {run.map(([en, ko], i) => (
              <span key={`${copy}-${i}`}>
                <span className="mx-5 text-[22px] font-light italic">{en}</span>
                <span className="mx-5 font-[family-name:var(--font-hangul)] text-lg text-glaze">
                  {ko}
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
