import { describe, expect, it } from 'vitest';
import { SHOP_PRODUCTS, contentInPreparation } from '@/lib/shop-catalog';
import { productFaqs } from '@/lib/faqs';
import { howToUse, productDescription, hasSourcedCosmeticRole, USAGE_CAUTION } from '@/lib/product-detail';

function faqsFor(priceId: string) {
  const p = SHOP_PRODUCTS.find((x) => x.priceId === priceId)!;
  expect(p).toBeTruthy();
  return productFaqs(p, {
    steps: howToUse(p),
    description: productDescription(p),
    usageNote: hasSourcedCosmeticRole(p) ? USAGE_CAUTION : undefined,
  });
}

const text = (a: unknown) => (typeof a === 'string' ? a : '');

describe('product questions accuracy', () => {
  it('Dr.G cleanser uses the approved cleanser answers', () => {
    const f = faqsFor('dr_g_red_blemish_clear_soothing_foam_150ml_onetime');
    expect(text(f.find((x) => x.q.includes('good for'))?.a)).toContain(
      'rinse-off facial cleanser used as Step 1',
    );
    expect(text(f.find((x) => x.q.includes('use') && x.q.includes('with'))?.a)).toContain(
      'does not require you to avoid retinal or exfoliating acids',
    );
  });

  it('Dr.G cream uses the approved moisturiser answers', () => {
    const f = faqsFor('dr_g_r_e_d_blemish_clear_soothing_cream_70ml_onetime');
    expect(text(f.find((x) => x.q.includes('good for'))?.a)).toContain(
      'lightweight moisturising cream used as Step 4',
    );
    expect(text(f.find((x) => x.q.includes('use') && x.q.includes('with'))?.a)).toContain(
      'No verified ingredient interaction'.toLowerCase().slice(0, 0) + 'There is no verified ingredient interaction',
    );
  });

  it('WELLAGE ampoule uses the approved ampoule answers', () => {
    const f = faqsFor('wellage_hyper_pdrn_repair_ampoule_30ml_onetime');
    expect(text(f.find((x) => x.q.includes('good for'))?.a)).toContain(
      'This ampoule is used as Step 3 — treat',
    );
  });

  it('no product question answer is empty and none carries the generic active warning', () => {
    for (const p of SHOP_PRODUCTS) {
      const items = productFaqs(p, { steps: howToUse(p), description: productDescription(p) });
      if (contentInPreparation(p)) {
        expect(items).toHaveLength(0);
        continue;
      }
      for (const f of items) {
        expect(f.q.trim().length).toBeGreaterThan(0);
        expect(Boolean(f.a)).toBe(true);
        const a = text(f.a);
        expect(a).not.toContain('avoid using it in the same session as a strong exfoliating acid');
        expect(a).not.toContain('congestion and excess oil, comfort for reactive skin');
      }
    }
  });
});
