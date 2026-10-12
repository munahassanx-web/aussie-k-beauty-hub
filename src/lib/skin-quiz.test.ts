import { describe, expect, it } from "vitest";
import { skinFeelFromZones, zoneSummary } from "@/lib/skin-quiz";

describe("face map to skin type", () => {
  it("no shine and no tightness is balanced", () => {
    expect(skinFeelFromZones({ shine: [], tight: [] })).toBe("balanced");
  });
  it("tightness only is dry", () => {
    expect(skinFeelFromZones({ shine: [], tight: ["left-cheek", "right-cheek"] })).toBe("dry");
  });
  it("T-zone shine only is combination", () => {
    expect(skinFeelFromZones({ shine: ["forehead", "nose", "chin"], tight: [] })).toBe(
      "combination",
    );
  });
  it("shine including cheeks with no tightness is oily", () => {
    expect(
      skinFeelFromZones({ shine: ["forehead", "nose", "left-cheek", "right-cheek"], tight: [] }),
    ).toBe("oily");
  });
  it("shine in one place and tightness in another is combination", () => {
    expect(skinFeelFromZones({ shine: ["nose"], tight: ["left-cheek"] })).toBe("combination");
  });
  it("summarises zones in plain English", () => {
    expect(
      zoneSummary({ shine: ["forehead", "nose", "chin"], tight: ["left-cheek", "right-cheek"] }),
    ).toBe("You mapped shine on your T-zone and tightness on your cheeks.");
  });
});
