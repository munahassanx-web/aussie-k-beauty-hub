# Repair Shop catalogue filtering

## Changes
- Make the Shop route’s validated URL search state the single source of truth for routine step, concern, ingredient, brand, price, and sort.
- Use the requested readable `step` query key and preserve filters through refresh and browser history.
- Pass explicit toggle/remove/clear handlers into the existing filter UI without redesigning it.
- Filter the original catalogue with OR-within-group and AND-across-group logic, then sort and render only those results.

## Verification
- Automate desktop acceptance checks for initial, toggle, combined, clear, refresh, brand, price, protect, and filtered sorting states.
- Confirm mobile staged Apply behavior and check the latest build diagnostics.
