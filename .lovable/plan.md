# Product information accordion correction

## Scope
- Update only the six shared product-information accordions on completed, purchasable product pages.
- Preserve the purchase panel, gallery, catalogue data, prices, availability, recommendations, header, footer, FAQs, and Coming Soon/restricted-product safeguards.

## Implementation
1. Replace generic benefit, usage, routine-position, and ingredient fallbacks with factual helpers driven by stored product category/type, routine step, reviewed INCI/provenance, usage directions, precautions, and verification state.
2. Render the accordions in the approved order with only Product overview open initially.
3. Rename headings and apply the exact neutral educational, authenticity, shipping, provenance, packaging-check, and reformulation wording requested.
4. Ensure ingredient highlights render only when validated against a complete reviewed INCI record; otherwise show the review-in-progress message and no inferred ingredients.
5. Add a specific neutral PDRN/peptide presentation for the WELLAGE ampoule only when those ingredients are present in its reviewed INCI.
6. Keep product-specific mask directions where reviewed; use the approved type-specific fallback for cleansers, toners/essences, treatments/serums/ampoules, and moisturisers.
7. Preserve independent accordion state while confirming keyboard access, focus visibility, ARIA state, and minimum control height.

## Verification
- Add focused automated coverage for the DR.G cleanser, WELLAGE ampoule, DR.G moisturiser, and one completed product without a reviewed ingredient record.
- Verify prohibited language is absent, routine placement and directions are correct, provenance states render correctly, and only the first accordion starts open.
- Check desktop and mobile rendering plus accordion interaction, Add to Bag, gallery, and recommendation regression behavior.
- Confirm catalogue totals remain 77 total, 21 Coming Soon, 52 purchasable, and 0 Coming Soon purchasable.
