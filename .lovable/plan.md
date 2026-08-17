# Homepage + Site Chrome Audit

No files were edited. Everything below was cross-checked against the live catalog (`src/lib/shop-catalog.ts`, 64 SKUs / 13 brands), the routes in `src/routes/`, and the published policies.

## CRITICAL

1. **Mega-menu brands that do not exist in the catalog** — `src/components/site-chrome.tsx` lines 75–95.
   Listed: `COSRX`, `Beauty of Joseon`, `Anua`, `SKIN1004`, `Numbuzin`, `Abib`, `Mediheal`, `Some By Mi`.
   Only **Beauty of Joseon** is stocked. The catalog brands are: AESTURA, BIODANCE, Beauty of Joseon, Dr.G, HARUHARU WONDER, ISNTREE, MEDICUBE, ROUND LAB, S.NATURE, TIRTIR, TORRIDEN, WELLAGE, beplain. Seven menu entries send shoppers to `/shop?brand=…` with zero results — dead ends on the primary nav.

2. **`/reviews` contains six invented testimonials** — `src/routes/reviews.tsx` lines 19–25 ("Mia T.", "Aisha K.", "Jordan P.", "Sara L.", "Chen W.", "Priya R."), all 5 stars, plus claims like "Ordered at noon, at my door by 6pm" and a reference to buying **COSRX** (not stocked). The footer links to this page (`site-chrome.tsx` line 486). The homepage `CustomerNotes` section was deliberately cleaned of fake reviews, so the site now contradicts itself and the footer link leads to fabricated social proof.

3. **Hero ticker delivery claim not supported by policy** — `src/components/hero-carousel.tsx` line 468: `"Next-day VIC delivery"`. The shipping policy (`src/routes/shipping-policy.tsx` line 32) only commits to *same-business-day dispatch before 12pm*, not next-day delivery. Same issue in the footer: `site-chrome.tsx` lines 457 and 461 ("dispatched the next day.\*", "Ships next day from Melbourne\*") and in the homepage metadata (`src/routes/index.tsx` lines 25–28: "Next-Day from Melbourne", "dispatched next-day across Australia"). The `/reviews` meta also says "next-day delivery".

4. **"Advisor-built routines" / "Talk to an Advisor" implies staff advisors** — `hero-carousel.tsx` line 470, `site-chrome.tsx` line 71 and line 333 ("Our advisor-built routine"), `shop-catalog.ts` bundle desc line 151 ("advisor-built"). There is no advisor service in the code; guidance is a quiz (`/consultation`) plus static routines.

## HIGH

5. **Duplicate/contradicting announcement messaging.** `AnnouncementBar` (`site-chrome.tsx` lines 98–102) and `PromoBar` (`index.tsx` lines 386–400) both appear above the hero and both say free express shipping over $80. Two stacked navy bars before the hero. The announcement bar also states "Authenticity guaranteed" (absolute guarantee wording) and rotates on mobile — the promo bar was deliberately de-rotated for the same reason.

6. **Two newsletter captures still reachable on the homepage.** `SeoulSignalStrip` (`seoul-signal.tsx` line 50, `source="homepage"`) and the footer form (`site-chrome.tsx` line 512, `source="footer"`). The in-page duplicate was removed, but the footer sits directly under it, so a visitor sees two email boxes within one screen. Footer copy "Restocks, new arrivals, ritual notes. No spam, ever." also conflicts with the Seoul Signal positioning.

7. **Bundle tag claims a fixed saving.** `shop-catalog.ts` line 149: `tag: "Best Value · Save 25%"` while the card price/saving is computed live by `bundleMath`. The static "25%" can drift from the real number shown beside it. `desc` "Our most-loved ritual… A full month of glass-skin results" is both an unsupported popularity claim and a results claim.

8. **Hardcoded prices on the homepage category tiles** — `index.tsx` lines 49–54. `price`/`size` fields duplicate catalog data (currently correct, e.g. beplain oil $35, WELLAGE toner $28, AESTURA cream $55) but are not derived from `SHOP_PRODUCTS`, so they will silently drift. Note these fields are also never rendered by `CategoryTile` — dead data.

9. **`Concerns` mega-menu labels vs homepage labels diverge.** Header uses "Acne & Breakouts", "Pigmentation", "Anti-Ageing", "Barrier Repair" (`site-chrome.tsx` lines 58–63) — the clinical wording the homepage deliberately replaced with "Blemish-Prone", "Uneven-Looking Tone", "Firmness & Fine Lines", "Barrier-Focused" (`index.tsx` lines 60–65). Same destinations, two vocabularies.

