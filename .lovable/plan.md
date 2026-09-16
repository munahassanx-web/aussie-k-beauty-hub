# Parcel verification records and order references

## Build

- Extend each recorded parcel item with size, supplier, Melbourne receipt date, check date, printed batch/lot code, optional printed expiry/manufactured date, packaging/seal status, and condition.
- Require fulfilment staff to record those fields before issuing the one-time QR card; preserve the existing opaque random token, one-way hash storage, card revocation, and version history.
- Upgrade the genuine verification page with overall record details, one clean product card per recorded item, the required qualification statement, and privacy-safe concern links that prefill the contact form without submitting.
- Upgrade the public sample with at least two clearly fictional, individually labelled example cards and retain the current “verified” explanation and sourcing link.
- Keep customer identity, address, payment details, internal order ID, and operational notes out of the public verification response.
- Update tracking to accept the existing `SG-XXXXXXXX` customer-facing order number, show a friendly example, keep email required, and return the same privacy-safe failure for invalid or unmatched combinations.
- Make checkout confirmation and order emails display the same customer-facing order number prominently instead of the internal UUID.

## Technical details

- Add nullable evidence columns to existing verification-item records and update the controlled staff issue function to snapshot only submitted values.
- Resolve readable order numbers server-side from their eight-character UUID prefix while requiring an exact email match; ambiguous prefixes return no result.
- Validate supplier values to UMMA or Seoul4PM and validate required evidence fields before card issuance.
- Add route search validation for contact prefill values; user action is still required to submit.

## Verification

- Check sample and genuine record rendering, concern-link prefill, absence of customer data, tracking failures, confirmation order number, and email order number.
- Test desktop and mobile layouts, then run focused tests and confirm the latest preview build is healthy.