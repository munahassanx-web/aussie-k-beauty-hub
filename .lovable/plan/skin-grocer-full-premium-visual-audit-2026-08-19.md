# Skin Grocer — Full Premium Visual Audit

Audit only. No code, content, data, checkout, email or operations changes were made. Inspected rendered pages at 1440px and 390px: home (full scroll), /shop, a representative PDP (/product/... WELLAGE Real Hyaluronic Toner), /brands, /skin-concerns, /routines, /learn, /blog, /about, /contact, /search, /checkout (empty state only — no payment initiated), header, mega-nav and footer. No console errors on any route at either width.

Benchmark: the approved Concept 1 header — black/white stretched Grocer Stripe with satin champagne-gold panels, pure white canvas, tall high-contrast Didone wordmark, restrained gold, generous editorial spacing.

---

## A) KEEP — already premium, do not change

- **Header (Concept 1)** — stripe geometry, gold satin shading, wordmark weight/tracking, INNER BEAUTY hairlines, utility/nav row separation. Renders correctly at 1440 and 390. Protect as-is.
- **Editorial serif headline system** — "Carefully sourced. Always authentic.", "What's worth knowing now.", "Every ingredient, in plain English." Scale, measure and left-alignment read genuinely editorial.
- **Footer** — black canvas, wordmark lockup, gold "SEOUL SOURCED. SKIN ASSURED." line, four-column link structure. Consistent with the new identity.
- **Gold discipline overall** — gold appears only in the stripe, hairlines and the footer tagline. It is not overused and does not read cheap.
- **PDP copy architecture** — "Why it may suit you" / "How to use" / Key ingredients / Where it sits in a routine / Authenticity & sourcing accordions are a real differentiator and well typeset.
- **Journal (/blog)** — hero article layout, image quality and typography are the strongest non-header pages on the site.
- **Home "Seoul Edit" editor's-note module** and the numbered brand/ingredient index rows — restrained, grid-disciplined, distinctive.
- **About page** — cinematic imagery, signature block, proof-step sequence. On-brand.

---

## B) HIGH PRIORITY — visibly damages the premium impression

