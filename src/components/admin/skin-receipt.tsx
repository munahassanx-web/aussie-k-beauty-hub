import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { AdminOrderDetail } from "@/lib/admin-orders.functions";
import { orderReference } from "@/lib/order-reference";
import { SHOP_PRODUCTS, ingredientReviewed } from "@/lib/shop-catalog";
import type { ShopProduct } from "@/lib/shop-catalog";
import { ROUTINE_STEP_NAME, ROUTINE_STEP_NUMBER, heroIngredients } from "@/lib/product-detail";
import { aisleFor } from "@/lib/aisles";

const SITE_ORIGIN = "https://skingrocer.com.au";
const ROUTINES_URL = `${SITE_ORIGIN}/routines`;

function money(cents: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency }).format((cents ?? 0) / 100);
}

export type ReceiptLine = {
  name: string;
  brand: string | null;
  quantity: number;
  amountCents: number;
  step: string | null;
  stepNumber: number | null;
  aisle: { number: string; name: string; bg: string } | null;
  ingredient: string | null;
  gift: boolean;
};

/**
 * One receipt row per order line, in routine order (cleanse to protect, then
 * weekly masks, then anything not in the catalogue, then gifts). A key
 * ingredient is printed only for products with a reviewed INCI record.
 */
export function receiptLines(order: Pick<AdminOrderDetail, "lines">): ReceiptLine[] {
  const rows = order.lines.map((l) => {
    const p: ShopProduct | undefined = l.lookupKey
      ? SHOP_PRODUCTS.find((c) => c.priceId === l.lookupKey)
      : undefined;
    const gift = !p && l.amountCents === 0;
    const ing = p && ingredientReviewed(p) ? heroIngredients(p)[0] : undefined;
    const aisle = p ? aisleFor(p.concerns) : null;
    return {
      name: p?.name ?? (gift ? l.name.replace(/^free gift:\s*/i, "") : l.name),
      brand: p?.brand ?? null,
      quantity: l.quantity,
      amountCents: l.amountCents,
      step: p
        ? (ROUTINE_STEP_NAME[p.category] ?? (p.category === "Masks" ? "Weekly mask" : null))
        : null,
      stepNumber: p ? (ROUTINE_STEP_NUMBER[p.category] ?? null) : null,
      aisle: aisle ? { number: aisle.number, name: aisle.name, bg: aisle.bg } : null,
      ingredient: ing ? (ing.korean ? `${ing.name} · ${ing.korean}` : ing.name) : null,
      gift,
    } satisfies ReceiptLine;
  });
  const rank = (r: ReceiptLine) => (r.gift ? 99 : (r.stepNumber ?? (r.step ? 50 : 90)));
  return rows
    .map((r, i) => ({ r, i }))
    .sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i)
    .map(({ r }) => r);
}

/**
 * The customer-facing "skin receipt": a DL-sized (99 × 210mm) insert styled
 * like a grocer's receipt, listing the order in routine order. Prints as the
 * second page of the packing-slip print, with cut marks around it.
 */
export function SkinReceipt({ order }: { order: AdminOrderDetail }) {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void QRCode.toDataURL(ROUTINES_URL, {
      errorCorrectionLevel: "M",
      margin: 2,
      scale: 10,
      color: { dark: "#2E1E19", light: "#FFFFFF" },
    }).then((url) => {
      if (!cancelled) setQr(url);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const lines = receiptLines(order);
  const itemsCents = order.lines.reduce((sum, l) => sum + l.amountCents, 0);
  const firstName = (order.shippingName ?? order.customerName ?? "").trim().split(/\s+/)[0] ?? "";

  return (
    <div className="skin-receipt">
      <div className="skin-receipt__card">
        <div aria-hidden className="skin-receipt__awning" />

        <div className="skin-receipt__body">
          <p className="skin-receipt__mark">SKIN GROCER</p>
          <p className="skin-receipt__sub">Korean skincare · Melbourne, Australia</p>

          <div className="skin-receipt__rule" />
          <p className="skin-receipt__title">your skin receipt</p>
          <div className="skin-receipt__meta">
            <span>Order {orderReference(order.id)}</span>
            <span>{new Date(order.createdAt).toLocaleDateString("en-AU")}</span>
          </div>
          {firstName && (
            <p className="skin-receipt__hello">
              for {firstName.toLowerCase()}, in the order you use them
            </p>
          )}
          <div className="skin-receipt__rule skin-receipt__rule--dash" />

          <ol className="skin-receipt__lines">
            {lines.map((l, i) => (
              <li key={`${l.name}-${i}`} className="skin-receipt__line">
                <div className="skin-receipt__row">
                  <span className="skin-receipt__step">
                    {l.gift
                      ? "gift"
                      : l.stepNumber
                        ? `step ${l.stepNumber}`
                        : (l.step?.toLowerCase() ?? "item")}
                  </span>
                  {l.aisle && (
                    <span className={`skin-receipt__aisle ${l.aisle.bg}`}>
                      {l.aisle.number} {l.aisle.name}
                    </span>
                  )}
                </div>
                <div className="skin-receipt__row skin-receipt__row--item">
                  <span className="skin-receipt__name">
                    {l.brand && <b>{l.brand} </b>}
                    {l.name}
                    {l.quantity > 1 && <span className="skin-receipt__qty"> ×{l.quantity}</span>}
                  </span>
                  <span className="skin-receipt__dots" />
                  <span className="skin-receipt__price">
                    {l.amountCents === 0 ? "free" : money(l.amountCents, order.currency)}
                  </span>
                </div>
                {(l.step || l.ingredient) && (
                  <p className="skin-receipt__note">
                    {l.step && !l.gift ? l.step.toLowerCase() : ""}
                    {l.step && l.ingredient ? " · " : ""}
                    {l.ingredient ? `key: ${l.ingredient}` : ""}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="skin-receipt__rule skin-receipt__rule--dash" />
          <div className="skin-receipt__totals">
            <p>
              <span>items</span>
              <span>{money(itemsCents, order.currency)}</span>
            </p>
            <p>
              <span>delivery</span>
              <span>
                {order.shippingCents === 0 ? "free" : money(order.shippingCents, order.currency)}
              </span>
            </p>
            {order.discountCents > 0 && (
              <p>
                <span>discount</span>
                <span>−{money(order.discountCents, order.currency)}</span>
              </p>
            )}
            <p className="skin-receipt__total">
              <span>total paid</span>
              <span>{money(order.amountCents, order.currency)}</span>
            </p>
          </div>
          <div className="skin-receipt__rule skin-receipt__rule--dash" />

          <div className="skin-receipt__foot">
            {qr ? (
              <img src={qr} alt="" className="skin-receipt__qr" />
            ) : (
              <div className="skin-receipt__qr" />
            )}
            <div>
              <p className="skin-receipt__foot-title">how to layer it</p>
              <p>Scan for routines and directions. Patch-test new products first.</p>
              <p className="skin-receipt__url">skingrocer.com.au/routines</p>
            </div>
          </div>

          <p className="skin-receipt__thanks">thank you for shopping the glass skin club</p>
          <p className="skin-receipt__care">customercare@skingrocer.com.au</p>
        </div>

        <div aria-hidden className="skin-receipt__awning skin-receipt__awning--foot" />
      </div>
    </div>
  );
}
