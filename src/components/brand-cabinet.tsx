import { Link } from "@tanstack/react-router";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import cabinetEdit from "@/assets/brand-cabinet-products.jpg";

/* The Brand Cabinet: an A to Z of the brands we stock, moved from the homepage to Brands. */
const CABINET_BRANDS: { name: string; knownFor: string }[] = [
  { name: "AESTURA", knownFor: "Barrier-focused moisturising care" },
  { name: "Beauty of Joseon", knownFor: "Traditional-inspired formulas with modern textures" },
  { name: "beplain", knownFor: "Gentle, uncomplicated daily skincare" },
  { name: "BIODANCE", knownFor: "Hydrating masks and comfort-focused care" },
  { name: "Dr.G", knownFor: "Skin-comfort and barrier-conscious formulas" },
  { name: "HARUHARU WONDER", knownFor: "Fermented ingredients and lightweight hydration" },
  { name: "ISNTREE", knownFor: "Ingredient-led hydration and everyday essentials" },
  { name: "MEDICUBE", knownFor: "Targeted formulas and texture-focused care" },
  { name: "ROUND LAB", knownFor: "Gentle hydration inspired by Korean regional ingredients" },
  { name: "S.NATURE", knownFor: "Comforting hydration for easily unsettled skin" },
  { name: "TIRTIR", knownFor: "Glow-focused skincare and complexion preparation" },
  { name: "TORRIDEN", knownFor: "Lightweight, layerable hydration" },
  { name: "WELLAGE", knownFor: "Hydration-focused ampoules and treatment textures" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function BrandMarquee() {
  const groups = new Map<string, { name: string; knownFor: string; count: number }[]>();
  for (const brand of [...CABINET_BRANDS].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  )) {
    const count = SHOP_PRODUCTS.filter(
      (p) => p.brand.toLowerCase() === brand.name.toLowerCase(),
    ).length;
    if (count === 0) continue; // never link to an empty brand page
    const letter = brand.name[0]!.toUpperCase();
    const bucket = groups.get(letter) ?? [];
    bucket.push({ ...brand, count });
    groups.set(letter, bucket);
  }
  const letters = [...groups.keys()];

  // Place the curation callout after the first group that reaches five brands.
  let running = 0;
  let calloutAfter = letters[letters.length - 1];
  for (const l of letters) {
    running += groups.get(l)!.length;
    if (running >= 5) {
      calloutAfter = l;
      break;
    }
  }

  return (
    <section className="border-y border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <header className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] md:items-end md:gap-16">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/50">
              THE BRAND CABINET
            </p>
            <h2 className="mt-4 max-w-[18ch] font-display text-3xl leading-[1.05] text-ink md:text-5xl">
              The names shaping Korean skincare,{" "}
              <span className="italic">curated for your shelf.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/70">
              Meet the Korean brands we believe are worth knowing&mdash;selected for formulation
              quality, clear routine roles and products customers can realistically use and finish.
            </p>
            <Link
              to="/brands"
              className="group mt-7 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <span className="border-b border-ink/25 pb-1 transition-colors group-hover:border-[var(--stripe-gold)]">
                Browse all brands
              </span>
            </Link>
          </div>
          <figure className="m-0 md:pl-8">
            <div className="relative border border-border/60">
              <img
                src={cabinetEdit}
                alt="Editorial still life of five stocked Skin Grocer products: Beauty of Joseon Dynasty Cream, Haruharu Wonder Black Rice Hyaluronic Toner, Torriden Dive-In Serum, Medicube PDRN Pink Peptide Serum and Biodance Bio-Collagen Real Deep Mask"
                loading="lazy"
                decoding="async"
                width={1200}
                height={960}
                className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
              />
            </div>
            <figcaption className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ink/45">
              The Skin Grocer Edit &middot; Beauty of Joseon, Haruharu Wonder, Torriden, Medicube,
              Biodance
            </figcaption>
          </figure>
        </header>

        {/* A–Z index */}
        <nav
          aria-label="Browse brands alphabetically"
          className="mt-12 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0"
        >
          <ul className="flex min-w-max items-center gap-x-3 border-y border-border/60 py-3 md:min-w-0 md:flex-wrap md:gap-x-5">
            {ALPHABET.map((l) => {
              const active = groups.has(l);
              return (
                <li key={l}>
                  {active ? (
                    <a
                      href={`#cabinet-${l}`}
                      className="block px-1 py-1 font-display text-[13px] tracking-[0.08em] text-ink underline-offset-[6px] transition-colors hover:text-[var(--stripe-gold)] hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      {l}
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="block cursor-default px-1 py-1 font-display text-[13px] tracking-[0.08em] text-ink/20"
                    >
                      {l}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-4">
          {letters.map((letter) => (
            <div key={letter}>
              <section
                id={`cabinet-${letter}`}
                aria-labelledby={`cabinet-${letter}-label`}
                className="scroll-mt-32 border-b border-border/60 py-8 md:grid md:grid-cols-[6rem_minmax(0,1fr)] md:items-start md:gap-10 md:py-9"
              >
                <h3
                  id={`cabinet-${letter}-label`}
                  className="font-display text-4xl leading-none text-ink md:text-6xl"
                >
                  {letter}
                </h3>
                <ul className="mt-6 grid gap-x-12 gap-y-2 md:mt-1 lg:grid-cols-2">
                  {groups.get(letter)!.map((b) => (
                    <li key={b.name}>
                      <Link
                        to="/shop"
                        search={{ brand: b.name }}
                        className="group flex min-h-14 items-start justify-between gap-6 border-b border-border/40 py-4 transition-transform duration-300 hover:translate-x-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink lg:border-b-0 lg:py-3"
                      >
                        <span className="min-w-0">
                          <span className="block text-[17px] font-medium uppercase tracking-[0.1em] text-ink md:text-lg">
                            {b.name}
                          </span>
                          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink/70">
                            {b.knownFor}
                          </span>
                          <span className="mt-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink/45">
                            {b.count} {b.count === 1 ? "product" : "products"}
                          </span>
                        </span>
                        <span className="mt-1 shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55 transition-colors group-hover:text-[var(--stripe-gold)]">
                          Explore brand <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              {letter === calloutAfter && (
                <aside className="my-8 border border-border/60 bg-secondary/40 px-6 py-7 md:flex md:items-center md:justify-between md:gap-10 md:px-9">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/50">
                      Not sure where to begin?
                    </p>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/75">
                      You don&rsquo;t need to recognise every Korean brand. Tell us what your skin
                      needs and we&rsquo;ll narrow the shelf.
                    </p>
                  </div>
                  <Link
                    to="/consultation"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 border border-ink/30 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-background focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink md:mt-0 md:shrink-0 rounded-full"
                  >
                    Find my routine <span aria-hidden="true">→</span>
                  </Link>
                </aside>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
