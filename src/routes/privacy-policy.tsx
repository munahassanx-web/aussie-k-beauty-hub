import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Skin Grocer" },
      { name: "description", content: "How Skin Grocer collects, uses and protects your personal information. Your privacy rights and how to contact us." },
      { property: "og:title", content: "Privacy Policy — Skin Grocer" },
      { property: "og:description", content: "How Skin Grocer collects, uses and protects your personal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
          <p className="mt-4 text-sm text-muted-foreground">Last updated: 22 September 2026</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">What we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Contact information you provide, including your name, email address and phone number.</li>
            <li>Account details such as your name and email address. Authentication credentials are handled by our authentication provider. Skin Grocer does not have access to or store your password in readable form.</li>
            <li>Delivery details, and the limited billing and payment records returned to us by our payment processor. We do not receive or store your full card number.</li>
            <li>Order, fulfilment, cancellation and refund history, including products ordered and transaction references.</li>
            <li>Customer-service correspondence, including the name, email address, topic and message submitted through our contact form.</li>
            <li>Newsletter information, including your email address, where you subscribed and the date the record was created. Our email service may also keep unsubscribe or suppression information needed to honour your choice.</li>
            <li>Routine Finder answers and saved recommendations when you choose the optional email-save feature, as explained below.</li>
            <li>Products saved to the wishlist while you are signed in.</li>
            <li>Review content and related purchase-verification and moderation information when you submit a product review.</li>
            <li>Authenticity-card scan counts and timestamps, as explained below.</li>
            <li>Security and fraud-prevention information generated through checkout, payment processing and the operation of our website.</li>
            <li>On the live website, page and shopping activity sent to Google Analytics, together with technical information such as browser and device type. Website and service providers also receive connection information, including IP address, when your browser connects to them.</li>
            <li>Cookie and browser-storage data used for authentication, your bag, checkout, Routine Finder drafts, saved display preferences and analytics controls.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">How we use it</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>To process and deliver orders, including sharing your name and address with our shipping carrier.</li>
            <li>To provide customer service.</li>
            <li>To personalise product and routine recommendations.</li>
            <li>To manage wishlists, verified-purchase reviews and authenticity records.</li>
            <li>To send order, delivery and account updates.</li>
            <li>To send marketing emails only where you have actively opted in.</li>
            <li>To understand how the live website and catalogue are used.</li>
            <li>To keep the site and payments secure, prevent fraud, comply with legal obligations and resolve disputes.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Routine Finder and skin information</h2>
          <div className="mt-3 space-y-3 text-muted-foreground">
            <p>Routine Finder answers are used to provide general cosmetic product guidance. They are not used to diagnose or treat a medical condition.</p>
            <p>Your in-progress answers are stored in your browser so you can continue the finder. They are not linked to your account or email at that stage and can be cleared by clearing this site's browser storage.</p>
            <p>If you choose to save or email your result, we store your email address, relevant answers and recommended products with your active consent. The record may be linked to your account if you are signed in. We retain it only while reasonably needed for the requested service, consent records and the purposes in this policy. You can request deletion by contacting us.</p>
            <p>The initial questionnaire does not send your answers to an AI service. If you use the optional follow-up question or skin-question chat, the relevant skin profile, routine information and text you enter are sent through Lovable AI to Google's Gemini service to generate a response. Do not include information you do not want processed in that way.</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Service providers and overseas processing</h2>
          <p className="mt-3 text-muted-foreground">We do not sell personal information. We disclose only the information reasonably needed for the following services:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li><strong className="font-medium text-foreground">Stripe</strong> processes checkout and payment information and provides payment, refund and fraud-prevention records. Stripe operates internationally, including in the United States, so information may be processed outside Australia.</li>
            <li><strong className="font-medium text-foreground">Lovable Cloud</strong> hosts the website and provides the managed database and authentication services that hold account, order, support and saved-product information. Its services may use infrastructure outside Australia.</li>
            <li><strong className="font-medium text-foreground">Lovable Email</strong> sends transactional messages such as order and delivery updates. Recipient details and message content may be processed outside Australia.</li>
            <li><strong className="font-medium text-foreground">Australia Post</strong> receives the recipient name, delivery address, contact details and parcel information when our team creates a shipping label. This is currently a manual fulfilment process rather than an automated carrier connection.</li>
            <li><strong className="font-medium text-foreground">Google Analytics</strong> receives limited website-use and device information on the live site. We block contact details from our analytics events and disable Google advertising signals. Google operates globally, including in the United States, so information may be processed outside Australia.</li>
            <li><strong className="font-medium text-foreground">Lovable AI and Google Gemini</strong> process optional skin-question and Routine Finder follow-up content as described above. These services may process information outside Australia, including in the United States.</li>
          </ul>
          <p className="mt-3 text-muted-foreground">We do not currently use a separate customer-support platform or a separate marketing-email platform. Contact messages and newsletter sign-ups are stored in our managed backend. Provider locations can change because global services use distributed infrastructure; we take reasonable steps required by Australian privacy law when information is handled overseas.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Authenticity card verification</h2>
          <div className="mt-3 space-y-3 text-muted-foreground">
            <p>Scanning the QR code on an authenticity card opens the public verification record for that parcel. We record a scan count and the first and most recent scan timestamps. We do not record the scanner's IP address, browser, device, cookie, fingerprint or identity as part of the verification scan.</p>
            <p>Scan history helps our team manually review repeated scans or possible duplicated-card misuse. There is no automated fraud score. The public record does not display the customer's identity, order number, address, payment or tracking information, and no sign-in is required.</p>
            <p>Verification and scan records are retained while reasonably needed to preserve the parcel record, investigate misuse, provide customer support and meet legal or dispute-resolution needs. No fixed expiry period is currently applied.</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Data storage and retention</h2>
          <p className="mt-3 text-muted-foreground">We retain personal information only for as long as reasonably needed to complete and document orders, provide customer service, prevent fraud and maintain security, meet accounting, tax and other legal obligations, resolve disputes, and manage an active marketing consent or suppression record. Retention depends on the type of record and why it is held; we do not apply one fixed period to every category. A deletion request may not require us to erase records that we must or are permitted to retain for legal, accounting, fraud-prevention or dispute-resolution purposes.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Marketing emails</h2>
          <p className="mt-3 text-muted-foreground">Marketing requires an active opt-in; our marketing checkbox is not preselected. When you subscribe, we record your email address, the signup location and the date the record was created. Every marketing email must include a working unsubscribe option. You can also withdraw consent by emailing{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>. We may retain the minimum suppression record needed to ensure you are not sent further marketing. Order, delivery, security and account-service emails are transactional and are not marketing.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Cookies and browser storage</h2>
          <div className="mt-3 space-y-3 text-muted-foreground">
            <p>We use essential cookies and browser storage for authentication, your bag, checkout details, Routine Finder drafts and display preferences. A guest checkout email may be held in session storage for that checkout session.</p>
            <p>On skingrocer.com.au, Google Analytics is active and uses browser technologies to measure page views and shopping interactions. We do not send names, email addresses, phone numbers, street addresses or account identifiers in our analytics events, and Google advertising signals are disabled. Preview and local versions keep analytics events only in temporary memory and do not send them to Google Analytics.</p>
            <p>We do not currently activate third-party advertising or cross-site behavioural advertising. You can control cookies through your browser settings, although blocking essential storage may stop the bag, sign-in or checkout from working. Before introducing materially different advertising or tracking technology, we will update this policy and implement any consent controls required by law.</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Security</h2>
          <p className="mt-3 text-muted-foreground">We take reasonable technical and organisational measures to protect personal information from misuse, interference, loss and unauthorised access, modification or disclosure. No internet transmission or storage system can be guaranteed to be completely secure.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Data breaches</h2>
          <p className="mt-3 text-muted-foreground">We assess suspected data breaches and take reasonable steps to contain and address them. We will notify affected individuals and the Office of the Australian Information Commissioner where required by law.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Under 18</h2>
          <p className="mt-3 text-muted-foreground">The website is intended for customers capable of making online purchases. We do not knowingly seek to collect personal information from children through the Routine Finder.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Your privacy rights</h2>
          <p className="mt-3 text-muted-foreground">You can ask for access to or correction of the personal information we hold about you, request deletion where applicable, withdraw marketing consent, or ask how your information is used. Contact{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>. We may reasonably verify your identity before releasing or changing account information. We will explain if a request cannot be completed because information must be retained or another legal exception applies.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Complaints</h2>
          <p className="mt-3 text-muted-foreground">Send a privacy complaint to{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>. We will acknowledge the concern, investigate the circumstances and respond within a reasonable time. If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner through its{" "}
            <a href="https://www.oaic.gov.au/privacy/privacy-complaints" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:no-underline">
              privacy complaints guidance
            </a>.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Changes to this policy</h2>
          <p className="mt-3 text-muted-foreground">We may update this policy when our practices, providers or legal obligations change. The last-updated date will show the most recent revision.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Contact us</h2>
          <p className="mt-3 text-muted-foreground">Skin Grocer Pty Ltd, Melbourne, Victoria —{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
