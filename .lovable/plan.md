# Landing page + hero rebuild — options to choose from

## What I found (evidence, not opinion)

**Our hero right now** (screenshot audit at 1280px): slide 1 says "Skincare, curated differently. For your climate, your skin, your routine." That is a mood line, not a value proposition. There is no problem named, no skin type named, no quiz CTA — the quiz is buried behind a secondary "Find your routine" button on slide 1 and only surfaces properly on slide 3, ~14 seconds after landing. A visitor who leaves in 8 seconds learns nothing about authenticity, delivery speed, QR guides, ingredient decoding or Seoul trend access.

**Competitor scan (AU/UK/US K-beauty retail):**
- Nudie Glow (AU) — homepage is a banner grid of brand promos + "free shipping over $50". Quiz exists but is the 5th banner tile. No positioning statement anywhere above the fold.
- Skinsider (UK) — birthday sale GIF, free-gift tiers, brand logo wall. Purely discount-led.
- Soko Glam (US) — "End of Summer Sale: 20% Off Sitewide". Category leader, still leading with a discount.
- Style Story (AU) — homepage is a product feed with no narrative frame.

Every direct competitor is competing on **price and product supply**. None of them is competing on **diagnosis, guidance or trust**. That is the open lane, and it maps exactly to the seven brand pillars.

**CRO research (2026 sources):**
- Audit of 47 Shopify skincare stores: the top performers *"named a specific skin type or concern"* in the hero — "specificity repels the wrong buyer and magnetizes the right one." Stores with a skin-type qualifier or a 3-question quiz in the hero showed higher scroll depth and lower bounce.
- Same audit: 63% of stores failed because the **mobile** hero didn't communicate the value prop — image ate 80% of the screen. Our hero is currently `min-h-[86vh]` of photograph on mobile.
- Median Shopify beauty CVR is 3.2%; brands combining personalisation + ingredient transparency + proof reach 5–8%.
- Quiz playbook: show the **recommendation first, then** ask for email — hard-gating results before the answer grows the list but suppresses purchase intent. Routine-output quizzes (3–5 steps) beat single-product quizzes on AOV.

One fact to confirm before it goes on the page: **"next-day delivery if ordered before 12pm"** — I'll only publish that if it's true for a defined zone (e.g. VIC metro via Express Post). Tell me the exact wording you can stand behind and I'll use only that.

---

## Section 1 — The hero (pick one)

**Option A · "The Skin Consultation" (diagnosis-led)**
Kill the carousel. One still, cinematic portrait, right half. Left half: a live, inline **first quiz question rendered directly in the hero** — "What does your skin do by 3pm?" with four tappable chips (Tight · Shiny in the T-zone · Red and reactive · Fine and flat). Tapping a chip animates the panel and carries the answer into `/consultation`, so the quiz is already 1/8 complete. Headline above it: "Tell us what your skin is doing. We'll build the rest."
*Why:* the 47-store audit's single highest-signal finding was a skin qualifier in the hero. This makes the quiz the hero rather than a button, and starting a quiz in-place lifts completion because the first click costs nothing. Most differentiated vs every competitor found.

**Option B · "Seoul → Your Bathroom Shelf" (provenance-led, interactive 3D)**
Full-bleed dark stage with a **rotating 3D product** (WebGL, scroll-and-drag reactive) — a hero SKU floating over a subtle Seoul-to-Melbourne line, with sealed-carton, QR card and ingredient labels annotating onto the model as you scroll. Headline: "Checked, sealed and verified in Melbourne. Straight from Seoul." Single CTA to the quiz, secondary to the edit.
*Why:* delivers the "2026 / AI-era" interactive spectacle you asked for and dramatises authenticity — our only defensible product-side moat. Highest wow, highest build cost, needs one clean 3D asset per hero SKU.

**Option C · "Three Problems, Three Answers" (clarity-led)**
Static editorial split. Left: headline "Korean skincare, without the guessing." Under it, three short problem→solution rows with hairline rules: *Fakes on marketplaces → sealed, QR-verified, checked here* · *Too many products → an 8-question skin consult builds your routine* · *Shipped from overseas → stocked in Epping, dispatched same day*. Right: one portrait. One loud primary CTA: "Start your skin consult — free, 3 minutes".
*Why:* the fastest-to-comprehend option; the whole offer is legible in ~6 seconds with zero motion required, and it reads perfectly on mobile where 63% of competitors fail. Lowest risk, lowest spectacle.

---

## Section 2 — Making the quiz feel like a clinic, not a Shopify quiz (pick one)

**Option A · "The Consult Card"** — a full-width dark section styled like a clinic intake: numbered steps ("01 Your skin's behaviour · 02 Your climate · 03 Your history with actives"), a line on what you receive ("a 4-step routine in application order, AM and PM, with the reasoning for each step"), a "3 minutes · free · no obligation" meta row, and a sample result card peeking in from the right so people see the output before committing.
**Option B · "Show the output first"** — lead with an animated mock of the *finished* personalised routine (her name, her four products, AM/PM columns, QR guides), then a single CTA. Directly implements the research finding: show the recommendation, then ask for the email.
**Option C · "Advisor-led"** — position it as a human-reviewed consult: photo of the advisor, a real answered question, "every routine is reviewed before it's sent." Strongest trust play, but only if a person genuinely reviews them — otherwise it's off the table.

---

## Section 3 — The scroll story (pick one narrative spine)

**Option A · "The Seven Reasons, told as chapters"** — one full-viewport chapter per pillar, each with a sticky visual that animates as it scrolls (sealed carton opening, QR card scanning into a guide, ingredient molecule labels resolving, Seoul trend ticker). Emotional and unmissable; long page.
**Option B · "One woman's 28 days"** — the whole page follows a single customer: her problem → the consult → the parcel arriving → scanning the QR → week 4. Pillars are delivered *inside* the story rather than as a list. Most emotionally resonant, most copy/photography work.
**Option C · "The Skin Grocer Standard"** — a tight, high-density editorial index: a 7-item numbered standard grid near the top (each item expands in place on click), then proof, then shop. Least scrolling, most "premium retailer", best for returning buyers.

---

## Section 4 — The interactive / 3D layer (pick one, can combine with any hero)

**Option A · Scroll-driven 3D product stage** — a real WebGL model (Three.js) of one hero product, rotating with scroll, with hotspots for ingredients. Genuine 2026 wow factor; needs a modelled asset and careful mobile perf budgeting.
**Option B · Photographic pseudo-3D** — a 24–36 frame turntable render of real product shots played on scroll, plus parallax depth layers and cursor-reactive lighting. ~90% of the effect, a fraction of the weight, and it uses real packshots so nothing looks CGI-fake.
**Option C · Interactive ingredient map** — a canvas-based, cursor-reactive constellation of ingredients; hover a node and it explains what it does and which of our products contains it. Interactive and *useful*, ties to pillar 5, and it's the one competitors could not copy quickly.

---

## What I'd recommend (and why)

Hero **A** + quiz section **B** + narrative **A** + interactive **B**. Rationale: the strongest evidence in the research is about *specificity and diagnosis*, not spectacle, so the quiz should own the hero; showing the routine output before asking for email follows the documented purchase-intent finding; the chapter scroll delivers all seven pillars without a wall of text; and the photographic turntable gives the interactive feel using real packshots we already own, keeping mobile fast (where 63% of competitors lose the sale).

Tell me your picks per section (or "go with your recommendation") and any wording changes to the delivery claim, and I'll build it.
