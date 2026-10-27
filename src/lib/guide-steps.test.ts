import { describe, expect, it } from "vitest";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { howToUse, productSlug, supplyRestricted } from "@/lib/product-detail";
import { applicationForSlug } from "@/lib/product-application-data";
import { guideDirections } from "@/lib/guide-steps";

const howToUseFor = (p: (typeof SHOP_PRODUCTS)[number]) => {
  const brand = applicationForSlug(productSlug(p));
  return brand?.steps.length ? brand.steps : howToUse(p);
};

const bySlug = (slug: string) => {
  const product = SHOP_PRODUCTS.find((p) => productSlug(p) === slug);
  if (!product) throw new Error(`Missing product: ${slug}`);
  return product;
};

describe("guideDirections", () => {
  it("uses the brand's own directions, one step per sentence, unchanged", () => {
    const d = guideDirections(bySlug("round-lab-1025-dokdo-toner-100ml"));
    expect(d.fromBrand).toBe(true);
    expect(d.steps.map((s) => s.art)).toEqual(["pad", "sweep"]);
    expect(d.steps[0]!.text).toBe(
      "After cleansing, soak a cotton pad with an appropriate amount of toner.",
    );
  });

  it("splits general guidance into short steps without rewording it", () => {
    const p = SHOP_PRODUCTS.find(
      (x) =>
        x.category === "Moisturise" &&
        guideDirections(x).fromBrand === false &&
        guideDirections(x).steps.length,
    )!;
    const d = guideDirections(p);
    expect(d.steps.length).toBeGreaterThan(1);
    for (const s of d.steps) expect(s.text.length).toBeGreaterThan(0);
  });

  it("gives no directions for a sunscreen without an Australian supply record", () => {
    for (const p of SHOP_PRODUCTS.filter(supplyRestricted)) {
      expect(guideDirections(p).steps).toEqual([]);
    }
  });

  it("shows mask application even when the same instruction includes wear time", () => {
    const product = SHOP_PRODUCTS.find(
      (p) => productSlug(p) === "biodance-bio-collagen-real-deep-mask",
    );
    if (!product) throw new Error("Biodance mask missing from catalogue");
    expect(guideDirections(product).steps.map((step) => step.art)).toEqual(["mask", "mask"]);
  });

  it("shows placing and removing a sheet mask rather than a timer", () => {
    const product = SHOP_PRODUCTS.find((p) => productSlug(p) === "torriden-dive-in-mask-pack-1pc");
    if (!product) throw new Error("Torriden mask missing from catalogue");
    expect(guideDirections(product).steps.map((step) => step.art)).toEqual(["mask", "remove"]);
  });

  it("uses Torriden's own words for the cream steps", () => {
    const d = guideDirections(bySlug("torriden-dive-in-soothing-cream"));
    expect(d.steps.map((step) => step.text)).toEqual([
      "Apply an appropriate amount evenly over the face.",
      "Pat lightly to absorb.",
    ]);
    expect(d.steps.map((step) => step.phase)).toEqual(["apply", "work"]);
    expect(d.steps.map((step) => step.title)).toEqual(["Apply", "Pat it in"]);
  });

  it("provides multiple visual steps for every available product guide", () => {
    const available = SHOP_PRODUCTS.filter((product) => guideDirections(product).steps.length > 0);
    expect(available.length).toBeGreaterThan(40);
    for (const product of available) {
      expect(guideDirections(product).steps.length, productSlug(product)).toBeGreaterThan(1);
    }
  });

  it("keeps the same photo sequence and the brand's words for each leave-on guide", () => {
    const leaveOn = SHOP_PRODUCTS.filter((p) => guideDirections(p).steps.some((s) => s.sequence));
    expect(leaveOn.length).toBeGreaterThan(10);
    for (const p of leaveOn) {
      const steps = guideDirections(p).steps;
      expect(steps[0]!.phase, productSlug(p)).toBe("apply");
      expect(new Set(steps.map((s) => s.sequence)).size).toBe(1);
      const words = (t: string) =>
        t
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .split(/\s+/);
      const source = new Set(words(howToUseFor(p).join(" ")));
      for (const s of steps)
        for (const w of words(s.text)) expect(source.has(w), `${productSlug(p)}: ${w}`).toBe(true);
    }
  });
});
