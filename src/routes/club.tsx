import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ShoppingBasket, RefreshCw, Crown, Check, Truck, Gift, Star } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { getClubSummary, createBillingPortal } from '@/lib/loyalty.functions';
import { getStripeEnvironment, isPaymentsConfigured } from '@/lib/stripe';
import { CircleCheckout } from '@/components/circle-checkout';

export const Route = createFileRoute('/club')({
  head: () => ({
    meta: [
      { title: 'The Restock Club — Skin Grocer' },
      { name: 'description', content: 'Earn points on every order, subscribe to restock your routine, and unlock Circle for 2x points, free Australia Post Express Post, and early access to new brand drops.' },
      { property: 'og:title', content: 'The Restock Club — Skin Grocer' },
      { property: 'og:description', content: 'Loyalty + subscriptions for Skin Grocer members.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://skingrocer.com.au/club' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: 'https://skingrocer.com.au/club' }],
  }),
  component: ClubPage,
});

type TierId = 'basket' | 'restock' | 'circle';

const TIERS: Array<{
  id: TierId;
  name: string;
  icon: typeof ShoppingBasket;
  price: string;
  tagline: string;
  highlight?: boolean;
  perks: string[];
}> = [
  {
    id: 'basket',
    name: 'Basket',
    icon: ShoppingBasket,
    price: 'Free — automatic',
    tagline: 'Everyone starts here.',
    perks: [
      'Earn 1 point for every $1 spent',
      '100 points = $5 off your next order',
      'Birthday bonus points',
      'Early access to sale windows',
    ],
  },
  {
    id: 'restock',
    name: 'Restock',
    icon: RefreshCw,
    price: 'Opt-in on any product',
    tagline: 'Never run out again.',
    highlight: true,
    perks: [
      'Everything in Basket',
      '15% off every recurring order',
      'Free standard shipping on subscriptions',
      '1.5x points on subscription orders',
      'Skip, pause, or swap anytime',
    ],
  },
  {
    id: 'circle',
    name: 'Circle',
    icon: Crown,
    price: '$9/mo or $79/yr',
    tagline: 'For the K-beauty regulars.',
    perks: [
      'Everything in Restock',
      '2x points on all orders',
      'Free Australia Post Express Post on every order, no minimum spend',
      'Early access to new brand drops',
      'A seasonal gift with every subscription order',
      'Priority customer support',
    ],
  },
];

const HOW_POINTS_WORK = [
  { icon: Star, label: 'Earn', desc: '1 point per $1 on every order, more with Restock or Circle' },
  { icon: Gift, label: 'Redeem', desc: '100 points = $5 off — stack toward bigger rewards' },
  { icon: Truck, label: 'Save automatically', desc: 'Subscriptions apply your discount at checkout, every time' },
];

function ClubPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [circlePlan, setCirclePlan] = useState<'circle_monthly' | 'circle_yearly' | null>(null);

  const summaryQ = useQuery({
    queryKey: ['club-summary', user?.id],
    queryFn: () => getClubSummary(),
    enabled: !!user,
  });

  // Realtime refresh when the webhook posts a new order/points row
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`club-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'points_ledger', filter: `user_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['club-summary', user.id] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memberships', filter: `user_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['club-summary', user.id] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['club-summary', user.id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  async function openPortal() {
    const res = await createBillingPortal({ data: { environment: getStripeEnvironment(), returnUrl: `${window.location.origin}/club` } });
    if ('error' in res) alert(res.error);
    else window.open(res.url, '_blank');
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: '/' });
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl px-6 py-24 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Skin Grocer Membership</p>
        <h1 className="mt-3 font-display text-4xl text-foreground md:text-5xl">The Restock Club</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Every order earns points automatically. Subscribe to your routine staples for an ongoing discount.
          Join Circle for the full VIP experience — one program, three ways to get more from it.
        </p>
      </div>

      {!user ? (
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-border bg-secondary/40 p-6 text-center">
          <p className="text-sm text-foreground">Sign in to see your points, tier, and subscriptions.</p>
          <Link to="/auth" className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            Sign in or create an account
          </Link>
        </div>
      ) : (
        <MemberDashboard summary={summaryQ.data} loading={summaryQ.isLoading} onOpenPortal={openPortal} onSignOut={signOut} />
      )}

      {/* How points work */}
      <div className="mx-auto mt-16 grid max-w-3xl gap-4 md:grid-cols-3">
        {HOW_POINTS_WORK.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center">
              <Icon size={20} className="mb-3 text-primary" strokeWidth={1.5} />
              <p className="font-display text-base font-semibold text-foreground">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Tiers */}
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            currentTier={summaryQ.data?.tier}
            onJoinCircle={() => {
              if (!user) { navigate({ to: '/auth' }); return; }
              if (!isPaymentsConfigured()) { alert('Payments are not configured for this build.'); return; }
              setCirclePlan('circle_monthly');
            }}
            onJoinCircleYearly={() => {
              if (!user) { navigate({ to: '/auth' }); return; }
              setCirclePlan('circle_yearly');
            }}
          />
        ))}
      </div>

      <p className="mx-auto mt-14 max-w-md text-center text-[11px] leading-relaxed text-muted-foreground">
        Points multipliers apply automatically at checkout based on your tier. Redeem points at checkout starting from 100 points ($5).
      </p>

      {circlePlan && <CircleCheckout priceId={circlePlan} onClose={() => setCirclePlan(null)} />}
    </div>
  );
}

