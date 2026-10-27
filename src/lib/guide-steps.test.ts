import { describe, expect, it } from "vitest";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug, supplyRestricted } from "@/lib/product-detail";
import { guideDirections } from "@/lib/guide-steps";

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
    const product = SHOP_PRODUCTS.find(
      (p) => productSlug(p) === "torriden-dive-in-mask-pack-1pc",
    );
    if (!product) throw new Error("Torriden mask missing from catalogue");
    expect(guideDirections(product).steps.map((step) => step.art)).toEqual(["mask", "remove"]);
  });

  it("gives Torriden cream application, patting and finished-appearance steps", () => {
    const d = guideDirections(bySlug("torriden-dive-in-soothing-cream"));
    expect(d.steps.map((step) => step.phase)).toEqual(["apply", "work", "finish"]);
    expect(d.steps.map((step) => step.art)).toEqual(["spread", "pat", "absorb"]);
    expect(d.sourceSteps).toEqual(["Apply an appropriate amount evenly over the face and pat lightly to absorb."]);
    expect(new Set(d.steps.map((step) => step.sequence)).size).toBe(1);
  });

  it("provides multiple visual steps for every available product guide", () => {
    const available = SHOP_PRODUCTS.filter((product) => guideDirections(product).steps.length > 0);
    expect(available.length).toBeGreaterThan(40);
    for (const product of available) {
      expect(guideDirections(product).steps.length, productSlug(product)).toBeGreaterThan(1);
    }
  });

  it("keeps the same photo sequence for each leave-on guide", () => {
    const sequences = SHOP_PRODUCTS.map(guideDirections).filter((d) => d.sourceSteps);
    expect(sequences.length).toBeGreaterThan(10);
    for (const d of sequences) {
      expect(d.steps.map((s) => s.phase)).toEqual(["apply", "work", "finish"]);
      expect(new Set(d.steps.map((s) => s.sequence)).size).toBe(1);
    }
  });
});
