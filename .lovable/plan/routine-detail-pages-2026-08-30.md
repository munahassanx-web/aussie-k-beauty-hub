# Routine detail pages

## Build
- Remove the routine-review modal and its state/event path from the homepage cards.
- Convert each “Review this routine” control to a real TanStack `Link` targeting its named `/routines/...` page.
- Move the three routine definitions into shared data so homepage cards and detail pages use the same live catalogue identifiers.
- Create one reusable routine-detail page component with selected-by-default core products, optional products off by default, live totals, AM/PM order, suitability, product roles/images/prices, shared-bag addition, homepage return, and personalised-routine link.
- Keep Barrier-Comfort limited to its three-product core with no optional active.

## Routes
- `/routines/essential-hydration`
- `/routines/tone-glow-support`
- `/routines/barrier-comfort`

Each route will include unique page metadata and render the shared template with its matching routine.

## Verification
- Build successfully and confirm every route responds.
- In the actual preview, click each homepage link and verify the correct routine page heading and URL.
- Add selected products from one routine and verify the shared header bag count changes immediately.
