import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { lookupInvite } from '@/lib/referrals.functions';
import { saveInvite } from '@/lib/referral-invite';
import { FRIEND_DISCOUNT_LABEL, FRIEND_MIN_SUBTOTAL_LABEL } from '@/lib/referrals';

export const Route = createFileRoute('/invite/$code')({
  head: () => ({
    meta: [
      { title: `${FRIEND_DISCOUNT_LABEL} off your first order — Skin Grocer` },
      {
        name: 'description',
        content: `A friend invited you to Skin Grocer: ${FRIEND_DISCOUNT_LABEL} off your first order of ${FRIEND_MIN_SUBTOTAL_LABEL} or more. Korean skincare, verified and stocked in Melbourne.`,
      },
      { property: 'og:title', content: `A friend sent you ${FRIEND_DISCOUNT_LABEL} off Skin Grocer` },
      {
        property: 'og:description',
        content: 'Korean skincare sourced from Seoul, stocked in Melbourne, matched to your skin.',
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: InvitePage,
});

function InvitePage() {
  const { code } = Route.useParams();
  const invite = useQuery({
    queryKey: ['invite', code],
    queryFn: () => lookupInvite({ data: { code } }),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (invite.data?.valid) saveInvite(code);
  }, [invite.data, code]);

  if (invite.isLoading) {
    return <div className="mx-auto max-w-xl px-6 py-24 text-sm text-muted-foreground">Opening your invite…</div>;
  }

  if (!invite.data?.valid) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Invite</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-foreground">This invite link isn’t working</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Check the link with the friend who sent it. You can still shop the full range.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex min-h-13 items-center rounded-full bg-hanbok-deep px-9 text-[11px] font-bold uppercase tracking-[0.18em] text-background transition-colors hover:bg-hanbok"
        >
          Shop skincare
        </Link>
      </div>
    );
  }

  const from = invite.data.firstName;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <div className="rounded-[2rem] border border-border bg-blush/40 px-6 py-12 text-center shadow-[0_30px_60px_-45px_rgba(58,38,32,0.55)] sm:px-12">
        <p className="text-[11px] uppercase tracking-[0.24em] text-primary">{from ? `From ${from}` : 'A friend’s invite'}</p>
        <h1 className="mt-5 font-display text-[clamp(2.2rem,7vw,3.6rem)] leading-[1.02] tracking-[-0.02em] text-foreground">
          {FRIEND_DISCOUNT_LABEL} off your first order
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {from ? `${from} shops` : 'Your friend shops'} Korean skincare with us. Every product is sourced from Seoul,
          checked on arrival and dispatched from Melbourne.
        </p>
        <p className="mt-6 text-sm text-foreground">
          Your {FRIEND_DISCOUNT_LABEL} comes off automatically at checkout. Nothing to type.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/shop"
            className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-hanbok-deep px-9 text-[11px] font-bold uppercase tracking-[0.18em] text-background shadow-[0_16px_34px_-18px_rgba(58,38,32,0.7)] transition-colors hover:bg-hanbok sm:w-auto"
          >
            Start shopping
          </Link>
          <Link
            to="/routines"
            className="inline-flex min-h-13 w-full items-center justify-center rounded-full border border-border bg-background/70 px-9 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-glaze sm:w-auto"
          >
            Find your routine
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
        For first orders of {FRIEND_MIN_SUBTOTAL_LABEL} or more before delivery, one per customer, not for Restock
        subscriptions. Your invite is saved in this browser for 30 days.{' '}
        <Link to="/terms-and-conditions" hash="refer-a-friend" className="underline underline-offset-4 hover:text-foreground">
          Terms
        </Link>
        .
      </p>
    </div>
  );
}
