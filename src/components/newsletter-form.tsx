import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z
  .string()
  .trim()
  .min(5, { message: "Please enter a valid email address." })
  .max(255, { message: "That email address is too long." })
  .email({ message: "Please enter a valid email address." });

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  source,
  variant = "light",
}: {
  source: "homepage" | "footer";
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const dark = variant === "dark";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.toLowerCase(), source });

    // 23505 = duplicate email; treat as already subscribed, not a failure.
    if (error && error.code !== "23505") {
      setStatus("error");
      setMessage("Something went wrong. Please try again in a moment.");
      return;
    }

    setStatus("success");
    setMessage(
      error?.code === "23505"
        ? "You're already on the list — nice to see you again."
        : "You're on the list.",
    );
    setEmail("");
  }

  if (status === "success") {
    return (
      <div className="mt-4 w-full max-w-md">
        <div
          className={`border px-5 py-4 text-sm ${
            dark
              ? "border-paper/30 bg-paper/5 text-paper"
              : "border-ink/15 bg-paper text-ink"
          }`}
          role="status"
        >
          <span className="mr-2 inline-block text-xs" aria-hidden="true">✓</span>
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className={dark ? "mt-4 w-full" : "mt-3 w-full max-w-md"}>
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col sm:flex-row"
      >
        <label className="sr-only" htmlFor={`newsletter-email-${source}`}>
          Email address
        </label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          maxLength={255}
          placeholder="your@email.com"
          className={`flex-1 border px-4 py-3 text-sm transition focus:outline-none focus:ring-1 focus:ring-offset-0 sm:rounded-none ${
            dark
              ? "border-paper/25 bg-transparent text-paper placeholder:text-paper/40 focus:ring-paper/40"
              : "border-ink/15 bg-paper text-ink placeholder:text-ink/40 focus:ring-ink/30"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`border px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition disabled:opacity-60 sm:rounded-none sm:border-l-0 ${
            dark
              ? "border-paper/25 bg-paper text-ink hover:bg-paper/90"
              : "border-ink/15 bg-ink text-paper hover:bg-ink/85"
          }`}
        >
          {status === "loading" ? "…" : "Join the list"}
        </button>
      </form>
      {status === "error" && (
        <p
          className={`mt-2 text-xs ${dark ? "text-accent" : "text-clay"}`}
          role="alert"
        >
          {message}
        </p>
      )}
      <p
        className={`mt-2.5 text-[11px] leading-relaxed ${
          dark ? "text-paper/75" : "text-ink/75"
        }`}
      >
        By joining, you agree to receive SkinGrocer emails. Unsubscribe anytime.{" "}
        <Link
          to="/privacy-policy"
          className={`ml-1 inline-flex items-center gap-0.5 underline underline-offset-4 transition ${
            dark ? "text-paper/80" : "text-ink/80"
          }`}
        >
          Privacy policy
          <span aria-hidden="true">→</span>
        </Link>
      </p>
    </div>
  );
}
