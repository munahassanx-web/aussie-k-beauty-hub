import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from '@tanstack/react-router';

/**
 * Interior page hero — retailer banner direction.
 *
 * Modelled on how Sephora, Mecca Maxima, Nudie Glow and Beauty Pie build
 * their category/landing banners: a soft flat colour block, a short benefit
 * headline, exactly one bright CTA, real product packshots as the visual
 * (never abstract texture), and a utility trust strip underneath.
 */

export type PageHeroTone = 'sage' | 'glow' | 'plum' | 'sun';

type Shot = { src: string; label: string; brand: string };

const TONES: Record<
  PageHeroTone,
  { block: string; chip: string; shots: Shot[] }
> = {
  sage: {
    block: 'from-[oklch(0.96_0.02_150)] to-[oklch(0.99_0.005_150)]',
    chip: 'bg-primary/10 text-primary',
    shots: [
      { src: '/products/beplain/cicaful-ampoule-30ml.webp', brand: 'beplain', label: 'Cicaful Ampoule' },
      { src: '/products/round-lab/1025-dokdo-toner-100ml.webp', brand: 'ROUND LAB', label: '1025 Dokdo Toner' },
      { src: '/products/beauty-of-joseon/glow-serum-propolis-plus-niacinamide-30ml.webp', brand: 'Beauty of Joseon', label: 'Glow Serum' },
    ],
  },
  glow: {
    block: 'from-[oklch(0.97_0.03_75)] to-[oklch(0.99_0.008_75)]',
    chip: 'bg-accent/15 text-accent-foreground',
    shots: [
      { src: '/products/beauty-of-joseon/glow-serum-propolis-plus-niacinamide-30ml.webp', brand: 'Beauty of Joseon', label: 'Glow Serum' },
      { src: '/products/beauty-of-joseon/dynasty-cream-50ml.webp', brand: 'Beauty of Joseon', label: 'Dynasty Cream' },
      { src: '/products/medicube/collagen-jelly-cream-110ml.webp', brand: 'MEDICUBE', label: 'Collagen Jelly Cream' },
    ],
  },
  plum: {
    block: 'from-[oklch(0.96_0.025_350)] to-[oklch(0.99_0.006_350)]',
    chip: 'bg-primary/10 text-primary',
    shots: [
      { src: '/products/beauty-of-joseon/green-plum-refreshing-toner-aha-bha-150ml.webp', brand: 'Beauty of Joseon', label: 'Green Plum Toner' },
      { src: '/products/medicube/pdrn-pink-peptide-serum-30ml.webp', brand: 'MEDICUBE', label: 'PDRN Pink Peptide Serum' },
      { src: '/products/medicube/pdrn-pink-cica-soothing-toner-250ml.webp', brand: 'MEDICUBE', label: 'PDRN Cica Toner' },
    ],
  },
  sun: {
    block: 'from-[oklch(0.97_0.035_85)] to-[oklch(0.99_0.008_85)]',
    chip: 'bg-accent/15 text-accent-foreground',
    shots: [
      { src: '/products/beauty-of-joseon/ginseng-cleansing-oil-210ml.webp', brand: 'Beauty of Joseon', label: 'Ginseng Cleansing Oil' },
      { src: '/products/wellage/real-hyaluronic-toner-200ml.webp', brand: 'WELLAGE', label: 'Real Hyaluronic Toner' },
      { src: '/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.webp', brand: 'Beauty of Joseon', label: 'Revive Eye Serum' },
    ],
  },
};

const TRUST = [
  'Free express delivery over A$100',
  'Next-day dispatch from Melbourne',
  '100% authentic Korean stock',
  'QR authenticity card in every order',
];

export function PageHero({
  eyebrow,
  hangul,
  title,
  titleAccent,
  lede,
  cta,
  tone = 'sage',
  index = '01',
  ghost: _ghost,
  children,
}: {
  eyebrow: string;
  hangul?: string;
  title: string;
  titleAccent?: string;
  lede: string;
  cta?: { label: string; to: string; hash?: string };
  tone?: PageHeroTone;
  index?: string;
  /** @deprecated retained for prop compatibility; no longer rendered */
  ghost?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const { block, chip, shots } = TONES[tone];

  const rise = (delay: number) => ({
    initial: reduce ? undefined : { opacity: 0, y: 20 },
    animate: reduce ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-6 md:px-6 md:pb-12 md:pt-8">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${block}`}>
        <div className="grid items-center gap-8 px-6 py-10 md:grid-cols-2 md:gap-10 md:px-12 md:py-14">
          {/* Copy column */}
          <div>
            <motion.div {...rise(0)} className="flex items-center gap-3">
              <span className="font-masthead text-sm italic text-foreground/40">{index}</span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-foreground/70 md:text-[11px]">
                {eyebrow}
              </p>
              {hangul && <span className="text-[10px] tracking-[0.28em] text-foreground/40">{hangul}</span>}
            </motion.div>

            <motion.h1
              {...rise(0.08)}
              className="mt-5 font-masthead text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[0.95] tracking-tight text-balance text-foreground"
            >
              {title}
              {titleAccent && <span className="block font-light italic opacity-90">{titleAccent}</span>}
            </motion.h1>

            <motion.p {...rise(0.14)} className="mt-5 max-w-md text-sm font-light leading-relaxed text-foreground/70 md:text-[15px]">
              {lede}
            </motion.p>

            <motion.div {...rise(0.2)} className="mt-7 flex flex-wrap items-center gap-5">
              {cta && (
                <Link
                  to={cta.to}
                  hash={cta.hash}
                  className="group inline-flex items-center gap-3 rounded-full bg-pop px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-pop-foreground shadow-[0_14px_34px_-12px] shadow-pop/60 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  {cta.label}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              )}
              <span className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] ${chip}`}>
                Seoul sourced · Skin assured
              </span>
            </motion.div>

            {children && <div className="mt-6">{children}</div>}
          </div>

          {/* Product packshot row — the retailer move: real products, not texture */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {shots.map((shot, i) => (
              <motion.figure
                key={shot.src}
                initial={reduce ? undefined : { opacity: 0, y: 26 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl bg-background/70 p-3 shadow-[0_24px_50px_-34px_rgba(0,0,0,0.5)] backdrop-blur-sm md:p-4"
              >
                <img
                  src={shot.src}
                  alt={`${shot.brand} ${shot.label}`}
                  loading="lazy"
                  className="mx-auto aspect-square w-full object-contain transition-transform duration-500 group-hover:-translate-y-1"
                />
                <figcaption className="mt-2 text-center">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                    {shot.brand}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-foreground/80">{shot.label}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        {/* Utility trust strip */}
        <div className="border-t border-foreground/10 bg-background/50 px-6 py-3 md:px-12">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] font-medium uppercase tracking-[0.22em] text-foreground/60 md:text-[11px]">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-pop" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
