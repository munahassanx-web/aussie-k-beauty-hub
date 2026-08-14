import { useState } from "react";
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
        : "You're on the list. First email lands soon.",
    );
    setEmail("");
  }

  if (status === "success") {
    return (
      <div
        className={`mt-3 w-full max-w-md rounded-full px-6 py-3.5 text-center text-sm ${
          dark ? "border border-accent/40 bg-paper/5 text-paper" : "border border-ink/15 bg-paper text-ink"
        }`}
        role="status"
      >
        ✓ {message}
      </div>
    );
  }

  return (
    <div className={dark ? "mt-4 w-full" : "mt-3 w-full max-w-md"}>
      <form
        onSubmit={onSubmit}
        noValidate
        className={`flex overflow-hidden rounded-full ${
          dark ? "border border-paper/25" : "border border-ink/15 bg-paper"
        }`}
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
          className={`w-full bg-transparent px-5 text-sm focus:outline-none ${
            dark
              ? "py-3 text-paper placeholder:text-paper/40"
              : "py-3.5 text-ink placeholder:text-ink/40"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`px-6 text-xs font-semibold uppercase tracking-[0.2em] disabled:opacity-60 ${
            dark
              ? "bg-accent text-ink hover:bg-accent/85"
              : "bg-primary text-primary-foreground hover:bg-hanbok"
          }`}
        >
          {status === "loading" ? "…" : "Join"}
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
    </div>
  );
}
