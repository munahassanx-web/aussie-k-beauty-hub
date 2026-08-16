# Fix the Dive In Trial Kit lifestyle image

## What's wrong

The third gallery image for the TORRIDEN Dive In Trial Kit (`dive-in-trial-kit-apply.png`) shows five unbranded, invented pale-blue tubes and bottles in a linen pouch. The real kit contains exactly four items, which are clearly visible on the catalog packshot:

- DIVE IN Cleansing Foam 30ml — white squeeze tube, blue text
- DIVE IN Toner — clear bottle with pale aqua liquid, flip cap
- DIVE IN Serum — pale blue tube with white pump cap
- DIVE IN Soothing Cream — pale blue tube with white cap

## The fix

Regenerate the image using the real packshot (`/products/torriden/dive-in-trial-kit.png`) as the visual anchor, so the four items in the shot are the actual kit products with correct shapes, colours and "Torriden / DIVE IN" labelling — no fifth invented bottle, no generic blank tubes.

Keep the same editorial treatment as the rest of the gallery: soft natural light, neutral linen/beige surface, travel pouch context, warm minimal styling.

Then re-check the finished image against the packshot before showing it, and update the alt text so it names the four real products.

## Also worth checking

The equivalent Balanceful Trial Kit shot (`balanceful-trial-kit-apply.png`) was generated the same way and may have the same invented-product problem. Included in this pass: verify it against its packshot and regenerate if the items don't match.

## Technical detail

- Use `edit_image` with the catalog packshot as input rather than a fresh text-to-image generation, so product geometry and labels carry over.
- Overwrite the existing files in `public/products/editorial/torriden/`; the paths in `src/lib/product-detail.ts` stay the same, only the `alt` strings change.
