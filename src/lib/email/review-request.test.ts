import { describe, expect, it } from "vitest";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import {
  renderOrderConfirmation,
  renderReviewRequest,
  reviewableProducts,
  type OrderEmailData,
} from "@/lib/email/order-emails.server";

const order: OrderEmailData = {
  id: "test0001-0000-4000-8000-000000000000",
  createdAt: "2026-09-01T02:00:00.000Z",
  currency: "aud",
  amountCents: 6400,
  shippingCents: 0,
  discountCents: 0,
  lines: [
    {
      name: "Dive In Soothing Cream",
      quantity: 2,
      amountCents: 8000,
      lookupKey: "torriden_dive_in_soothing_cream_onetime",
    },
    { name: "Free gift: K-beauty sample", quantity: 1, amountCents: 0, lookupKey: null },
    { name: "Unknown item", quantity: 1, amountCents: 900, lookupKey: "not_in_catalogue" },
  ],
  shippingName: "Mia Test",
  shippingLine1: null,
  shippingLine2: null,
  shippingCity: null,
  shippingState: null,
  shippingPostcode: null,
  shippingCountry: null,
  shippingMethod: null,
  trackingNumber: null,
  shippingCarrier: null,
};

describe("review request email", () => {
  it("asks only about catalogue products that were bought, once each", () => {
    const items = reviewableProducts(order);
    expect(items.map((i) => i.product.priceId)).toEqual([
      "torriden_dive_in_soothing_cream_onetime",
    ]);
    expect(items[0]!.url).toBe(
      "https://skingrocer.com.au/product/torriden-dive-in-soothing-cream#reviews",
    );
  });

  it("links each product to its reviews and offers no incentive", () => {
    const { subject, html, text } = renderReviewRequest(order);
    expect(subject).toContain("How is your Skin Grocer routine going?");
    expect(html).toContain("/product/torriden-dive-in-soothing-cream#reviews");
    expect(text).toContain("torriden-dive-in-soothing-cream#reviews");
    expect(`${html} ${text}`).not.toMatch(/discount|points|% off|free gift for/i);
  });
});

describe("routine picks in order emails", () => {
  it("suggests in-stock products for missing steps, with photos and product links", () => {
    const { html, text } = renderOrderConfirmation(order);
    expect(html).toContain("Complete your routine");
    expect(html).toMatch(
      /\/product\/[a-z0-9-]+\?utm_source=email&amp;utm_medium=order|\/product\/[a-z0-9-]+\?utm_source=email&utm_medium=order/,
    );
    expect(text).toContain("Complete your routine:");
  });

  it("never suggests a sold-out product", () => {
    const first = renderOrderConfirmation(order).text;
    const pickedUrl = /\/product\/([a-z0-9-]+)\?utm/.exec(first)?.[1];
    expect(pickedUrl).toBeTruthy();
    const picked = SHOP_PRODUCTS.find((p) => productSlug(p) === pickedUrl)!;
    const again = renderOrderConfirmation({ ...order, soldOut: [picked.priceId] }).text;
    expect(again).not.toContain(`/product/${pickedUrl}?`);
  });
});
