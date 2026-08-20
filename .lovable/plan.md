# Skin Grocer — Auth & Admin Authorization Report (findings only, no changes made)

## 1. How users sign up / sign in
- Backend: Lovable Cloud (managed Postgres + Auth), one project.
- Single public auth page: `/auth` (`src/routes/auth.tsx`), modes: sign in, sign up, forgot password, password reset (recovery link returns to `/auth`).
- Providers in use: **Google OAuth** (via the managed Lovable auth broker) and **email + password**. Email confirmation is on for password signups (no auto-confirm).
- Client session handling: `src/hooks/use-auth.tsx` (`onAuthStateChange` + `getSession`). On sign-in it calls the `claim_guest_orders` function so guest orders with a matching email get linked.
- Existing accounts today: 4 users — 2 Google sign-ins (one is the owner account, already `admin`) and 2 email accounts that have never signed in.

## 2. How admin routes decide who is staff
Two-layer model; the real enforcement is server-side.

- Pages (`/admin/*`) only check "is someone signed in" in the browser and then call server functions. They render an error/empty state if the call is rejected — the page shell itself is not a security boundary.
- Every admin server function runs through `requireSupabaseAuth`, which validates the bearer token server-side and rebuilds a database client acting **as that user** (row-level security applies).
- On top of that, each admin function calls a database check before doing work:
  - `is_fulfillment_staff(uid)` → true for role `admin` or `moderator` — used by orders (`src/lib/admin-orders.functions.ts`), inventory, authenticity cards.
  - `has_role(uid,'admin')` → admin only — used by reviews moderation and the Seoul Signal desk.
- Database RLS policies repeat the same rule independently: `orders` staff read/update, `inventory` read, `authenticity_cards` read all require `is_fulfillment_staff(auth.uid())`; customers can only read `orders` where `user_id = auth.uid()`. Sensitive write operations (issue/revoke authenticity card, stock adjustments) are security-definer database functions that re-check staff status internally and raise `Unauthorized` otherwise.

## 3. Where roles live / how the first owner is granted access
- Roles are in a dedicated table `public.user_roles (user_id, role)` with enum `app_role = admin | moderator | user`. Roles are **not** stored on `profiles` and not in client storage — correct design.
- There is no email allowlist anywhere; membership in `user_roles` is the only source of truth.
- Grant policies: only an existing `admin` can insert/update/delete rows in `user_roles`. Bootstrapping the very first admin therefore has to be done from the backend (privileged) side, not from the app UI.
- Current state: the owner's Google account (`munahassanx@gmail.com`) already holds `admin`. No other account has any role.

## 4. Can a customer reach admin data by manipulating the client?
No — based on the code and policies as they stand:
- Editing local state or calling the admin server functions directly still hits `requireSupabaseAuth` (server-verified token) plus the `has_role` / `is_fulfillment_staff` check.
- Even if a check were bypassed, RLS on `orders`, `inventory`, `authenticity_cards` and `user_roles` blocks the read as the non-staff user.
- A customer cannot self-promote: inserting into `user_roles` requires already being admin.
Residual (cosmetic, not data) exposure: `/admin/*` URLs are reachable and render an admin-looking shell before the server rejects the data call; they are `noindex, nofollow`.

## 5. Safest procedure to create the owner login and promote it (no password sharing)
1. Owner opens the site `/auth` and signs in themselves — recommended **Continue with Google** with the owner's own Google account (no password ever created or shared) — or email + password they set themselves and never disclose.
2. Confirm the account exists: it appears under the backend Auth users list after first sign-in.
3. Promote by adding one row to `public.user_roles` for that user id with role `admin`, done from the backend (privileged) side — never through a public app form.
4. Owner signs out and back in, then loads `/admin/orders`; the queue loading is the proof the role is live.
5. Never share the password/session; a second staff member always gets their own account.
(The current owner account already has step 3 done.)

## 6. Adding / removing future staff
- Add: the person self-registers at `/auth` (Google preferred), then an existing admin adds their `user_roles` row — `moderator` for warehouse/fulfilment-only access (orders, inventory, authenticity), `admin` for full access incl. reviews and the Seoul Signal desk.
- Remove: delete that person's `user_roles` row. Access to orders/inventory/cards stops immediately on their next request; sign them out / disable or delete the auth user if they are leaving entirely.
- There is currently **no in-app screen** to manage staff roles — all grants/revokes happen via the backend. That is safe but manual.

## 7. MFA
- The underlying auth service supports TOTP multi-factor, but this app has **no MFA enrolment or challenge UI**, and no policy requiring it — so MFA is effectively not available to staff today.
- Practical recommendation now: have all staff sign in with **Google** and enforce 2-Step Verification on those Google accounts — that gives MFA in front of the admin surface without app changes. Building in-app TOTP for staff would be a separate piece of work.

## 8. Gaps worth fixing before/around onboarding staff (nothing blocking)
1. No MFA in-app — mitigate via Google 2SV as above.
2. Two never-used email accounts (`hahaha@`, `hana@`) exist from testing; they hold no roles but should be cleaned up before launch.
3. No staff-management UI and no audit log of role grants/revokes — role changes are invisible after the fact.
4. `/admin/*` pages render their shell to any signed-in user before the server rejects data; a shared "not authorised" screen driven by a role check would be cleaner (presentation only, no security change).
5. Password sign-up remains open to the public — fine for customers, but staff should be told to use Google only.

## Admin URLs and consoles the owner needs
- `/admin/orders` — order queue (fulfilment home)
- `/admin/orders/{id}` — order detail, packing slip, authenticity card, dispatch
- `/admin/inventory` — stock counts and movements
- `/admin/reviews` — review moderation (admin role)
- `/admin/signals`, `/admin/issues/{id}` — Seoul Signal drafts/issues (admin role)
- `/admin/guide-links` — product guide link checker
- Backend console: the Lovable Cloud backend view in this project (Auth users list and the `user_roles` table) — that is where the first/next admin rows are added.

No credentials, emails or roles were invented; no code, data or configuration was changed.
