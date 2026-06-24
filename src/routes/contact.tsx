import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Skin Grocer" },
      { name: "description", content: "Talk to the Skin Grocer team — routine guidance, order help, wholesale and vending machine partnerships in Australia." },
      { property: "og:title", content: "Contact — Skin Grocer" },
      { property: "og:description", content: "We're here to help you glow." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Contact</p>
        <h1 className="mt-4 text-5xl text-foreground md:text-6xl">Say hello.</h1>
        <p className="mt-5 max-w-md text-lg text-muted-foreground">
          Whether you need help building a routine, tracking an order, or
          hosting a Skin Grocer vending machine — our small Aussie team
          replies personally, usually within a few hours.
        </p>
        <dl className="mt-10 space-y-6">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Email</dt>
            <dd className="mt-1 font-display text-2xl text-foreground">hello@skingrocer.com.au</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Warehouse</dt>
            <dd className="mt-1 font-display text-2xl text-foreground">Sydney, NSW</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Hours</dt>
            <dd className="mt-1 font-display text-2xl text-foreground">Mon–Sat, 9am–6pm AEST</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Same-day cutoff</dt>
            <dd className="mt-1 font-display text-2xl text-foreground">Order by 1pm</dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        className="rounded-3xl bg-secondary/60 p-8 md:p-10"
      >
        {sent ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="font-display text-3xl text-foreground">Message received ✨</h2>
            <p className="mt-3 text-muted-foreground">We'll be back to you shortly. In the meantime, your skin is in good hands.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground">Your name</label>
              <input required className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input required type="email" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">What can we help with?</label>
              <select className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                <option>Routine guidance</option>
                <option>Order help</option>
                <option>Wholesale & vending partnerships</option>
                <option>Something else</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea required rows={5} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <button className="w-full rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
              Send message
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