function MemberDashboard({
  summary,
  loading,
  onOpenPortal,
  onSignOut,
}: {
  summary: Awaited<ReturnType<typeof getClubSummary>> | undefined;
  loading: boolean;
  onOpenPortal: () => void;
  onSignOut: () => void;
}) {
  if (loading || !summary) {
    return <div className="mt-10 text-center text-sm text-muted-foreground">Loading your account…</div>;
  }
  const tier = TIERS.find((t) => t.id === summary.tier)!;
  const TierIcon = tier.icon;
  const dollarValue = Math.floor(summary.pointsBalance / 100) * 5;

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-background">
      <div className="grid gap-6 border-b border-border bg-secondary/30 p-6 md:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Signed in as</p>
          <p className="mt-1 font-display text-lg text-foreground">{summary.displayName ?? summary.email}</p>
          <button onClick={onSignOut} className="mt-2 text-xs text-muted-foreground hover:text-primary">Sign out</button>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Current tier</p>
          <p className="mt-1 flex items-center gap-2 font-display text-lg text-foreground">
            <TierIcon size={18} className="text-primary" /> {tier.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{tier.tagline}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Points balance</p>
          <p className="mt-1 font-display text-3xl text-primary">{summary.pointsBalance.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">≈ ${dollarValue} in rewards</p>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-foreground">Recent activity</h3>
          {summary.recentLedger.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No points yet. Your first order will earn you points automatically.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border text-sm">
              {summary.recentLedger.map((row) => (
                <li key={row.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-foreground">{formatReason(row.reason)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={row.delta >= 0 ? 'text-primary' : 'text-muted-foreground'}>
                    {row.delta > 0 ? '+' : ''}{row.delta} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-foreground">Subscriptions</h3>
          {summary.activeSubscriptions.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">You don't have any active subscriptions yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {summary.activeSubscriptions.map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{s.priceId ?? 'Subscription'}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.status}</span>
                  </div>
                  {s.currentPeriodEnd && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.cancelAtPeriodEnd ? 'Ends' : 'Renews'} {new Date(s.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
          {summary.hasActiveSubscription && (
            <button
              onClick={onOpenPortal}
              className="mt-4 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground hover:bg-secondary"
            >
              Manage billing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TierCard({
  tier,
  currentTier,
  onJoinCircle,
  onJoinCircleYearly,
}: {
  tier: (typeof TIERS)[number];
  currentTier?: TierId;
  onJoinCircle: () => void;
  onJoinCircleYearly: () => void;
}) {
  const Icon = tier.icon;
  const isCurrent = currentTier === tier.id;
  return (
    <div
      className={`flex flex-col rounded-2xl p-6 transition-all ${tier.highlight ? 'bg-secondary' : 'bg-background'} ${isCurrent ? 'border-2 border-primary shadow-lg' : 'border border-border'}`}
    >
      {tier.highlight && !isCurrent && (
        <span className="mb-3 self-start rounded-full bg-ink px-3 py-1 text-[9px] font-medium uppercase tracking-widest text-paper">
          Recommended
        </span>
      )}
      {isCurrent && (
        <span className="mb-3 self-start rounded-full bg-primary px-3 py-1 text-[9px] font-medium uppercase tracking-widest text-primary-foreground">
          Your tier
        </span>
      )}
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-primary" strokeWidth={1.5} />
        <span className="font-display text-xl font-semibold text-foreground">{tier.name}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{tier.tagline}</p>
      <p className="mt-1 text-sm text-primary">{tier.price}</p>
      <ul className="mt-4 flex flex-col gap-2">
        {tier.perks.map((perk, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-foreground">
            <Check size={13} className="mt-0.5 shrink-0 text-primary" strokeWidth={2.2} />
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      {tier.id === 'circle' && !isCurrent && (
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onJoinCircle}
            className="rounded-full bg-primary py-2.5 text-xs font-medium uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            Join Circle — $9/mo
          </button>
          <button
            onClick={onJoinCircleYearly}
            className="rounded-full border border-primary py-2.5 text-xs font-medium uppercase tracking-wider text-primary hover:bg-primary/5"
          >
            Or $79/yr (save $29)
          </button>
        </div>
      )}
    </div>
  );
}

function formatReason(reason: string): string {
  switch (reason) {
    case 'signup_bonus': return 'Welcome bonus';
    case 'order_earn': return 'Points from order';
    case 'redeem': return 'Redeemed for reward';
    default: return reason.replace(/_/g, ' ');
  }
}
