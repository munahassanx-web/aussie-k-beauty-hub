import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getMyReferral } from '@/lib/referrals.functions';
import { getStripeEnvironment } from '@/lib/stripe';
import { formatAud } from '@/lib/cart';
import { FRIEND_DISCOUNT_LABEL, FRIEND_MIN_SUBTOTAL_LABEL } from '@/lib/referrals';
import { Link } from '@tanstack/react-router';

const SHARE_TEXT = `I shop my Korean skincare at Skin Grocer. Here's ${FRIEND_DISCOUNT_LABEL} off your first order:`;

/** Account page: the customer's invite link, and what it has earned. */
export function ReferAFriendCard({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);
  const referral = useQuery({
    queryKey: ['my-referral', userId],
    queryFn: () => getMyReferral({ data: { environment: getStripeEnvironment() } }),
  });

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt('Copy your invite link', url);
    }
  }

  async function share(url: string) {
    try {
      await navigator.share({ title: 'Skin Grocer', text: SHARE_TEXT, url });
    } catch {
      /* closed the share sheet */
    }
  }

  const data = referral.data;
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <section id="refer" className="mt-14 scroll-mt-24 rounded-[1.75rem] border border-border bg-blush/35 p-6 sm:p-8" aria-labelledby="refer-heading">
      <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Refer a friend</p>
      <h2 id="refer-heading" className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
        Give {FRIEND_DISCOUNT_LABEL}, get {FRIEND_DISCOUNT_LABEL}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Your friend gets {FRIEND_DISCOUNT_LABEL} off their first order of {FRIEND_MIN_SUBTOTAL_LABEL} or more. Once
        they’ve paid, you get {FRIEND_DISCOUNT_LABEL} off your next order, taken off automatically at checkout.
      </p>

      {referral.isLoading && <p className="mt-6 text-sm text-muted-foreground">Getting your link…</p>}
      {referral.isError && (
        <p className="mt-6 text-sm text-muted-foreground">
          Your invite link didn’t load.{' '}
          <button type="button" onClick={() => void referral.refetch()} className="underline underline-offset-4">
            Try again
          </button>
        </p>
      )}

      {data && (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="min-w-0 flex-1 truncate rounded-full border border-border bg-background px-5 py-3 font-mono text-sm text-foreground">
              {data.url.replace(/^https:\/\//, '')}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void copy(data.url)}
                className="min-h-12 flex-1 rounded-full bg-hanbok-deep px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-background transition-colors hover:bg-hanbok sm:flex-none"
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
              {canShare && (
                <button
                  type="button"
                  onClick={() => void share(data.url)}
                  className="min-h-12 flex-1 rounded-full border border-border bg-background px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-glaze sm:flex-none"
                >
                  Share
                </button>
              )}
            </div>
          </div>
          <span role="status" className="sr-only">
            {copied ? 'Invite link copied' : ''}
          </span>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border text-sm">
            <div className="bg-background/80 p-4">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Friends who ordered</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">{data.friendsOrdered}</dd>
            </div>
            <div className="bg-background/80 p-4">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Credit ready to use</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">{formatAud(data.creditCents)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Credit comes off one-off orders, not Restock subscriptions.{' '}
            <Link to="/terms-and-conditions" hash="refer-a-friend" className="underline underline-offset-4 hover:text-foreground">
              Terms
            </Link>
            .
          </p>
        </>
      )}
    </section>
  );
}
