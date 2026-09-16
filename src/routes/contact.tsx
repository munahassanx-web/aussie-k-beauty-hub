import { PageHero } from "@/components/page-hero";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { submitContactForm } from "@/lib/contact.functions";


const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  topic: z.enum([
    "Product or routine guidance",
    "Existing order support",
    "Shipping or delivery question",
    "Return or product concern",
    "Verification-record concern",
    "Brand, supplier or press enquiry",
    "Something else",
  ], {
    message: "Please select a topic",
  }),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const topics = [
  "Product or routine guidance",
  "Existing order support",
  "Shipping or delivery question",
  "Return or product concern",
  "Verification-record concern",
  "Brand, supplier or press enquiry",
  "Something else",
] as const;

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { verification?: string; product?: string } => {
    const parsed: { verification?: string; product?: string } = {};
    if (typeof search.verification === 'string' && search.verification.trim()) parsed.verification = search.verification.slice(0, 40);
    if (typeof search.product === 'string' && search.product.trim()) parsed.product = search.product.slice(0, 180);
    return parsed;
  },
  head: () => ({
    meta: [
      { title: "Contact — Skin Grocer" },
      { name: "description", content: "Contact Skin Grocer for Korean skincare guidance, order support, shipping questions, product concerns and brand enquiries." },

      { property: "og:title", content: "Contact — Skin Grocer" },
      { property: "og:description", content: "We're here to help you glow." },
      { property: "og:url", content: "https://skingrocer.com.au/contact" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const search = Route.useSearch();
  const concernMessage = search.verification && search.product
    ? `I would like to report a concern about ${search.product}.\n\nVerification reference: ${search.verification}\n\nConcern: `
    : '';
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: concernMessage ? 'Verification-record concern' as const : topics[0],
    message: concernMessage,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submit = useServerFn(submitContactForm);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof formData, string>> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof typeof formData;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");
    try {
      await submit({ data: formData });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };





  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Contact"
        hangul="연락하기"
        title="Say hello."
        titleAccent="We answer personally."
        lede="Routine guidance, order support or product questions—answered personally by our Melbourne team."
        cta={{ label: "Shop the edit", to: "/shop" }}
        tone="plum"
        index="03"
        ghost="Hello"
      />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 pt-16 md:grid-cols-2">
        <div>


          <dl className="mt-10 space-y-6 break-words [overflow-wrap:anywhere]">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Customer care</dt>
              <dd className="mt-1 font-display text-xl text-foreground sm:text-2xl">customercare@skingrocer.com.au</dd>
              <p className="mt-1 text-sm text-muted-foreground">Orders, shipping, delivery, returns, refunds and routine help.</p>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">General &amp; business enquiries</dt>
              <dd className="mt-1 font-display text-xl text-foreground sm:text-2xl">info@skingrocer.com.au</dd>
              <p className="mt-1 text-sm text-muted-foreground">Brand partnerships, Korean skincare suppliers, professional collaborations and press enquiries.</p>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Hours</dt>
              <dd className="mt-1 font-display text-xl text-foreground sm:text-2xl">Mon–Sat, 9am–6pm AEST</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Response time</dt>
              <dd className="mt-1 font-display text-xl text-foreground sm:text-2xl">We aim to respond within 1–2 business days.</dd>
            </div>
          </dl>

        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-secondary/60 p-8 md:p-10 h-fit"
          noValidate
        >
          {status === "success" ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h2 className="font-display text-3xl text-foreground">Message received ✨</h2>
              <p className="mt-3 text-muted-foreground">We aim to respond within 1–2 business days.</p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setFormData({ name: "", email: "", topic: topics[0], message: "" });
                }}
                className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground">Your name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  maxLength={100}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <p id="name-error" className="mt-1 text-sm text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  maxLength={255}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <p id="email-error" className="mt-1 text-sm text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="topic" className="text-sm font-medium text-foreground">What can we help with?</label>
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={(e) => updateField("topic", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
                {errors.topic && <p id="topic-error" className="mt-1 text-sm text-destructive">{errors.topic}</p>}
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  maxLength={2000}
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && <p id="message-error" className="mt-1 text-sm text-destructive">{errors.message}</p>}
                <p className="mt-1 text-xs text-muted-foreground text-right">{formData.message.length}/2000</p>
              </div>
              {status === "error" && (
                <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending..." : "Send message"}
              </button>
            </div>
          )}
        </form>
      </div>

      <section className="mt-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Shipping</p>
            <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">Delivery coverage & timing.</h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Orders are dispatched from our Epping, Victoria warehouse. Current dispatch estimates and delivery
            options are available in our Shipping Policy. Transit times below are Australia Post estimates and
            depend on your postcode.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Melbourne metro</p>
            <p className="mt-2 font-display text-2xl text-foreground">1–2 business days</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Estimated transit after dispatch from our Epping warehouse — not a guarantee.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Sydney, Canberra, Adelaide, Brisbane</p>
            <p className="mt-2 font-display text-2xl text-foreground">1–2 business days</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Estimated metro transit on Australia Post’s standard service.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Regional Australia</p>
            <p className="mt-2 font-display text-2xl text-foreground">2–5 business days</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Estimated Australia Post transit to regional addresses after dispatch.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">WA & NT</p>
            <p className="mt-2 font-display text-2xl text-foreground">2–5 business days</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Estimated Australia Post transit after dispatch; timing depends on your postcode.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 rounded-2xl border border-border bg-secondary/30 p-6 md:grid-cols-2">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
              <span className="text-sm">$</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Free standard shipping over A$100</p>
              <p className="text-sm text-muted-foreground">A$9.95 flat rate for orders under A$100.</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Documented batch verification</p>
            <p>Orders include a QR verification card linked to the receiving and packaging checks recorded for the parcel.</p>
          </div>
          <p className="text-xs text-muted-foreground md:col-span-2">All transit times are estimates from dispatch, not guarantees. Business days exclude public holidays.</p>
        </div>
      </section>

      <section className="mt-16">
        <div className="rounded-3xl border border-border bg-secondary/30 p-8 md:p-10">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">Melbourne based</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Skin Grocer products are locally stocked and dispatched from our Epping, Victoria warehouse.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Our warehouse is not currently open for shopping, customer visits or order collection.
          </p>
        </div>
      </section>
    </div>
  );
}
