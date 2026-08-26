# Skin Grocer Orbit Observatory hero

## Goal
Replace the five-slide homepage carousel with one cinematic, interactive hero that explains Skin Grocer immediately and turns the personalised consultation into the main action.

## Chosen direction
- **Visual world:** Plum + Citron — porcelain `#F8F3F0`, orchid `#E6CBD7`, plum `#742E54`, blackberry `#321526`, active citron `#D7F238`, moss `#829B28`.
- **Typography:** retain the existing Bodoni Moda Skin Grocer identity with clear sans-serif support text.
- **Experience:** Rotating Product Observatory inspired by award-winning WebGL product-inspection sites, adapted around Skin Grocer’s authenticity, guidance and personalisation offer.

## Build
1. Replace `HeroCarousel` with a focused `ProductObservatoryHero` component.
2. Use the selected cinematic observatory artwork as a layered full-bleed visual foundation, preserving real product visibility and dark negative space for copy.
3. Add pointer/touch-responsive depth and rotation across the bottle, verification seal, QR card and orbit line. Use perspective and lighting movement rather than a static split layout.
4. Add three accessible hotspots:
   - **Seoul verified** — sourced and checked before dispatch.
   - **Your routine** — opens the first consultation question in the hero.
   - **Scan to know how** — explains the order-linked QR guidance.
5. Make the first quiz answer actionable in place. Selecting a skin behaviour continues to `/consultation` with the answer carried in the URL/state where the current consultation flow can safely consume it.
6. Lead with one clear promise: authenticated Korean skincare plus a thorough personalised routine, locally dispatched from Melbourne.
7. Add a scroll cue and cinematic camera-like exit that visually hands off to the existing homepage promise/story section.
8. Keep a lightweight, static but premium fallback for reduced motion and smaller/mobile devices; no interaction may block navigation or readability.

## Technical approach
- Build the spatial effect with CSS 3D transforms, pointer tracking and layered media first, avoiding a heavy WebGL dependency for this iteration.
- Upload the selected generated observatory art through the project asset flow.
- Define the full Plum + Citron scale as semantic hero tokens in `src/styles.css`; citron remains restricted to active diagnostics and verified touchpoints.
- Reuse the project’s existing links, focus treatment and reduced-motion support.
- Preserve the current homepage SEO/structured data and all sections below the hero.

## Validation
- Verify the hero at desktop and mobile sizes, including drag/pointer response, hotspot keyboard access, quiz continuation, reduced motion, text contrast and no overlap with the sticky header.
- Check the latest build diagnostics and inspect the rendered result against the selected cinematic frame before handoff.
