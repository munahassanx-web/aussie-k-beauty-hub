import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getAccountOverview } from '@/lib/account.functions';
import { formatOrderDate, orderReference, purchasedProducts } from '@/lib/purchase-history';
import { formatAud } from '@/lib/cart';
import { productSlug } from '@/lib/product-detail';
import { ReorderConfirmation, useReorder } from '@/components/reorder-button';
import { SignedOutPanel, AccountError } from '@/components/account-gate';

export const Route = createFileRoute('/restock')({
  head: () => ({
    meta: [
      { title: 'Restock essentials — Skin Grocer' },
      {
        name: 'description',
        content:
          'Reorder the Korean skincare you have already bought from Skin Grocer, at today’s prices, with a direct link to each product’s application guide.',
      },
      { property: 'og:title', content: 'Restock essentials — Skin Grocer' },
      { property: 'og:description', content: 'Reorder what you already use, at today’s prices.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { property: 'og:url', content: 'https://skingrocer.com.au/restock' },
      { name: 'robots', content: 'noindex, follow' },
    ],
    links: [{ rel: 'canonical', href: 'https://skingrocer.com.au/restock' }],
  }),
  component: RestockPage,
});

function RestockPage() {
  const { user, loading: authLoading } = useAuth();
  const overview = useQuery({
    queryKey: ['account-overview', user?.id],
    queryFn: () => getAccountOverview(),
    enabled: !!user,
  });

  const purchased = useMemo(
    () => (overview.data ? purchasedProducts(overview.data.orders) : null),
    [overview.data],
  );
  const { addProducts, confirmation } = useReorder();

  if (authLoading) {
    return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  }

  if (!user) {
    return (
      <Shell>
        <SignedOutPanel
          eyebrow="Restock"
          title="Reorder what you already use"
          body="Sign in and the products you’ve bought from us appear here — packshot, today’s price, and a link to the application guide, so restocking takes a tap."
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <header>
        <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Restock</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-foreground">
          Your essentials
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Everything below is something you’ve actually ordered. Prices shown are today’s catalog prices, not what you
          paid before. We don’t guess when you’ll run out — you know your routine better than an algorithm does.
        </p>
      </header>

      {overview.isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading your orders…</p>}
      {overview.isError && <AccountError onRetry={() => void overview.refetch()} />}

      {purchased && purchased.items.length === 0 && (
        <div className="mt-10 border-t border-border pt-10">
          <h2 className="font-display text-2xl text-foreground">Nothing to restock yet</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Once an order is placed on this account, the products in it appear here for one-tap reordering. Guest
            orders placed with this email address are linked automatically when you sign in.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-8">
            <Link to="/shop" className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary">
              Shop the range
            </Link>
            <Link to="/search" className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary">
              Search products
            </Link>
            <Link to="/consultation" className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary">
              Take the consultation
            </Link>
          </div>
        </div>
      )}

      {purchased && purchased.items.length > 0 && (
        <>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {purchased.items.length} previously purchased {purchased.items.length === 1 ? 'product' : 'products'}
            </p>
            <button
              type="button"
              onClick={() => addProducts(purchased.items.filter((i) => i.purchasable).map((i) => i.product))}
              className="min-h-11 bg-foreground px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background hover:opacity-90"
            >
              Add all available to bag
            </button>
          </div>

          <ReorderConfirmation message={confirmation} />

          <ul className="mt-8 divide-y divide-border border-y border-border">
            {purchased.items.map((item) => (
              <li key={item.product.priceId} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
                <Link
                  to="/product/$slug"
                  params={{ slug: productSlug(item.product) }}
                  className="shrink-0 self-start bg-secondary/40"
                >
                  <img
                    src={item.product.image}
                    alt={`${item.product.brand} ${item.product.name}`}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-24 w-24 object-contain"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{item.product.brand}</p>
                  <h2 className="mt-1 font-display text-lg leading-snug text-foreground">
                    <Link to="/product/$slug" params={{ slug: productSlug(item.product) }} className="hover:text-primary">
                      {item.product.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last ordered {formatOrderDate(item.lastPurchasedAt)} · Order {orderReference(item.lastOrderId)}
                    {item.timesPurchased > 1 ? ` · ordered ${item.timesPurchased}×` : ''}
                  </p>
                  <Link
                    to="/guide/$productId"
                    params={{ productId: productSlug(item.product) }}
                    className="mt-2 inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
                  >
                    How to apply
                  </Link>
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <p className="font-display text-lg text-foreground">{formatAud(item.currentCents)}</p>
                  {item.purchasable ? (
                    <button
                      type="button"
                      onClick={() => addProducts([item.product])}
                      className="min-h-11 border border-border px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground hover:border-primary hover:text-primary"
                    >
                      Add to bag
                    </button>
                  ) : (
                    <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Currently unavailable
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {purchased.unmatchedLines > 0 && (
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              {purchased.unmatchedLines} earlier order{' '}
              {purchased.unmatchedLines === 1 ? 'line is' : 'lines are'} not shown here because{' '}
              {purchased.unmatchedLines === 1 ? 'it' : 'they'} no longer match a product in the current range. Your full
              order history is on your{' '}
              <Link to="/account" className="underline underline-offset-4 hover:text-primary">
                account page
              </Link>
              .
            </p>
          )}
        </>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">{children}</div>;
}