1. **/brands — pastel candy gradient tiles break the brand system.**
   Thirteen cards render as saturated baby-blue, lilac, peach, mint and bubblegum-pink gradients. Against a black/white/gold identity this is the single biggest visual contradiction on the site and reads consumer-mass, not luxury.
   *Fix:* replace the per-brand colour gradients with a neutral system — off-white/pale-grey (#F4F4F5) tiles or full-bleed product photography with a subtle black scrim — and keep brand differentiation in the serif brand name and product count only.

2. **/brands — unreadable labels on light tiles.**
   "HARUHARU WONDER" in white over a light beige gradient, and the "2 PRODUCTS" pill on the same tile, fail contrast. Also affects the Beauty of Joseon tile.
   *Fix:* fixed near-black label colour on neutral tiles (follows automatically from item 1), or a consistent bottom scrim.

3. **/contact at 390px — horizontal overflow (scrollWidth 404 vs 390).**
   `customercare@skingrocer.com.au` is set at display serif size and pushes past the viewport; the intro paragraph and the `*Next-day delivery…` footnote are also clipped at the right edge. This is the only page on the site that scrolls horizontally.
   *Fix:* reduce the email to a smaller display step on mobile, add `break-words`/`overflow-wrap: anywhere` to the email and footnote, and confirm the form container respects the page gutter.

4. **PDP — slideshow controls are exposed as raw UI.**
   "‹ › PAUSE SLIDESHOW" and "Use ← → keys" sit as visible chrome directly under the hero image. Functional and accessible in intent, but it reads like an admin control strip on a luxury PDP.
   *Fix:* keep the keyboard behaviour and a screen-reader-only pause control; visually reduce to small unobtrusive arrows plus dot indicators, and move the "use arrow keys" hint into an `sr-only` instruction.

5. **Homepage hero repeats the wordmark immediately below the header wordmark.**
   "SKIN GROCER" appears twice within ~900px of viewport. It dilutes the masthead rather than reinforcing it, and it costs the hero its actual message.
   *Fix:* replace the hero H1 with the positioning line ("Skincare, curated differently — for your climate, your skin, your routine.") set in the display serif, with the eyebrow retained. Keep the two CTAs.

6. **Add-to-cart CTA label and button shape are inconsistent across the site.**
   PLP says "ADD TO BASKET", home editor's note says "ADD TO ORDER", PDP says "Add to bag · $28"; PDP/About primary buttons are fully-rounded pills while hero and checkout buttons are square. Mixed radius is the clearest "template" tell on the site.
   *Fix:* one verb everywhere ("Add to bag"), and one button geometry — square/2px radius — for all primary actions. Do not touch cart or checkout logic, label and class only.

7. **Product photography backgrounds are inconsistent within the same grid.**
   On /shop, most tiles sit on light grey, while e.g. the Hyper PDRN Ampoule and the medicube Exosome Shot are cut-outs on white with a texture splash. Row rhythm breaks and the grid looks assembled rather than shot.
   *Fix:* standardise the tile background to one neutral and normalise product scale/padding within the frame; regenerate or re-crop the outliers only.

8. **"SkinGrocer" (one word) appears in body copy while the mark is "SKIN GROCER".**
   Seen in the home Ingredient/Radar copy, the /shop-adjacent modules and the footer newsletter consent line, alongside correct "Skin Grocer" usage on /about and /brands.
   *Fix:* normalise all prose to "Skin Grocer".

---

## C) MEDIUM PRIORITY — worthwhile refinement, not launch-blocking

9. **/routines — six rounded, bordered white cards with a large dead zone before the footer.** The card set is generic-ecommerce and the page ends abruptly with ~250px of empty canvas.
   *Fix:* square the cards, replace the border with a single hairline rule grid (matching the brands/ingredient index rows already used on home), and either add the routine product thumbnails or reduce the bottom padding.

10. **/learn — rounded bordered cards + fully-rounded pill filters.** The content is excellent; the container styling is Bootstrap-adjacent.
    *Fix:* hairline-divided grid, square filter chips with an underline active state (matching the nav language).

11. **Section background drift.** Home alternates white with a light grey (#F4F4F5-ish) band, /shop tiles use the same grey, /skin-concerns cards are warm cream-toned. Nothing is cream-as-page-background (good), but three neutrals compete.
    *Fix:* lock two surfaces only — pure white page and one soft grey for tiles/bands — and remove the third tone.

12. **/checkout empty state leaves ~600px of white void above the footer.** Correct message, wrong proportion.
    *Fix:* centre the empty state in a fixed min-height block and add a small "Continue where you left off" product row.

13. **PDP right column has a large unused block under the CTAs** while the accordions sit far below the fold.
    *Fix:* pull the first accordion group up into the right column or reduce the gap so the fold ends on content, not emptiness.

14. **Footer newsletter button wraps to two lines** ("JOIN THE / LIST") at desktop width.
    *Fix:* widen the button or set `whitespace-nowrap`.

15. **PLP sort control is a native `<select>`** next to otherwise bespoke typography.
    *Fix:* restyle to a bordered square control with the site's letterspaced caps.

16. **Mobile PLP — the "COMPARE" checkbox overlays the product image** bottom-right and competes with the wishlist heart.
    *Fix:* move compare below the price row on mobile, or hide it under a filter-bar toggle.

17. **Home hero image reads dim and muddy** and the product packshot at the lower right is cropped mid-bottle by the viewport edge.
    *Fix:* lift exposure slightly, reduce the overlay opacity, and reposition the focal crop so the bottle is either fully in frame or fully out.

18. **Home trust ticker at the bottom of the hero runs off the right edge** ("EXPRESS AU SHIPPIN…") at 1440px.
    *Fix:* ensure the marquee/flex row masks cleanly with a fade rather than a hard cut.

19. **/skin-concerns tiles are heavily rounded with gradient scrims** and the imagery is abstract macro texture — cohesive with each other but softer than the header's discipline.
    *Fix:* square the corners and reduce the scrim; keep the imagery.

20. **Chat widget bubble** floats over PDP/PLP content at both widths in a dark circle with a generic icon.
    *Fix:* smaller, square-ish or hairline-outlined trigger, and offset it clear of the add-to-bag row on mobile.

---

## D) OPTIONAL / LATER

- Bespoke Skin Grocer icon set (search / heart / bag) drawn to the wordmark's stroke contrast.
- Subtle stripe motif reprise as a section divider (static, one or two places only).
- Hover micro-interaction language: single slow image scale + caption reveal on cards.
- Editorial lookbook/campaign imagery to replace the remaining generic macro shots.
- Brand-story pages per house, using the About page template.
- Reduced-motion audit of the home carousel autoplay.

---

## Top 5 highest-impact, lowest-risk changes

1. Neutralise the /brands pastel gradient tiles to the black/white/grey system (fixes the biggest identity break and the contrast failures in one pass).
2. Fix the /contact mobile horizontal overflow (only true layout bug found).
3. Unify add-to-bag labelling and primary-button radius sitewide (pure presentation, no cart logic).
4. Replace the duplicated hero wordmark with the positioning statement.
5. Standardise product-tile backgrounds and scale on /shop.

---

## Launch readiness

The visual system is **close, but I recommend one controlled refinement pass before launch**. The header, footer, typography and editorial modules are genuinely premium; the failures are concentrated and cheap to fix — /brands pastel tiles, the /contact mobile overflow, CTA/button inconsistency and the duplicated hero wordmark. Items 1–8 are a contained pass touching presentation only, with no impact on checkout, Stripe, orders, emails, database or warehouse workflows. Everything in C and D can follow after launch.
