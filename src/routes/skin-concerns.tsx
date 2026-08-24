import { createFileRoute, Link } from "@tanstack/react-router";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import imgHydration from "@/assets/concerns/page-hydration.jpg";
import imgAcne from "@/assets/concerns/page-acne.jpg";
import imgPigmentation from "@/assets/concerns/page-pigmentation.jpg";
import imgSensitivity from "@/assets/concerns/page-sensitivity.jpg";
import imgAntiAging from "@/assets/concerns/page-anti-aging.jpg";
import imgBarrier from "@/assets/concerns/page-barrier.jpg";

export const Route = createFileRoute("/skin-concerns")({
  head: () => ({
    meta: [
      { title: "Skin Concerns — Skin Grocer" },
      { name: "description", content: "Find Korean skincare matched to your concern — dryness, oiliness, pigmentation, sensitivity, anti-aging and acne. Expert guidance from our Australian team." },
      { property: "og:title", content: "Shop by Skin Concern — Skin Grocer" },
      { property: "og:url", content: "https://skingrocer.com.au/skin-concerns" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/skin-concerns" }],
    scripts: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Skin Concerns", path: "/skin-concerns" },
      ]),
    ],
  }),
  component: ConcernsPage,
});

const concerns: { name: string; desc: string; products: string; img: string; slug: "hydration" | "acne" | "pigmentation" | "sensitivity" | "anti-aging" | "barrier" }[] = [
  { name: "Dry Skin & Hydration", desc: "Intense hydration & glow.", products: "Hydration edit", img: imgHydration, slug: "hydration" },
  { name: "Acne & Breakouts", desc: "Calm congestion & balance oil.", products: "Clear-skin edit", img: imgAcne, slug: "acne" },
  { name: "Pigmentation", desc: "Brightening & dark spot correction.", products: "Bright-skin edit", img: imgPigmentation, slug: "pigmentation" },
  { name: "Sensitive Skin", desc: "Calming & barrier strengthening.", products: "Calm edit", img: imgSensitivity, slug: "sensitivity" },
  { name: "Anti-Ageing", desc: "Firmness, elasticity & wrinkle care.", products: "Firm edit", img: imgAntiAging, slug: "anti-aging" },
  { name: "Barrier Repair", desc: "Rebuild a compromised skin barrier.", products: "Repair edit", img: imgBarrier, slug: "barrier" },
];

function ConcernsPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">Targeted Solutions</p>
        <h1 className="mt-4 text-5xl text-foreground md:text-7xl">Shop by <em className="not-italic text-primary">skin concern</em>.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Choose your concern and we'll match you with products and routines built around it.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {concerns.map((c) => (
            <Link to="/shop" search={{ concern: c.slug }} key={c.name} className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img src={c.img} alt={`${c.name} — Korean skincare texture`} loading="lazy" width={1024} height={1280} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <div className="absolute bottom-0 p-7 text-background">
                <p className="text-xs uppercase tracking-[0.2em] text-accent">{c.products}</p>
                <h2 className="mt-2 font-display text-3xl text-background">{c.name}</h2>
                <p className="mt-1 text-sm opacity-85">{c.desc}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] opacity-0 transition-opacity duration-500 group-hover:opacity-100">Explore solutions →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-foreground py-20 text-background">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Need help?</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Talk to a real human.</h2>
          <p className="mt-3 text-background/70">Our team will build you a routine — no upsell, no pressure.</p>
          <Link to="/contact" className="mt-8 inline-flex rounded-full bg-accent px-7 py-3 text-sm font-medium text-foreground hover:opacity-90">Get a routine →</Link>
        </div>
      </section>
    </>
  );
}

