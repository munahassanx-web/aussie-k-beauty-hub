import { trackingLink, trackingLinkLabel } from '@/lib/shipping/carriers';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { getAccountOverview, type AccountOrder } from '@/lib/account.functions';
import {
  fulfilmentLabel,
  formatOrderDate,
  orderReference,
  purchasedProducts,
  resolveOrderLines,
} from '@/lib/purchase-history';
import { formatAud } from '@/lib/cart';
import { productSlug } from '@/lib/product-detail';
import { SignedOutPanel, AccountError } from '@/components/account-gate';

export const Route = createFileRoute('/account')({
  head: () => ({
    meta: [
      { title: 'Your account — Skin Grocer' },
      {
        name: 'description',
        content:
          'Your Skin Grocer account: real order history, one-tap restocking of products you already use, and the application guide for everything you’ve bought.',
      },
      { property: 'og:title', content: 'Your account — Skin Grocer' },
      { property: 'og:description', content: 'Order history, restocking and application guides in one place.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { property: 'og:url', content: 'https://skingrocer.com.au/account' },
      { name: 'robots', content: 'noindex, follow' },
    ],
    links: [{ rel: 'canonical', href: 'https://skingrocer.com.au/account' }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const overview = useQuery({
    queryKey: ['account-overview', user?.id],
    queryFn: () => getAccountOverview(),
    enabled: !!user,
  });

  const purchased = useMemo(
    () => (overview.data ? purchasedProducts(overview.data.orders) : null),
    [overview.data],
  );

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    await router.navigate({ to: '/' });
  }

  if (authLoading) {
    return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  }

  if (!user) {
    return (
      <Shell>
        <SignedOutPanel
          eyebrow="Account"
          title="Your orders, in one place"
          body="An account keeps your order history, your application guides and your restock list together. It’s free, and you never need one to buy from us."
        />
      </Shell>
    );
  }

  const displayName = overview.data?.displayName?.trim();
  const orders = overview.data?.orders ?? [];

  return (
    <Shell>
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Account</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-foreground">
            {displayName ? `Hello, ${displayName}` : 'Your account'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{overview.data?.email ?? user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="min-h-11 border border-border px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </header>

      {overview.isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading your account…</p>}
      {overview.isError && <AccountError onRetry={() => void overview.refetch()} />}

      {overview.data && (
        <>
          {overview.data.claimedGuestOrders > 0 && (
            <p role="status" className="mt-8 border-l-2 border-primary bg-secondary/40 px-4 py-3 text-sm">
              We linked {overview.data.claimedGuestOrders} earlier guest{' '}
              {overview.data.claimedGuestOrders === 1 ? 'order' : 'orders'} placed with this email to your account.
            </p>
          )}

          {/* Restock — only shown when there is genuine purchase history. */}
          {purchased && purchased.items.length > 0 && (
            <section className="mt-14 border-t border-border pt-8" aria-labelledby="restock-heading">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="restock-heading" className="font-display text-2xl text-foreground">
                  Restock what you use
                </h2>
                <Link
                  to="/restock"
                  className="min-h-11 text-[11px] uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline"
                >
                  All {purchased.items.length} products
                </Link>
              </div>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {purchased.items.slice(0, 3).map((item) => (
                  <li key={item.product.priceId} className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={`${item.product.brand} ${item.product.name}`}
                      width={72}
                      height={72}
                      loading="lazy"
                      className="h-18 w-18 shrink-0 bg-secondary/40 object-contain"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {item.product.brand}
                      </p>
                      <Link
                        to="/product/$slug"
                        params={{ slug: productSlug(item.product) }}
                        className="mt-1 block text-sm leading-snug text-foreground hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Last ordered {formatOrderDate(item.lastPurchasedAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Order history — never fabricated; only rows the webhook wrote. */}
          <section className="mt-14 border-t border-border pt-8" aria-labelledby="orders-heading">
            <h2 id="orders-heading" className="font-display text-2xl text-foreground">
              Order history
            </h2>
            {orders.length === 0 ? (
              <div className="mt-4">
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  No orders on this account yet. If you checked out as a guest with a different email address, you can{' '}
                  <Link to="/track" className="underline underline-offset-4 hover:text-primary">
                    track that order
                  </Link>{' '}
                  with its order ID.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex min-h-11 items-center bg-foreground px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-background hover:opacity-90"
                >
                  Shop the range
                </Link>
              </div>
            ) : (
              <ul className="mt-6 space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </ul>
            )}
          </section>

          <section className="mt-14 border-t border-border pt-8" aria-labelledby="next-heading">
            <h2 id="next-heading" className="font-display text-2xl text-foreground">
              Elsewhere
            </h2>
            <ul className="mt-4 grid gap-px bg-border sm:grid-cols-3">
              {[
                { to: '/consultation' as const, label: 'Routine consultation', copy: 'Rebuild your AM/PM routine from the current range.' },
                { to: '/wishlist' as const, label: 'Saved products', copy: 'Products you’ve saved for later.' },
                { to: '/learn' as const, label: 'Ingredient library', copy: 'What each ingredient actually does.' },
              ].map((tile) => (
                <li key={tile.to} className="bg-background p-6">
                  <Link to={tile.to} className="group block min-h-11">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-foreground group-hover:text-primary">
                      {tile.label}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{tile.copy}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </Shell>
  );
}

function OrderCard({ order }: { order: AccountOrder }) {
  const lines = resolveOrderLines(order);
  const status = fulfilmentLabel(order);

  return (
    <li className="border border-border p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Order {orderReference(order.id)}
          </p>
          <p className="mt-1 text-sm text-foreground">{formatOrderDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-lg text-foreground">{formatAud(order.amountCents)}</p>
          {status && <p className="mt-1 text-xs text-muted-foreground">{status}</p>}
        </div>
      </div>

      {order.isSubscriptionOrder && (
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Restock subscription</p>
      )}

      {order.trackingNumber && (
        <p className="mt-2 text-xs text-muted-foreground">
          Tracking reference: <span className="font-mono">{order.trackingNumber}</span>
          {trackingLink(order.shippingCarrier, order.trackingNumber) && (
            <>
              {' · '}
              <a
                href={trackingLink(order.shippingCarrier, order.trackingNumber)!}
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline-offset-4 hover:underline"
              >
                {trackingLinkLabel(order.shippingCarrier)}
              </a>
            </>
          )}
        </p>
      )}

      <ul className="mt-4 space-y-3 border-t border-border pt-4">
        {lines.map(({ line, product }, i) => (
          <li key={`${order.id}-${i}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="text-sm text-foreground">
              {line.quantity > 1 ? `${line.quantity} × ` : ''}
              {product ? `${product.brand} ${product.name}` : line.name}
            </span>
            {product && (
              <Link
                to="/guide/$productId"
                params={{ productId: productSlug(product) }}
                className="min-h-11 text-[11px] uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline sm:min-h-0"
              >
                How to apply
              </Link>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">{children}</div>;
}
