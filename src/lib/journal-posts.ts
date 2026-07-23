import journal10step from "@/assets/journal-10step.jpg";
import journalSnail from "@/assets/journal-snail.jpg";
import journalSunscreen from "@/assets/journal-sunscreen.jpg";
import journalBarrier from "@/assets/journal-barrier.jpg";
import journalCentella from "@/assets/journal-centella.jpg";
import journalLayering from "@/assets/journal-layering.jpg";

export type JournalSection = { heading?: string; body: string };
export type JournalPost = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishedOn: string;
  author: string;
  cover: string;
  excerpt: string;
  sections: JournalSection[];
  takeaways: string[];
  productPicks: { name: string; why: string }[];
};

export const journalPosts: JournalPost[] = [
  {
    slug: "the-10-step-routine-demystified",
    title: "The 10-step routine, demystified",
    category: "Routines",
    readTime: "6 min",
    publishedOn: "March 2026",
    author: "The Skin Grocer Team",
    cover: journal10step,
    excerpt:
      "The famous Korean 10-step routine isn't a rulebook — it's a menu. Here's what each step actually does and how to build the shortest version that works for your skin.",
    sections: [
      {
        heading: "Where the 10 steps came from",
        body:
          "The 10-step routine became shorthand for K-beauty in the West around 2014, when Western editors tried to map the layered rituals of Seoul department-store counters onto a single checklist. In Korea, the reality is more flexible: most people rotate through 4–7 steps daily and add extras only when their skin asks for it.",
      },
      {
        heading: "What each step is actually doing",
        body:
          "1) Oil cleanser dissolves sunscreen, sebum and makeup. 2) Water cleanser lifts sweat and residue. 3) Exfoliant (2–3× a week only) sweeps dead cells. 4) Toner rebalances pH and preps skin to absorb. 5) Essence delivers lightweight hydration and active ingredients. 6) Treatment (ampoule or serum) targets one concern — brightening, barrier, texture. 7) Sheet mask, when you want a hydration boost. 8) Eye cream for the thinner skin around the eyes. 9) Moisturiser seals everything in. 10) SPF in the morning, sleeping mask at night.",
      },
      {
        heading: "The Skin Grocer short version",
        body:
          "For a Melbourne summer, we usually recommend: oil cleanser → water cleanser → hydrating toner → one serum → moisturiser → SPF. That's six steps, five minutes, and it covers 90% of what most skins need. Add a sheet mask on Sunday, exfoliate midweek, and you've quietly done a full ritual without owning 30 bottles.",
      },
      {
        heading: "How to build yours",
        body:
          "Start with cleanser and SPF. Once those are non-negotiable, add a toner. Then a treatment for your primary concern. Then a moisturiser matched to your climate. Only add a step when you can name what it's for — otherwise it's just clutter on the shelf.",
      },
    ],
    takeaways: [
      "10 steps is a menu, not a prescription — 5–6 is plenty for most days.",
      "Every step should have a job you can name.",
      "Cleanse and SPF first. Everything else is optional.",
    ],
    productPicks: [
      { name: "Beauty of Joseon Radiance Cleansing Balm", why: "Melts SPF and sebum without stripping." },
      { name: "Anua Heartleaf 77% Soothing Toner", why: "Calm, low-pH prep with no fragrance." },
      { name: "Round Lab 1025 Dokdo Cream", why: "Lightweight enough for humid days, still occlusive." },
    ],
  },
  {
    slug: "snail-mucin-why-your-skin-loves-it",
    title: "Snail mucin: why your skin actually loves it",
    category: "Ingredients",
    readTime: "4 min",
    publishedOn: "February 2026",
    author: "The Skin Grocer Team",
    cover: journalSnail,
    excerpt:
      "Filtered snail secretion filtrate sounds strange until you read the ingredient list. Here's the science behind why it became a Korean skincare staple.",
    sections: [
      {
        heading: "What it actually is",
        body:
          "Snail Secretion Filtrate (SSF) is the mucin trail snails leave to protect themselves from cuts and UV damage. Cosmetic-grade mucin is collected humanely from farmed snails, filtered, and standardised. The finished ingredient is odourless, clear, and slightly viscous.",
      },
      {
        heading: "Why it works",
        body:
          "Mucin is a natural cocktail of glycoproteins, hyaluronic acid, glycolic acid, peptides and zinc. Translated: it hydrates, mildly resurfaces, supports collagen, and helps calm reactive skin — all in one step. It's one of the few ingredients that behaves like both a hydrator and a repair serum.",
      },
      {
        heading: "Who it suits",
        body:
          "Almost every skin type, especially post-actives, post-sun, and post-breakout skin. It layers well with niacinamide, panthenol and centella. Avoid combining it with strong exfoliants in the same step — you'll cancel out the calming effect.",
      },
    ],
    takeaways: [
      "Mucin hydrates, resurfaces and repairs in a single layer.",
      "Best used morning and night on damp skin.",
      "Pair with barrier ingredients, not strong acids.",
    ],
    productPicks: [
      { name: "COSRX Advanced Snail 96 Mucin Power Essence", why: "The benchmark — 96% mucin, nothing extra." },
      { name: "Numbuzin No.3 Skin Softening Serum", why: "Mucin blended with niacinamide for glow." },
    ],
  },
  {
    slug: "sunscreen-every-single-day",
    title: "Sunscreen, every single day (yes, in Melbourne too)",
    category: "Education",
    readTime: "3 min",
    publishedOn: "January 2026",
    author: "The Skin Grocer Team",
    cover: journalSunscreen,
    excerpt:
      "Australia has some of the highest UV in the world. Here's why Korean sunscreens have quietly become the answer for a lot of Australian faces.",
    sections: [
      {
        heading: "The UV reality",
        body:
          "Melbourne's UV index sits at 3 or higher for roughly eight months of the year — the threshold at which dermatologists recommend daily SPF. UV drives around 80% of visible skin ageing and is the single biggest trigger for pigmentation. Rain and cloud cover reduce UVB but let UVA through almost unchanged.",
      },
      {
        heading: "Why Korean SPF sits differently",
        body:
          "Korea approves modern filters (Uvinul A Plus, Tinosorb S, Uvinul T 150) that aren't yet approved in the US. These filters are more photostable, cover a wider UVA range, and feel like a serum rather than a paste. That texture is why people who 'hate sunscreen' often stick with Korean formulas.",
      },
      {
        heading: "How much and how often",
        body:
          "Two finger-lengths for the face and neck, applied as the last step in the morning. Reapply every two hours when outdoors, or after swimming. Every Skin Grocer SPF is TGA-listed for the Australian market, so the SPF number on the label is the number you're getting.",
      },
    ],
    takeaways: [
      "SPF is the single highest-impact anti-ageing step.",
      "Modern Korean filters feel light and layer under makeup.",
      "Two finger-lengths, reapplied every two hours outdoors.",
    ],
    productPicks: [
      { name: "Beauty of Joseon Relief Sun Rice + Probiotics SPF50+", why: "Cult favourite — invisible, no white cast." },
      { name: "Round Lab Birch Juice Moisturising Sunscreen", why: "For dry Melbourne winters." },
    ],
  },
  {
    slug: "building-a-barrier-first-routine",
    title: "Building a barrier-first routine",
    category: "Routines",
    readTime: "5 min",
    publishedOn: "December 2025",
    author: "The Skin Grocer Team",
    cover: journalBarrier,
    excerpt:
      "If your skin is stinging, flaking or breaking out from products it used to love, the barrier is the first thing to check.",
    sections: [
      {
        heading: "What the barrier does",
        body:
          "Your skin barrier is the outermost layer of the epidermis — a brick-and-mortar wall of skin cells held together by lipids (ceramides, cholesterol, fatty acids). A healthy barrier keeps water in and irritants out. When it's compromised, everything you put on stings, and skin looks red, flaky or dull.",
      },
      {
        heading: "Signs it's compromised",
        body:
          "Tightness after cleansing. Products that used to sit well now burn. Random breakouts along the cheeks. A dull, papery quality even after moisturiser. If you've been overdoing actives (retinol, AHAs, vitamin C), that's usually the culprit.",
      },
      {
        heading: "The reset",
        body:
          "For two weeks: gentle low-pH cleanser, hydrating toner, one barrier-focused product (panthenol, centella or ceramides), a rich moisturiser, and SPF. Nothing else. No acids, no retinol, no vitamin C. Reintroduce one active per week only when the sting is gone.",
      },
    ],
    takeaways: [
      "Barrier damage feels like stinging and looks like flaking.",
      "Simplify first — reintroduce actives one at a time.",
      "Ceramides, panthenol and centella do the heavy lifting.",
    ],
    productPicks: [
      { name: "Dr.Ceuracle Vegan Kombucha Tea Essence", why: "Panthenol-heavy, calms almost immediately." },
      { name: "Illiyoon Ceramide Ato Concentrate Cream", why: "Ceramide-rich, fragrance-free, cheap enough to use generously." },
    ],
  },
  {
    slug: "centella-vs-heartleaf",
    title: "Centella vs heartleaf — what's the difference?",
    category: "Ingredients",
    readTime: "4 min",
    publishedOn: "November 2025",
    author: "The Skin Grocer Team",
    cover: journalCentella,
    excerpt:
      "Two calming ingredients showing up in nearly every Korean toner. They're related, but they solve different problems.",
    sections: [
      {
        heading: "Centella asiatica (cica)",
        body:
          "Traditional wound-healing herb used across Korea, China and India. The active compounds — madecassoside, asiaticoside, madecassic acid — reduce redness, calm reactive skin and support collagen. Best after sun exposure, post-procedure, or during active breakouts.",
      },
      {
        heading: "Houttuynia cordata (heartleaf)",
        body:
          "A different plant with quercitrin and quercetin as key actives. Anti-inflammatory and anti-bacterial, with a slight astringent effect. Works particularly well for oilier, acne-prone skin where you want calm without heavy hydration.",
      },
      {
        heading: "Which one for you",
        body:
          "Dry or sensitised skin → centella. Oily, congestion-prone skin → heartleaf. Combination skin → alternate them or layer a heartleaf toner under a centella serum. Neither is a miracle worker on its own; they shine when used consistently over 6–8 weeks.",
      },
    ],
    takeaways: [
      "Centella calms and repairs; heartleaf calms and clarifies.",
      "Dry skin leans centella, oily skin leans heartleaf.",
      "Consistency matters more than concentration.",
    ],
    productPicks: [
      { name: "SKIN1004 Madagascar Centella Ampoule", why: "100% centella extract, nothing else." },
      { name: "Anua Heartleaf 77% Soothing Toner", why: "The best-selling heartleaf formula for a reason." },
    ],
  },
  {
    slug: "layering-serums-without-pilling",
    title: "Layering serums without the pilling",
    category: "How-to",
    readTime: "3 min",
    publishedOn: "October 2025",
    author: "The Skin Grocer Team",
    cover: journalLayering,
    excerpt:
      "Little white flakes rolling off your face aren't dead skin — they're your products refusing to talk to each other. Here's how to fix it.",
    sections: [
      {
        heading: "Why pilling happens",
        body:
          "Pilling occurs when a product can't absorb into the layer beneath it, usually because of a silicone-water mismatch, too much product, or applying the next layer before the previous one has set. Sunscreens with high silicone content are the most common culprits.",
      },
      {
        heading: "The rule of thin to thick",
        body:
          "Layer from thinnest to thickest: toner → essence → serum → ampoule → moisturiser → SPF. Water-based before oil-based. Wait 30–60 seconds between layers so each one has time to sink in. Use a pea-sized amount of moisturiser and SPF — more isn't better.",
      },
      {
        heading: "If it's still pilling",
        body:
          "Try patting instead of rubbing. Skip one layer for a few days and see if the pilling stops — that identifies the culprit. Change the order of your sunscreen and moisturiser. Some silicone-heavy SPFs simply don't play well with certain serums, and that's a formula problem, not a technique problem.",
      },
    ],
    takeaways: [
      "Thin to thick, water before oil.",
      "Wait 30–60 seconds between layers.",
      "Pat, don't rub. Less product, not more.",
    ],
    productPicks: [
      { name: "Torriden DIVE-IN Low Molecular Hyaluronic Acid Serum", why: "Absorbs fast, layers under anything." },
      { name: "Beauty of Joseon Relief Sun SPF50+", why: "Low-silicone, plays well with other serums." },
    ],
  },
];

export function getJournalPost(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}
