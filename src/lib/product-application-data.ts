// Product-specific application directions, keyed by the catalog slug.
//
// SOURCE RULE (non-negotiable): every entry here is transcribed from the
// brand's own official product page or official brand documentation. No
// amounts, frequencies, AM/PM guidance, warnings or cautions are inferred.
// Wording may be lightly reformatted into steps, never changed in substance.
// `source` is maintainer-facing metadata (surfaced in /admin/guide-links),
// not customer-facing copy.
//
// A SKU with no entry here stays in the honest fallback state: the guide page
// labels the steps as general routine-step guidance, not brand directions.

export type ApplicationData = {
  /** Step-by-step directions, from the official brand page. */
  steps: string[];
  /** Only when the official source states an amount. */
  amount?: string;
  /** Only when the official source states frequency / AM-PM. */
  frequency?: string;
  /** Only when the official source states a product-specific note or caution. */
  note?: string;
  /** Official source URL (internal/admin reference). */
  source: string;
};

export const PRODUCT_APPLICATION: Record<string, ApplicationData> = {
  // --- ROUND LAB (roundlab.com official global store) ------------------------
  'round-lab-1025-dokdo-toner-100ml': {
    steps: [
      'After cleansing, soak a cotton pad with an appropriate amount of toner.',
      'Gently wipe the cotton pad along the skin texture to smooth it out.',
    ],
    amount: 'An appropriate amount on a cotton pad',
    source: 'https://roundlab.com/products/1025-dokdo-toner',
  },
  'round-lab-1025-dokdo-lotion-200ml': {
    steps: ['After toner, apply a small amount to the face.', 'Allow the lotion to absorb.'],
    amount: 'A small amount',
    source: 'https://roundlab.com/products/1025-dokdo-lotion',
  },
  'round-lab-1025-dokdo-cleanser-150ml': {
    steps: [
      'Add water to create a creamy foam.',
      'Massage onto the face.',
      'Rinse with lukewarm water.',
    ],
    source: 'https://roundlab.com/products/1025-dokdo-cleanser',
  },
  'round-lab-birch-juice-moisturizing-cream-80ml': {
    steps: [
      'As the last step of skincare, apply an appropriate amount to the skin.',
      'Apply as if creating a moisture barrier.',
    ],
    amount: 'An appropriate amount',
    source: 'https://roundlab.com/products/birch-moisturizing-cream',
  },

  // --- ISNTREE (isntree-global.com official store) ---------------------------
  'isntree-hyaluronic-acid-water-essence-50ml': {
    steps: [
      'Take 2–3 drops of the essence onto your palm and apply it to your face.',
      'Pat gently into the skin until absorbed.',
    ],
    amount: '2–3 drops',
    source: 'https://isntree-global.com/products/isntree-hyaluronic-acid-water-essence-50ml',
  },
  'isntree-green-tea-fresh-toner-200ml': {
    steps: [
      'After washing your face, soak a cotton pad with the toner.',
      'Sweep the cotton pad all over the face.',
      'Pat the product into the skin until absorbed.',
    ],
    source: 'https://isntree-global.com/products/isntree-green-tea-fresh-toner-200ml',
  },
  'isntree-yam-root-vegan-milk-cleanser-220ml': {
    steps: [
      'Massage gently onto dry skin until makeup and impurities melt.',
      'Add water and continue to massage.',
      'Rinse thoroughly with warm water, or wipe off with cotton pads.',
    ],
    source: 'https://isntree-global.com/products/isntree-yam-root-vegan-milk-cleanser-220ml',
  },

  // --- MEDICUBE (medicube.us official store) ---------------------------------
  'medicube-one-day-exosome-shot-pore-serum-2000-30ml': {
    steps: [
      'After cleansing, apply the Exosome Shot over the whole face, avoiding the eye and lip area. Medicube recommends using it as the first step of your routine.',
      'Gently rub and press with your hands so the formula absorbs deep into the skin.',
      "Finish with Medicube's Collagen Jelly Cream, or your daily water-based moisturiser.",
    ],
    note: 'Medicube also lists an “Expert” method: prep with Zero Pore Pads (or a hydrating toner), apply to target areas such as uneven texture or enlarged pores, then finish with a moisturiser.',
    source: 'https://medicube.us/products/exosome-shot',
  },
  'medicube-pdrn-pink-peptide-serum-30ml': {
    steps: [
      'Apply a generous amount to clean, dry skin.',
      'Spread evenly over face and neck, patting gently for better absorption.',
      'Follow with your regular moisturiser, and sunscreen during the day.',
    ],
    amount: 'A generous amount',
    frequency: 'Morning and night',
    source: 'https://medicube.us/products/rose-pdrn-pink-peptide-serum',
  },
  'medicube-collagen-jelly-cream-110ml': {
    steps: [
      'Apply to face and décolletage after any targeted serums.',
      'Morning: after cleansing, apply a moderate amount, gently pat or massage, and let it absorb fully before makeup.',
      'Evening: after cleansing, apply a generous amount, avoiding the eye and mouth area, and let it absorb fully before bed.',
    ],
    amount: 'About a quarter-sized amount',
    frequency: 'Morning and evening',
    source: 'https://medicube.us/products/collagen-niacinamide-jelly-cream',
  },
  'medicube-pdrn-pink-peptide-eye-cream-30ml': {
    steps: [
      'As the last step of your routine, apply an appropriate amount to the desired area.',
      'Pat lightly to help absorption.',
    ],
    amount: 'An appropriate amount',
    note: 'Medicube notes it can be applied anywhere on the face, especially areas showing early signs of ageing.',
    source: 'https://medicube.us/products/pdrn-pink-peptide-eye-cream',
  },

  // --- BIODANCE (biodance.com official store) --------------------------------
  'biodance-refreshing-sea-kelp-real-deep-mask': {
    steps: [
      'Overnight: apply the mask at the end of your skincare routine and leave it on overnight, removing it the next morning.',
      'Daytime: after prepping skin with toner or serum, apply the mask and leave it on for 3–4 hours, or until it turns transparent.',
    ],
    note: 'Biodance tip: use the eye and mouth cut-outs on the sides of the nose, under the eyes, on the neck, or anywhere you want extra hydration and firming.',
    source: 'https://biodance.com/products/refreshing-sea-kelp-real-deep-mask',
  },
  'biodance-bio-collagen-real-deep-mask': {
    steps: [
      'Overnight: apply the mask at the end of your skincare routine and leave it on overnight, removing it the next morning.',
      'Daytime: after prepping skin with toner or serum, apply the mask and leave it on for 3–4 hours, or until it turns transparent.',
    ],
    note: 'Biodance tip: use the eye and mouth cut-outs on the sides of the nose, under the eyes, on the neck, or anywhere you want extra hydration and firming.',
    source: 'https://biodance.com/products/biodance-bio-collagen-real-deep-mask',
  },
  'biodance-hydro-cera-nol-real-deep-mask': {
    steps: [
      'Overnight: apply the mask at the end of your skincare routine and leave it on overnight, removing it the next morning.',
      'Daytime: after prepping skin with toner or serum, apply the mask and leave it on for 3–4 hours, or until it turns transparent.',
    ],
    note: 'Biodance tip: use the eye and mouth cut-outs on the sides of the nose, under the eyes, on the neck, or anywhere you want extra hydration and firming.',
    source: 'https://biodance.com/products/biodance-hydro-ceranol-real-deep-mask',
  },

  // --- TORRIDEN (torriden.us official store) ---------------------------------
  'torriden-dive-in-soothing-cream': {
    steps: ['Apply an appropriate amount evenly over the face and pat lightly to absorb.'],
    amount: 'An appropriate amount',
    source: 'https://torriden.us/products/dive-in-soothing-cream',
  },
  'torriden-balanceful-cleansing-gel': {
    steps: [
      'Put one to two pumps into wet hands and rub together to create a lather.',
      'Gently massage over the face.',
      'Wash off with lukewarm water.',
    ],
    amount: 'One to two pumps',
    note: 'Torriden also lists a deep-cleansing method: apply to dry skin, massage in rolling motions for about a minute, then add water and rinse.',
    source: 'https://torriden.us/products/balanceful-cleansing-gel',
  },
  'torriden-dive-in-mask-pack-1pc': {
    steps: [
      'After cleansing, place the sheet mask on your face.',
      'After 15–20 minutes, remove the mask and pat the face lightly so the remaining essence absorbs.',
    ],
    note: 'Torriden suggests following with the DIVE IN Soothing Cream for complete moisture care.',
    source: 'https://torriden.us/products/dive-in-mask',
  },
  'torriden-balanceful-trial-kit': {
    steps: [
      'Cleansing Gel: one to two pumps into wet hands, lather, massage the face, then rinse with lukewarm water.',
      'Toner Pad: after washing, wipe the face with the embossed side (avoiding the eye area), wipe again with the smooth side, then pat in what remains. Close the lid after use so the pads don’t dry out.',
      'Serum: apply an appropriate amount evenly over the face and pat lightly to absorb.',
      'Cream: apply an appropriate amount evenly over the face and pat lightly to absorb.',
    ],
    note: 'Kit contains Cleansing Gel 30ml, Toner Pad 2P x3, Serum 10ml and Cream 20ml — directions are listed per item by Torriden.',
    source: 'https://torriden.us/products/balanceful-trial-kit',
  },
  'torriden-dive-in-trial-kit': {
    steps: [
      'Cleansing Foam: squeeze an appropriate amount, rub hands to lather, massage the face gently, then rinse with lukewarm water.',
      'Toner: apply an appropriate amount evenly over the face and pat lightly to absorb.',
      'Serum: apply an appropriate amount evenly over the face and pat lightly to absorb.',
      'Soothing Cream: apply an appropriate amount evenly over the face and pat lightly to absorb.',
    ],
    note: 'Kit contains Cleansing Foam 30ml, Toner 50ml, Serum 20ml and Soothing Cream 20ml — directions are listed per item by Torriden.',
    source: 'https://torriden.us/products/dive-in-trial-kit',
  },

  // --- AESTURA (int.aestura.com official store) ------------------------------
  'aestura-atobarrier365-cream': {
    steps: [
      'Apply evenly onto clean skin after toner and serum.',
      'The visible ceramide capsules melt softly on application.',
      'Gently smooth and press into the skin to help absorption.',
    ],
    frequency: 'AM and PM',
    source: 'https://int.aestura.com/products/atobarrier365-cream',
  },
  'aestura-atobarrier-365-hydro-soothing-cream': {
    steps: [
      'Apply evenly onto clean skin after toner and serum.',
      'The visible ceramide capsules melt softly on application.',
      'Gently smooth and press into the skin to help absorption.',
    ],
    frequency: 'AM and PM',
    source: 'https://int.aestura.com/products/atobarrier-365-hydro-soothing-cream',
  },
  'aestura-a-cica-moisture-toner': {
    steps: ['After cleansing, take an appropriate amount and gently pat into skin with bare hands.'],
    amount: 'An appropriate amount',
    source: 'https://int.aestura.com/products/a-cica-365-hydration-toner-ph4-5',
  },
  'aestura-derma-uv365-barrier-moisture-mineral-sun-cream': {
    steps: [
      'Apply as the final step of your skincare routine, 15–30 minutes before sun exposure.',
      'Measure a generous amount — roughly two finger-lengths (index and middle) for face and neck.',
      'Dot onto forehead, nose, cheeks and chin, then spread evenly with outward strokes for a uniform layer.',
      'Pat gently to help the formula settle; on high-exposure areas such as cheekbones and the bridge of the nose, consider a thin second layer.',
    ],
    amount: 'Roughly two finger-lengths for face and neck',
    note: 'AESTURA notes that you should not stay in the sun for long periods even when using a sunscreen.',
    source: 'https://int.aestura.com/products/derma-uv365-barrier-hydro-mineral-sunscreen',
  },

  // --- Beauty of Joseon (beautyofjoseon.com official store) -------------------
  'beauty-of-joseon-revive-eye-serum-ginseng-plus-retinal-30ml': {
    steps: [
      'Pump the applicator 1–2 times and use your ring finger to gently pat the serum under and around the eyes.',
      'Always layer sunscreen over it during the day.',
    ],
    amount: '1–2 pumps',
    frequency: 'Morning and night',
    source: 'https://beautyofjoseon.com/products/revive-eye-serum-ginseng-retinal',
  },

  // --- beplain (beplainglobal.com official store) -----------------------------
  'beplain-mung-bean-cleansing-oil-200ml': {
    steps: [
      'Apply an appropriate amount to the face and massage gently.',
      'Emulsify with a few drops of water and keep massaging for about 30 seconds, until the oil turns milky.',
      'Rinse thoroughly with lukewarm water.',
    ],
    source: 'https://beplainglobal.com/products/beplain-mung-bean-cleansing-oil-200ml',
  },
  'beplain-mung-bean-ph-balanced-cleansing-foam-80ml': {
    steps: [
      'Take a penny-sized amount into your palm and lather with water.',
      'Massage gently onto the face.',
      'Rinse thoroughly with lukewarm water.',
    ],
    amount: 'A penny-sized amount',
    source: 'https://beplainglobal.com/products/beplain-mung-bean-ph-balanced-cleansing-foam-160ml',
  },

  // --- HARUHARU WONDER (haruharuusa.com official store) -----------------------
  'haruharu-wonder-black-rice-hyaluronic-toner-150ml': {
    steps: ['After washing the face, apply evenly to the skin.', 'Pat lightly until fully absorbed.'],
    note: 'Haruharu Wonder suggests layering 2–3 times for deeper, longer-lasting hydration.',
    source: 'https://haruharuusa.com/products/black-rice-hyaluronic-toner',
  },
  'haruharu-wonder-black-rice-5-ceramide-barrier-moisturizing-cream': {
    steps: [
      'After toner and essence or serum, apply an appropriate amount to face and neck.',
      'Massage gently so the capsules burst and the cream absorbs fully.',
    ],
    frequency: 'Morning and evening',
    note: 'Haruharu Wonder suggests paying special attention to dry areas.',
    source: 'https://haruharuusa.com/products/black-rice-5-ceramide-barrier-moisturizing-cream',
  },
};


export function applicationForSlug(slug: string): ApplicationData | undefined {
  return PRODUCT_APPLICATION[slug];
}

export type CoverageStatus = 'complete' | 'partial' | 'fallback';

/**
 * COMPLETE  — official directions plus at least one supported extra field.
 * PARTIAL   — official directions only.
 * FALLBACK  — no authoritative directions found; generic guidance is shown.
 */
export function coverageForSlug(slug: string): CoverageStatus {
  const entry = PRODUCT_APPLICATION[slug];
  if (!entry || entry.steps.length === 0) return 'fallback';
  const extras = [entry.amount, entry.frequency, entry.note].filter(Boolean).length;
  return extras > 0 ? 'complete' : 'partial';
}
