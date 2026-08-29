import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from '@tanstack/react-router';

import gelSage from '@/assets/hero-bg-cica.jpg';
import gelGlow from '@/assets/hero-bg-glow.jpg';
import gelPlum from '@/assets/hero-bg-plum.jpg';
import gelSun from '@/assets/hero-bg-sun.jpg';

/**
 * Cinematic interior page hero — the "editorial depth" panel.
 *
 * A wide macro-gel panel with a section-specific colour grade, a hairline
 * eyebrow with Hangul tag, a Didone display headline and a quiet underline
 * CTA. Shared by About, Shop and Contact so the site reads as one brand.
 */

export type PageHeroTone = 'sage' | 'glow' | 'plum' | 'sun';

const TONES: Record<PageHeroTone, { image: string; grade: string }> = {
  sage: { image: gelSage, grade: 'bg-primary/12' },
  glow: { image: gelGlow, grade: 'bg-accent/12' },
  plum: { image: gelPlum, grade: 'bg-primary/10' },
  sun: { image: gelSun, grade: 'bg-accent/10' },
};

export function PageHero({
  eyebrow,
  hangul,
  title,
  titleAccent,
  lede,
  cta,
  tone = 'sage',
  children,
}: {
  eyebrow: string;
  hangul?: string;
  title: string;
  titleAccent?: string;
  lede: string;
  cta?: { label: string; to: string; hash?: string };
  tone?: PageHeroTone;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const { image, grade } = TONES[tone];

  const rise = (delay: number) => ({
    initial: reduce ? undefined : { opacity: 0, y: 22 },
    animate: reduce ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-6">
      <div className="relative isolate flex min-h-[22rem] items-center overflow-hidden rounded-[2rem] bg-secondary shadow-[0_40px_90px_-50px_rgba(0,0,0,0.55)] md:aspect-[2.5/1] md:min-h-0">
        {/* Macro-gel plate with a slow cinematic drift */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <motion.img
            src={image}
            alt=""
            className="h-full w-full scale-110 object-cover"
            initial={reduce ? undefined : { scale: 1.14, x: '-1.5%' }}
            animate={reduce ? undefined : { scale: 1.08, x: '1.5%' }}
            transition={{ duration: 26, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          <div className={`absolute inset-0 mix-blend-multiply ${grade}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative w-full px-7 py-14 md:px-16 lg:px-20">
          <div className="max-w-2xl">
            <motion.div {...rise(0)} className="flex items-center gap-5">
              <span className="h-px w-12 bg-foreground/60" />
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-foreground md:text-[11px]">
                {eyebrow}
                {hangul && <span className="ml-4 font-normal tracking-[0.2em] opacity-40">{hangul}</span>}
              </p>
            </motion.div>

            <motion.h1
              {...rise(0.08)}
              className="mt-7 font-masthead text-[clamp(2.9rem,7vw,5.5rem)] leading-[0.9] tracking-tight text-balance text-foreground"
            >
              {title}
              {titleAccent && (
                <span className="block font-light italic opacity-90">{titleAccent}</span>
              )}
            </motion.h1>

            <motion.div
              {...rise(0.16)}
              className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:gap-10"
            >
              <p className="max-w-sm text-sm font-light leading-relaxed text-foreground/70">{lede}</p>
              {cta && (
                <Link
                  to={cta.to}
                  hash={cta.hash}
                  className="group relative inline-flex w-fit items-center py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground"
                >
                  {cta.label}
                  <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              )}
            </motion.div>

            {children && <motion.div {...rise(0.24)}>{children}</motion.div>}
          </div>
        </div>

        {/* Hairline frame detail */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-6 rounded-[1.5rem] border border-foreground/5" />
      </div>
    </section>
  );
}
