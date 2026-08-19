# QR Authenticity & Provenance Card — Backend Plan

Backend design for a per-order QR card that resolves to a public "Verified by Skin Grocer" page. No production data, payment, webhook, email, or order-creation behaviour changes.

## What the project already has (verified)

- `orders` table: fulfilment lifecycle (`fulfillment_status`, `packed_at`, `shipped_at`, `dispatched_at`, `delivered_at`, `tracking_number`, `shipping_carrier`, `label_status`), plus `line_items` as **JSONB** — there is no separate `order_items` table.
- `inventory` (keyed by `sku`) and `inventory_movements` (deltas, reasons `purchase_received` / `sale` / `manual_adjustment` etc., idempotent via `reference`). **No batch/lot fields, no supplier or receipt table.**
- Products: `products` (text id), `routine_bundles`, catalog in `src/lib/shop-catalog.ts`. SKUs live in inventory keyed by text SKU.
- Operations: `/admin/orders` list + `/admin/orders/$id` detail with a print packing slip (`src/components/admin/packing-slip.tsx`) using browser print — no PDF library.
- Access control: `is_fulfillment_staff(uid)` (admin/moderator) and `has_role`; server functions in `src/lib/admin-orders.functions.ts` with `requireSupabaseAuth`.
- Public HTTP surface exists under `src/routes/api/public/*`; public pages are plain top-level routes.

### Gaps
1. No batch/lot capture anywhere (blocks batch-level claims today).
2. No supplier / purchase-receipt table (blocks sourcing evidence today).
3. Line items are denormalised JSON, so provenance must snapshot from JSON at card-issue time.
4. No QR generation dependency and no PDF utility (browser print is the current mechanism).

**Claims consequence (ACCC):** with today's data we can honestly state only order-level statements — Skin Grocer received, inspected and dispatched these goods from its Melbourne facility, with named brands/products. Batch-verified or country-of-origin claims must stay hidden until Phase 2 records real evidence. The page renders only what evidence rows exist; nothing is hard-coded.

## Proposed schema (Phase 1)

`public.authenticity_cards`
- `id uuid pk`, `order_id uuid references orders(id)`, `token_hash text unique not null` (SHA-256 of the token; raw token never stored), `token_prefix text` (first 6 chars, for Ops lookup), `card_ref text unique` (human ID, e.g. `SG-7F2K-9QD4`), `status text` (`active` | `revoked` | `superseded`), `version int` (reissue counter per order), `issued_by uuid`, `issued_at timestamptz`, `revoked_at`, `revoked_reason text`, `verified_at timestamptz` (when Ops completed checklist), `checklist jsonb` (evidence booleans + who/when), `snapshot jsonb` (safe product/brand list captured at issue), `first_scanned_at`, `last_scanned_at`, `scan_count int default 0`.
- Indexes: unique on `token_hash`, unique on `card_ref`, index on `order_id`, partial unique on `(order_id)` where `status='active'`.

`public.authenticity_card_items` — one row per line: `card_id`, `sku`, `product_name`, `brand`, `quantity`, `batch_code text null`, `origin_country text null`, `source_receipt_id uuid null`. Nullable evidence fields render only when populated.

`public.authenticity_events` — audit log: `card_id`, `event` (`issued`/`reissued`/`revoked`/`verified`/`scanned`), `actor uuid null`, `metadata jsonb`, `created_at`. Scans store no IP, no user agent, no fingerprint — only a timestamp and coarse counter.

Phase 2 adds `public.source_receipts` (supplier name, receipt date, document reference, country of origin, SKU, batch code, quantity) and `product_batches`, both linked from `authenticity_card_items`.

### Access rules
- RLS on all tables; `GRANT` blocks per table in the same migration.
- No `anon` SELECT on any card table. The public page reads through an **unauthenticated server function** that hashes the submitted token, looks it up with the service-role client inside the handler, and returns a hand-built safe DTO. Raw rows never leave the server.
- Staff (`is_fulfillment_staff`) get SELECT via policy; all writes go through `SECURITY DEFINER` RPCs (`issue_authenticity_card`, `revoke_authenticity_card`, `record_card_verification`) that check the role, exactly like the existing inventory RPCs.

### Token model
- 32 random bytes → base32, ~26 chars, generated server-side (`crypto.getRandomValues`). Returned **once** at issue time for printing; only the hash is persisted.
- Reissue: mark current card `superseded`, insert a new row with `version + 1`. Revoke sets `revoked` + reason; the public page then shows a neutral "this card is no longer valid — contact customer care" state, never order data.
- Lookup is constant-work: hash then unique-index probe; unknown tokens return the same generic not-found shape.

## Routes / API

- Public page `src/routes/verify.$token.tsx` — SSR, calls a public server fn `getVerificationRecord({ token })`, own `head()` metadata, `noindex`.
- Server fns in `src/lib/authenticity.functions.ts`: `getVerificationRecord` (public), plus `issueCard`, `reissueCard`, `revokeCard`, `getCardForOrder` (all `requireSupabaseAuth` + staff check).
- Scan recording happens inside the public fn via the RPC (timestamp + counter only).

## Ops workflow

On `/admin/orders/$id`, a new "Authenticity card" panel: shows current card ref/status/version, an **Issue card** action at packing stage, a **Reissue** action (reason required), **Revoke**, and a print-ready card view reusing the existing browser-print pattern (`print:` classes) rather than adding a PDF stack. QR rendering via a small client-side QR library added at implementation time.

## Public page content (evidence-derived only)

Verification status, card ref, verified date, dispatch date if present, brands/products, checklist items that were actually ticked, plus batch/origin/supplier-category rows **only where a value exists**. Never: customer name, email, address, order id, tracking, prices, costs, supplier invoices, ops notes.

## Recommendation

Build Phase 1 now as described, but only after approval — it needs one migration, so it cannot be truly "preview-only" against the shared database. Nothing in Phase 1 touches checkout, Stripe, webhooks, emails, or existing order/fulfilment logic; it is additive tables plus a new admin panel and a new public route. Phase 2 (batches + supplier receipts) then unlocks the stronger provenance claims, and Phase 3 adds batch label printing and duplicate-scan alerting.
