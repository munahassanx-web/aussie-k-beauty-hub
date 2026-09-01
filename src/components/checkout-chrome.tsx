import { Link } from "@tanstack/react-router";
import { BrandWordmark } from "@/components/brand-wordmark";
import { useCart } from "@/lib/cart";

/**
 * Distraction-free chrome for the checkout flow: no catalogue navigation,
 * search, wishlist or promotional strip — only the logo, a secure-checkout
 * marker and help/return links.
 */
export function CheckoutHeader() {
  const cart = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <Link to="/" aria-label="Skin Grocer — return to homepage" className="shrink-0">
          <BrandWordmark size="sm" className="text-foreground" />
        </Link>

        <p className="hidden text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:block">
          Secure checkout
        </p>

        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <button
            type="button"
            onClick={() => cart.setOpen(true)}
            className="underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Return to bag
          </button>
          <Link to="/contact" className="underline-offset-4 transition hover:text-foreground hover:underline">
            Need help?
          </Link>
        </div>
      </div>
      <p className="border-t border-border px-5 py-2 text-center text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:hidden">
        Secure checkout
      </p>
    </header>
  );
}

export function CheckoutFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 text-[11px] text-muted-foreground sm:flex-row sm:justify-between">
        <p>© 2026 Skin Grocer Pty Ltd</p>
        <nav aria-label="Checkout footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link to="/privacy-policy" className="underline-offset-4 transition hover:text-foreground hover:underline">
            Privacy
          </Link>
          <Link to="/terms-and-conditions" className="underline-offset-4 transition hover:text-foreground hover:underline">
            Terms
          </Link>
          <Link to="/shipping-policy" className="underline-offset-4 transition hover:text-foreground hover:underline">
            Shipping
          </Link>
          <Link to="/returns-policy" className="underline-offset-4 transition hover:text-foreground hover:underline">
            Returns
          </Link>
          <Link to="/contact" className="underline-offset-4 transition hover:text-foreground hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
