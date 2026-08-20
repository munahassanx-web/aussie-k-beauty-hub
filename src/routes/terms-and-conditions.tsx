import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Skin Grocer" },
      { name: "description", content: "The terms that apply when you browse or order from Skin Grocer: orders, pricing and GST, payment, delivery, returns, and your rights under Australian Consumer Law." },
      { property: "og:title", content: "Terms & Conditions — Skin Grocer" },
      { property: "og:description", content: "The terms that apply when you browse or order from Skin Grocer, including your rights under Australian Consumer Law." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://skingrocer.com.au/terms-and-conditions" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/terms-and-conditions" }],
  }),
  component: TermsAndConditions,
});

function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-primary">Legal</p>
      <h1 className="mt-4 text-center text-5xl text-foreground md:text-7xl">Terms &amp; Conditions</h1>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        These terms apply when you browse skingrocer.com.au or place an order with us.
      </p>

      <div className="mt-16 space-y-12">
        <section>
          <h2 className="font-display text-2xl text-foreground">1. Scope and acceptance</h2>
          <p className="mt-3 text-muted-foreground">
            By using this website or placing an order, you accept these terms. If you don't agree with them, please don't
            use the site. We may update these terms from time to time; the version published when you place your order is
            the version that applies to that order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">2. Eligibility and your account</h2>
          <p className="mt-3 text-muted-foreground">
            You need to be able to enter a legally binding contract to order from us. If you create an account, keep your
            login details secure and let us know if you think someone else has used them. You're responsible for the
            accuracy of the details you give us, including your delivery address.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">3. Products and availability</h2>
          <p className="mt-3 text-muted-foreground">
            We describe our products as accurately as we can, using information from the brand and the packaging.
            Ingredient lists, formulations and packaging can change without notice — always read the packaging supplied
            with your product before use. Product photography is indicative.
          </p>
          <p className="mt-3 text-muted-foreground">
            Nothing on this site is medical advice. Skincare products are cosmetics, not treatments for medical
            conditions. If you have a skin condition, are pregnant, or are unsure whether a product suits you, speak with
            a qualified health professional.
          </p>
          <p className="mt-3 text-muted-foreground">
            Availability is not guaranteed. Stock shown on the site can change between the moment you add something to
            your bag and the moment your order is accepted.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">4. Pricing, GST and obvious errors</h2>
          <p className="mt-3 text-muted-foreground">
            All prices are in Australian dollars and include GST. Shipping is shown separately at checkout. Prices and
            promotions can change at any time, but a change won't affect an order we've already accepted.
          </p>
          <p className="mt-3 text-muted-foreground">
            Occasionally a price or description may be obviously wrong — for example, a decimal place in the wrong spot.
            Where a pricing or description error is clear and you could reasonably have recognised it as an error, we may
            cancel the affected order and refund you in full rather than fulfil it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">5. Placing an order and when it is accepted</h2>
          <p className="mt-3 text-muted-foreground">
            Submitting an order is an offer to buy. Our order confirmation email acknowledges that we've received your
            order — it isn't yet acceptance. Your order is accepted, and a contract formed, when we dispatch it (or when
            we tell you in writing that we accept it).
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">6. Payment</h2>
          <p className="mt-3 text-muted-foreground">
            Payment is processed by our configured payment provider. We don't store your full card details. Your order is
            only processed once payment is authorised. If a payment is reversed or fails after dispatch, we may seek to
            recover the amount owing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">7. Declining or cancelling an order</h2>
          <p className="mt-3 text-muted-foreground">
            We may decline or cancel an order — before or after payment — if the item is out of stock, the price or
            description was obviously wrong, we can't verify the payment or delivery details, we can't deliver to the
            address given, or we reasonably suspect fraud or resale-scale ordering. If we cancel, we refund the amount you
            paid for the cancelled items to your original payment method.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">8. Delivery</h2>
          <p className="mt-3 text-muted-foreground">
            Orders are dispatched from our Melbourne warehouse with Australia Post. Delivery timeframes shown anywhere on
            this site are estimates based on the carrier's published service for your postcode — they are not guarantees,
            and the service available varies by destination. Our{" "}
            <Link to="/shipping-policy" className="text-primary underline underline-offset-4 hover:no-underline">
              Shipping Policy
            </Link>{" "}
            forms part of these terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">9. Returns and refunds</h2>
          <p className="mt-3 text-muted-foreground">
            Our{" "}
            <Link to="/returns-policy" className="text-primary underline underline-offset-4 hover:no-underline">
              Returns &amp; Refund Policy
            </Link>{" "}
            forms part of these terms and sets out how to return an item. It is offered in addition to — never instead of
            — your rights under Australian Consumer Law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">10. Subscriptions and Circle membership</h2>
          <p className="mt-3 text-muted-foreground">
            Restock subscriptions and Circle membership renew automatically at the interval shown when you sign up, at the
            price shown at that time, until you cancel. You can cancel at any time from your account; cancellation takes
            effect at the end of the current paid period, and you keep the benefits until then. Points, rewards and member
            benefits have no cash value and can't be sold or transferred.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">11. Authenticity cards</h2>
          <p className="mt-3 text-muted-foreground">
            Some orders include a Skin Grocer authenticity card with a unique QR code. Scanning it shows Skin Grocer's own
            verification record for that order — confirming the order was packed and checked by us before dispatch. It is
            our internal record only. It is not a manufacturer's certificate, a brand endorsement, or any form of
            government or regulatory certification, and it doesn't verify anything about a product bought elsewhere.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">12. Your use of this site</h2>
          <p className="mt-3 text-muted-foreground">
            Please don't interfere with the site, scrape it at scale, misuse accounts or promotions, or submit reviews or
            content that is false, unlawful or someone else's. Content on this site — text, photography, and the Skin
            Grocer name and marks — belongs to us or our licensors and may not be reproduced commercially without our
            permission. Brand names and product imagery belong to their respective owners.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">13. Australian Consumer Law</h2>
          <p className="mt-3 text-muted-foreground">
            Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to
            a replacement or refund for a major failure and to compensation for any other reasonably foreseeable loss or
            damage. You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable
            quality and the failure does not amount to a major failure.
          </p>
          <p className="mt-3 text-muted-foreground">
            Nothing in these terms excludes, restricts or modifies any consumer guarantee, right or remedy you have under
            the Australian Consumer Law. Where we are permitted to limit our liability, and to the extent the law allows,
            our liability is limited to replacing the goods or refunding what you paid for them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">14. Privacy</h2>
          <p className="mt-3 text-muted-foreground">
            How we handle your personal information is set out in our{" "}
            <Link to="/privacy-policy" className="text-primary underline underline-offset-4 hover:no-underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">15. Governing law</h2>
          <p className="mt-3 text-muted-foreground">
            These terms are governed by the laws of Victoria, Australia, and you and we submit to the non-exclusive
            jurisdiction of the courts of that state.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">16. Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Questions about these terms or an order? Email{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>{" "}
            with your order number and we'll help.
          </p>
        </section>
      </div>
    </div>
  );
}
