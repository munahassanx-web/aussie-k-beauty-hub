import { describe, expect, it } from 'vitest';
import { buildRoutine, type QuizAnswers } from '@/lib/routine-matching';
import { productInci } from '@/lib/product-detail';
import { isPurchasable, productPrice } from '@/lib/shop-catalog';

const ACTIVE_NAME = /bha|aha|acid|retinal|retinol|retinoid/i;

const base: QuizAnswers = {
  skinFeel: 'balanced',
  primaryConcern: 'hydration',
  secondaryConcern: 'none',
  reactivity: 'sometimes',
  experience: 'some',
  depth: 'balanced',
  texture: 'either',
};

function hasActive(outcome: ReturnType<typeof buildRoutine>): boolean {
  return outcome.items.some((i) => ACTIVE_NAME.test(i.product.name));
}

describe('Routine Finder Question 5 safeguards', () => {
  it('1. Often + familiar → no exfoliating acids or retinoids', () => {
    const out = buildRoutine({ ...base, reactivity: 'often', experience: 'confident' });
    expect(hasActive(out)).toBe(false);
  });

  it('2. Often + new → no exfoliating acids or retinoids', () => {
    const out = buildRoutine({ ...base, reactivity: 'often', experience: 'new' });
    expect(hasActive(out)).toBe(false);
  });

  it('3. Overworked + familiar → cautious (minimal) routine, no treatment steps', () => {
    const out = buildRoutine({ ...base, primaryConcern: 'barrier', experience: 'confident', depth: 'full' });
    const steps = out.items.map((i) => i.step);
    expect(steps).toContain('Cleanse');
    expect(steps).toContain('Moisturise');
    expect(steps).not.toContain('Treat');
    expect(steps).not.toContain('Second treatment');
    expect(steps).not.toContain('Weekly treatment');
    expect(hasActive(out)).toBe(false);
  });

  it('4. Rarely + familiar → targeted products only when the ingredient list has been reviewed', () => {
    const out = buildRoutine({ ...base, reactivity: 'rarely', experience: 'confident', depth: 'full' });
    for (const item of out.items) {
      if (ACTIVE_NAME.test(item.product.name)) {
        expect(productInci(item.product), `${item.product.name} must have a reviewed ingredient list`).toBeTruthy();
      }
    }
  });

  it('5. Question 5 never overrides safety: often-reactive exclusions hold at every familiarity level', () => {
    for (const experience of ['new', 'some', 'confident'] as const) {
      const out = buildRoutine({ ...base, reactivity: 'often', experience });
      expect(hasActive(out)).toBe(false);
      for (const item of out.items) {
        expect(productInci(item.product)).toBeTruthy();
      }
    }
  });
});

describe('Routine Finder Question 6 — routine length is a preference, not a quota', () => {
  const essentialSteps = (out: ReturnType<typeof buildRoutine>) => out.items.map((i) => i.step);

  it('1. Often + layered → cautious essentials only', () => {
    const out = buildRoutine({ ...base, reactivity: 'often', depth: 'full' });
    const steps = essentialSteps(out);
    expect(steps).not.toContain('Treat');
    expect(steps).not.toContain('Second treatment');
    expect(steps).not.toContain('Weekly treatment');
    expect(hasActive(out)).toBe(false);
    expect(out.cautiousOverride).toBe(true);
  });

  it('2. Overworked + layered → cautious essentials only', () => {
    const out = buildRoutine({ ...base, primaryConcern: 'barrier', depth: 'full' });
    const steps = essentialSteps(out);
    expect(steps).toContain('Cleanse');
    expect(steps).toContain('Moisturise');
    expect(steps).not.toContain('Treat');
    expect(steps).not.toContain('Weekly treatment');
    expect(out.cautiousOverride).toBe(true);
  });

  it('3. Rarely + layered → optional products only when suitable and ingredient-reviewed', () => {
    const out = buildRoutine({ ...base, reactivity: 'rarely', depth: 'full' });
    expect(out.cautiousOverride).toBe(false);
    for (const item of out.items) {
      if (ACTIVE_NAME.test(item.product.name)) {
        expect(productInci(item.product)).toBeTruthy();
      }
      expect(item.why.length).toBeGreaterThan(0);
    }
  });

  it('4. Essential → nothing is added merely to increase order value', () => {
    const out = buildRoutine({ ...base, depth: 'minimal' });
    const steps = essentialSteps(out);
    expect(steps).not.toContain('Tone & prep');
    expect(steps).not.toContain('Treat');
    expect(steps).not.toContain('Second treatment');
    expect(steps).not.toContain('Weekly treatment');
    const layered = buildRoutine({ ...base, depth: 'full' });
    expect(out.totalCents).toBeLessThanOrEqual(layered.totalCents);
  });

  it('5. The routine total counts only purchasable products', () => {
    const out = buildRoutine({ ...base, depth: 'full' });
    const expected = out.items.reduce(
      (sum, i) => sum + Math.round(productPrice(i.product) * 100),
      0,
    );
    expect(out.totalCents).toBe(expected);
    for (const item of out.items) {
      expect(isPurchasable(item.product.priceId)).toBe(true);
    }
  });

  it('6. Neutral sunscreen guidance is never priced or added to the cart', () => {
    const out = buildRoutine({ ...base, depth: 'full' });
    if (out.protectPlaceholder) {
      expect(out.items.some((i) => i.step === 'Protect')).toBe(false);
    }
    const priced = out.items.reduce((sum, i) => sum + Math.round(productPrice(i.product) * 100), 0);
    expect(out.totalCents).toBe(priced);
  });
});