10. **Menu links that do not do what they say.**
    - "AM Routine", "PM Routine", "Weekly Treatments" all point to the same `/journey` page (`site-chrome.tsx` lines 38–40).
    - "Bestsellers" and "New Arrivals" both point to plain `/shop` with no filter (lines 47–48).
    - "Ingredient Finder" → `/learn/snail-mucin` (line 70). Ingredient slugs are generated from `ingredients.name_english` at runtime; this hardcoded slug is unverified and 404s if the row name differs. It should point at `/learn` (the A–Z index).
    - "Subscribe & Save" → `/club` (line 49) while the homepage now calls it "Restock" — naming mismatch.

11. **Homepage `ProvenanceCard` image doesn't match its own copy** — `index.tsx` lines 859–861. Alt text names "Abib, Medicube, Mixsoon and Torriden" — Abib and Mixsoon are not stocked, in a section whose whole point is authenticity and accurate product information.

## MEDIUM

12. **Homepage length and hierarchy.** 15 full-bleed sections between hero and FAQ (`index.tsx` lines 85–112). Three of them are essentially the same "learn / editorial" promise: `IngredientStrip`, `LearnStrip`, `SeoulSignalStrip`; and three are routine-finder CTAs pointing at `/consultation`: `SkinQuizSection`, `ApplicationMoment`, plus two hero slides. Consider consolidating.

13. **Repeated "→" arrow + hairline + `01–06` numbering pattern** appears in nine consecutive sections (Promise, Categories, BrandMarquee, IngredientStrip, ProvenanceCard, SkinQuizSection, Concerns, WhyPillars, LearnStrip, CustomerNotes). Individually premium; in sequence it reads as a template.

14. **Dark-panel placeholder still in `WhyPillars`** — `index.tsx` lines 204–232, comment says "placeholder for the approved real photograph", and the copy "Navy box · Warm gold seal · Ivory tissue" describes packaging that is not shown anywhere.

15. **Mobile navigation friction** — `site-chrome.tsx` lines 343–441. The mobile drawer renders 9 large links **plus** every mega-menu section expanded inline (~30 more links) in one scroll with no accordions. The desktop dropdown chevron is a `<button>` that only opens on click and never closes on click (line 213–222), and menus close only on `mouseleave` — awkward on touch/keyboard.

16. **Cart badge always renders**, showing `0` when empty — `site-chrome.tsx` line 290.

17. **Footer bottom bar has three non-links** — `site-chrome.tsx` lines 520–524: plain `<span>` "Shipping & Returns", "Privacy", "Terms" duplicating the real links directly above, and there is no Terms page.

18. **ABN placeholder shipping to production** — `site-chrome.tsx` line 519 falls back to `"xx xxx xxx xxx"` when `VITE_COMPANY_ABN` is unset.

19. **`/journey` metadata over-promises** — "Detailed application notes for every product" (`src/routes/journey.tsx` line 7), linked from the header mega-menu as three separate routines.

20. **Dead code in `src/routes/index.tsx`** — unused `SparkleIcon` (lines 409–425), unused `Stat` (lines 428–435), unused imports `authenticityCard` (line 17) and `useEffect` (line 2).

21. **Homepage `Reveal` usage is inconsistent** — some sections wrapped, others not (`index.tsx` lines 85–102), producing uneven scroll behaviour: `KoreaRightNow`, `BrandMarquee`, `SkinQuizSection`, `ApplicationMoment`, `RitualCTA`, `SeoulSignalStrip` animate differently from their neighbours.

22. **Homepage SEO copy** — title is 66 characters (over the 60 guideline) and the description leads with the unverified next-day claim. No `og:type`, `og:image` or `twitter:card` on the homepage head.

## LEAVE AS IS

- `PromoBar` message and its link to `/shipping-policy` — verified against policy (free express over A$80; 12pm same-day dispatch).
- `CustomerNotes` — correctly avoids fabricated reviews and makes no rating claims.
- `RitualCTA` — the Restock steps and `RESTOCK_DISCOUNT_PERCENT` are read from real subscription logic.
- `KoreaRightNow` / The Seoul Edit — all six shortlist SKUs plus the featured MEDICUBE PDRN serum resolve to real catalog entries; prices come from the catalog, no ranking claims.
- `SeoulSignalStrip` structure and article links (`new-launch-watchlist`, `seoul-vs-tiktok`, `prevention-over-repair` all resolve).
- `Promise` strip, `Concerns` copy, `BundleCardMedia` explainer toggle, hero carousel interaction model (pause on hover, reduced-motion, keyboard, swipe) — all sound.
- Hero slide 1 leading with **SKIN GROCER** — as requested.
- Homepage `#bundles` anchor from the mega menu — the target section exists.

## Suggested order of work

1. CRITICAL 1–4 (false brand navigation, fake reviews page, delivery claims, advisor claims).
2. HIGH 5–11 (duplicate bars, double newsletter, bundle claim, hardcoded prices, label divergence, dead menu links, mismatched authenticity image).
3. MEDIUM as a single tidy-up pass.

Tell me which group to start with and I will scope each as a separate change.
