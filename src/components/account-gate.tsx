import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

/**
 * Signed-out state for the account surfaces. Deliberately makes clear that an
 * account is optional — guest checkout is always available.
 */
export function SignedOutPanel({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-foreground">{title}</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{body}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/auth"
          className="inline-flex min-h-11 items-center justify-center bg-foreground px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-background hover:opacity-90"
        >
          Sign in or create an account
        </Link>
        <Link
          to="/shop"
          className="inline-flex min-h-11 items-center justify-center border border-border px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground hover:border-primary hover:text-primary"
        >
          Keep shopping
        </Link>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-foreground">An account is optional</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can check out as a guest — no account needed. If you create one later with the same email you used at
          checkout, those orders are linked to it automatically. You can also{' '}
          <Link to="/track" className="underline underline-offset-4 hover:text-primary">
            track a guest order
          </Link>{' '}
          with your order ID and email.
        </p>
      </div>

      {children}
    </div>
  );
}

export function AccountError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="mt-8 border border-destructive/40 bg-destructive/5 p-6">
      <p className="text-sm text-foreground">We couldn’t load your account just now.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 min-h-11 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline"
      >
        Try again
      </button>
    </div>
  );
}
