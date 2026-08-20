import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Skin Grocer" },
      { name: "description", content: "How Skin Grocer collects, uses and protects your personal information. Your privacy rights and how to contact us." },
      { property: "og:title", content: "Privacy Policy — Skin Grocer" },
      { property: "og:description", content: "How Skin Grocer collects, uses and protects your personal information." },
      { property: "og:url", content: "https://skingrocer.com.au/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/privacy-policy" }],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-primary">Your data</p>
      <h1 className="mt-4 text-center text-5xl text-foreground md:text-7xl">Privacy Policy</h1>

      <div className="mt-16 space-y-12">
        <section>
          <p className="text-muted-foreground">
            Skin Grocer Pty Ltd ("Skin Grocer", "we", "us") respects your privacy. This policy explains what personal information we collect through skingrocer.com.au, how we use it, and your rights.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: 16 August 2026</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">What we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Contact and account details you give us (name, email, delivery address, phone number, password if you create an account).</li>
            <li>Order information (what you bought, order history, Restock Club loyalty points balance).</li>
            <li>Messages you send us through the contact form (name, email, topic and your message).</li>
            <li>Your email address if you subscribe to our newsletter, along with where on the site you subscribed.</li>
            <li>Skin quiz responses, if completed, used to personalise recommendations.</li>
            <li>Payment information processed directly by Stripe, our payment provider — we don't see or store your full card details.</li>
            <li>Technical information (IP address, browser/device type, pages viewed) collected automatically to keep the site working and secure.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">How we use it</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>To process and deliver orders, including sharing your name and address with our shipping carrier.</li>
            <li>To provide customer service.</li>
            <li>To personalise product and routine recommendations.</li>
            <li>To send order/account updates.</li>
            <li>To send marketing emails about new arrivals, restocks and offers, only if opted in, unsubscribe anytime.</li>
            <li>To keep the site secure and prevent fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Who we share it with</h2>
          <p className="mt-3 text-muted-foreground">
            Stripe (payment processing), our hosting and database provider, our email delivery provider (used to send order, account and newsletter emails), and our shipping carriers — solely to run the site and deliver your orders. We do not sell personal information to third parties. Some providers may store or process data outside Australia; we take reasonable steps to ensure it's handled consistently with the Australian Privacy Principles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Authenticity card verification</h2>
          <p className="mt-3 text-muted-foreground">
            Scanning the QR code on the authenticity card included with your order opens a verification page for that order. We record that the card was scanned and when it was last scanned, so we can spot duplicated or misused cards. The page does not show your name, address, payment or tracking details, and you don't need to sign in to view it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Marketing emails</h2>
          <p className="mt-3 text-muted-foreground">
            If you join our newsletter we'll email you about new arrivals, restocks and offers. You can unsubscribe at any time using the link in any marketing email, or by emailing{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>. Order and account emails aren't marketing and are sent as part of servicing your order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Cookies</h2>
          <p className="mt-3 text-muted-foreground">
            We use essential cookies to run the cart and checkout, and may use analytics cookies to understand site usage. You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Your rights</h2>
          <p className="mt-3 text-muted-foreground">
            You can ask to access, correct, or delete the personal information we hold about you anytime by emailing{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Complaints</h2>
          <p className="mt-3 text-muted-foreground">
            Contact us first at{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>. If unsatisfied, you can lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at{" "}
            <a href="https://oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:no-underline">
              oaic.gov.au
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Changes to this policy</h2>
          <p className="mt-3 text-muted-foreground">
            We may update this policy from time to time; the "last updated" date will reflect the most recent change.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Contact us</h2>
          <p className="mt-3 text-muted-foreground">
            Skin Grocer Pty Ltd —{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
