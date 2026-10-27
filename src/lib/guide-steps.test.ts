import { describe, expect, it } from "vitest";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug, supplyRestricted } from "@/lib/product-detail";
import { guideDirections } from "@/lib/guide-steps";

const bySlug = (slug: string) => SHOP_PRODUCTS.find((p) => productSlug(p) === slug)!;

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
});
