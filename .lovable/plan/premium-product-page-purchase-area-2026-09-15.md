# Premium product-page purchase area

## Scope
Upgrade only the first purchase area on product pages. Keep the header, lower information sections, routine recommendations, footer, catalogue records, pricing, ingredients, and availability data unchanged.

## Implementation
- Correct the DR.G R.E.D Blemish Clear Soothing Cream introduction with the exact approved two-sentence wording.
- Replace broken generic category grammar with a safe product-noun mapping (`cleanser`, `toner`, `treatment`, `moisturiser`, `mask`, `sunscreen`) and the approved neutral fallback sentence.
- Reorder the purchasable product panel to: brand, H1 product name, routine step/size, description, price/GST, real stock status, Add to Bag, wishlist, then three compact reassurance rows and the two existing information links.
- Show “IN STOCK · DISPATCHED FROM MELBOURNE” only when the catalogue compliance gates pass and the live inventory lookup does not report the SKU as sold out. Hide it for Coming Soon, supply-pending, Australian-verification-pending, and sold-out products.
- Keep the main Add to Bag control full-width and at least 52px tall. Extend its shared control to accept live availability, prevent repeated activation while processing, expose loading and added states, provide a visible keyboard focus ring, and announce confirmation to assistive technology without redirecting to checkout.
- Make the mobile purchase bar observe the main Add to Bag control. Display it only on mobile after that control leaves view, keep it above the device safe area, reserve page space, use the same cart and live-inventory safeguards, and include the product name in its accessible label.
- Preserve the existing gallery interaction and fullscreen viewer while refining the square stage to a neutral surface, retaining `object-fit: contain`, fixed dimensions, first-image eager loading, later-image lazy loading, and keyboard-accessible thumbnails. Constrain image rendering to avoid enlarging source artwork beyond its natural dimensions.
- Keep unavailable and pending pages on their existing protected views with no price or purchase controls.

## Verification
- Add focused automated tests for the corrected DR.G description, grammatical fallbacks, catalogue totals, and purchase eligibility safeguards.
- Test these live pages:
  - DR.G R.E.D Blemish Clear Soothing Cream at 1280×900 and 390×844.
  - DR.G Red Blemish Clear Soothing Foam as a purchasable cleanser.
  - One Coming Soon product.
  - AESTURA Derma UV365 sunscreen as the Australian-verification-pending product.
- Verify the desktop hierarchy, image containment, genuine stock label, cart loading/confirmation and duplicate-click protection, mobile bar appearance/disappearance, keyboard focus, screen-reader announcement, and unavailable-page restrictions.
- Confirm 77 total products, 21 Coming Soon, 52 purchasable, and 0 Coming Soon purchasable; run focused tests, type checking, and confirm the preview build is healthy.

## Files expected to change
- `src/routes/product.$slug.tsx`
- `src/components/add-to-bag-button.tsx`
- `src/lib/product-detail.ts`
- Focused product purchase-area test file(s)
