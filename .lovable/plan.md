# Order Queue audit — why test and real orders sit side by side

Findings only. No code or data changed.

## Headline

There is **no payment-integrity bug**: nothing writes an order except the Stripe webhook, and `status` is set from Stripe's own `payment_status`. The real problem is **environment leakage** — the admin queue does not filter by `environment`, so three **sandbox (test-card) orders** appear next to one **live order**, and they are counted in the queue counts and in "Paid orders / Revenue (7 days)".

## What is actually in the database

Four orders total:

| Placed | Env | Status | Stage | Amount | Type |
|---|---|---|---|---|---|
| 16 Aug | **live** | paid | processing | A$33.95 | guest, `cs_live_…` + `pi_…` |
| 14 Aug ×3 | **sandbox** | paid | processing | A$124.00 each | signed-in test, `cs_test_…` |

The "fake" orders are not unpaid records — they are Stripe **test-mode** sessions that genuinely completed with a test card, so the webhook correctly stored them as `paid`. They are indistinguishable in the UI because the queue never shows or filters `environment`.

## Answers

1. **Why can it appear at all?** It isn't an unpaid order. Orders are only ever inserted by `src/routes/api/public/payments/webhook.ts` (service-role, signature-verified). There is no client-side or simulated insert path; RLS denies INSERT on `orders`. These three rows came from real sandbox checkout sessions during testing.
2. **Does the queue list all orders regardless of payment status?** Yes — `listAdminOrders` selects from `orders` filtered only by fulfilment stage. Unpaid rows would land in `fulfillment_status = 'awaiting_payment'`, which is not one of the stage tabs, so they'd only show under "All". Sandbox rows are `processing`, so they sit in the default "To pack" tab.
3. **Metrics.** `Paid orders (7 days)` and `Revenue (7 days)` do filter on `status = 'paid'` — but not on `environment`, so sandbox money is counted as revenue. `To pack` / `Packed` counts filter on **nothing at all**: any stage bucket, paid or not, sandbox or live.
4. **Is the real guest order genuinely paid?** Yes. It carries a live session id and a live payment intent id, and `status = 'paid'` was written by the webhook from `session.payment_status`, after HMAC signature verification. The browser return page (`/checkout/return`) only *reads* the row; it never marks anything paid.
5. **Is the test order wrongly marked paid?** It is marked paid *correctly for sandbox* — a test card did settle. It is wrong only in that it is presented as live business.
6. **Recommended change** (for a later build pass):
   - Add an `environment` filter to `listAdminOrders` and its counts/totals so the queue only shows the environment the deployment is running in (live in production), with an explicit staff-visible "Sandbox" toggle/badge rather than silent mixing.
   - Exclude non-paid statuses from the fulfilment stages: only `status in ('paid','partially_refunded')` should reach "To pack"; `pending` / `failed` stay in a separate "Awaiting payment" tab for diagnostics, never in the packable queue.
   - Add a dispatch guard: block stage advance past `processing` when `status <> 'paid'` or `environment <> 'live'`.
   - Show env + payment status on both the row and the order detail header so staff can never mistake one for the other.
   - Nothing needs deleting — the sandbox rows stay as diagnostics once filtered out.
7. **Side-effect risk for the test orders.** Verified in the database: `inventory_movements`, `order_notifications`, `points_ledger` (order-linked) and `authenticity_cards` are **all empty** — so no stock was decremented, no customer email was recorded as sent, no loyalty points were credited against an order, and no QR authenticity card was issued for any order. Only the standalone signup bonus points exist.

   Two things worth noting from that same check:
   - `points_earned = 124` is stored on the sandbox order rows but there is no matching ledger entry, so the displayed figure and the actual balance can disagree.
   - The **live** order has no `order_notifications` row either — meaning the order-confirmation dispatch never recorded an attempt for the genuine customer. Worth confirming separately whether that customer received a confirmation.

## Technical references

- `src/routes/api/public/payments/webhook.ts` — sole order writer; `status: paid ? 'paid' : 'pending'`, `fulfillment_status: paid ? 'processing' : 'awaiting_payment'`; stock, points and confirmation email are all gated on `paid`.
- `src/lib/admin-orders.functions.ts` — `listAdminOrders` (no `status`/`environment` filter on the list or the counts; `status = 'paid'` only on the 7-day totals).
- `src/lib/commerce.functions.ts` — checkout session creation and read-only receipt/tracking lookups; no order writes.

Approve if you'd like me to implement the item-6 changes.
