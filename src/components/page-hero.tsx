import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from '@tanstack/react-router';

import gelSage from '@/assets/hero-bg-cica.jpg';
import gelGlow from '@/assets/hero-bg-glow.jpg';
import gelPlum from '@/assets/hero-bg-plum.jpg';
import gelSun from '@/assets/hero-bg-sun.jpg';

/**
 * Interior page hero — the "clinic dossier" direction.
 *
 * Clean white field, oversized ghost Didone word bleeding off the edge,
 * a tilted macro-gel polaroid plate, a section index marker and a slow
 * rotating Hangul seal. Shared by About, Shop and Contact.
 */

export type PageHeroTone = 'sage' | 'glow' | 'plum' | 'sun';

const TONES: Record<PageHeroTone, { image: string; ghost: string; chip: string }> = {
  sage: { image: gelSage, ghost: 'text-primary/8', chip: 'bg-primary/10 text-primary' },
  glow: { image: gelGlow, ghost: 'text-accent/10', chip: 'bg-accent/15 text-accent-foreground' },
  plum: { image: gelPlum, ghost: 'text-primary/8', chip: 'bg-primary/10 text-primary' },
  sun: { image: gelSun, ghost: 'text-accent/10', chip: 'bg-accent/15 text-accent-foreground' },
};

function RotatingSeal({ text }: { text: string }) {
  return (
    <div className="relative h-24 w-24 md:h-28 md:w-28" aria-hidden="true">
      <motion.svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id="seal-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-foreground/60 text-[8.2px] font-medium uppercase" style={{ letterSpacing: '2.6px' }}>
          <textPath href="#seal-circle">{text}</textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-masthead text-2xl italic text-foreground/80 md:text-3xl">SG</span>
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  hangul,
  title,
  titleAccent,
  lede,
  cta,
  tone = 'sage',
  index = '01',
  ghost,
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
  ghost?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const { image, ghost: ghostColor, chip } = TONES[tone];

  const rise = (delay: number) => ({
    initial: reduce ? undefined : { opacity: 0, y: 26 },
    animate: reduce ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12">
      {/* Ghost display word bleeding off the top */}
      {ghost && (
        <motion.span
          aria-hidden="true"
          className={`pointer-events-none absolute -top-10 left-0 select-none whitespace-nowrap font-masthead text-[clamp(8rem,24vw,20rem)] font-bold leading-none tracking-tight md:-top-16 ${ghostColor}`}
          initial={reduce ? undefined : { opacity: 0, x: '-4%' }}
          animate={reduce ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {ghost}
        </motion.span>
      )}

      {/* Top dossier rule with index */}
      <motion.div {...rise(0)} className="relative flex items-baseline justify-between border-b border-foreground/10 pb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-foreground/70 md:text-[11px]">
          <span className="mr-4 font-masthead italic tracking-normal text-foreground/40">{index}</span>
          {eyebrow}
        </p>
        {hangul && (
          <p className="text-[10px] tracking-[0.3em] text-foreground/40 md:text-[11px]">{hangul}</p>
        )}
      </motion.div>

      <div className="relative grid gap-10 pt-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:pt-14 lg:gap-16">
        {/* Copy column */}
        <div className="relative">
          <motion.h1
            {...rise(0.1)}
            className="font-masthead text-[clamp(3rem,6.5vw,5.75rem)] leading-[0.92] tracking-tight text-balance text-foreground"
          >
            {title}
            {titleAccent && (
              <span className="block font-light italic opacity-90">{titleAccent}</span>
            )}
          </motion.h1>

          <motion.div {...rise(0.2)} className="mt-8 flex max-w-xl flex-col gap-7">
            <p className="max-w-md text-sm font-light leading-relaxed text-foreground/70 md:text-[15px]">
              {lede}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {cta && (
                <Link
                  to={cta.to}
                  hash={cta.hash}
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-background transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {cta.label}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              )}
              <span className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] ${chip}`}>
                Seoul sourced · Skin assured
              </span>
            </div>
            {children}
          </motion.div>
        </div>

        {/* Tilted macro-gel plate + rotating seal */}
        <div className="relative flex items-center justify-center md:justify-end">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 40, rotate: 8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-64 overflow-hidden rounded-2xl border-[6px] border-background shadow-[0_50px_80px_-40px_rgba(0,0,0,0.45)] md:w-80 lg:w-96"
          >
            <motion.img
              src={image}
              alt="Macro skincare gel texture"
              className="aspect-[4/5] w-full object-cover"
              initial={reduce ? undefined : { scale: 1.15 }}
              animate={reduce ? undefined : { scale: 1.05 }}
              transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <div className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-foreground backdrop-blur">
              Texture · {tone}
            </div>
          </motion.div>
          <motion.div
            {...rise(0.45)}
            className="absolute -bottom-4 left-2 md:-left-6 md:bottom-auto md:top-6"
          >
            <RotatingSeal text={`${eyebrow} · SKIN GROCER · MELBOURNE · `} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
