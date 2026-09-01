import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader, SiteFooter } from "../components/site-chrome";
import { CheckoutHeader, CheckoutFooter } from "../components/checkout-chrome";
import { ChatWidget } from "../components/chat-widget";
import { CartProvider } from "../lib/cart";
import { WishlistProvider } from "../lib/wishlist";
import { Toaster } from "sonner";
import { CartDrawer } from "../components/cart-drawer";
import { PreviewRefreshButton } from "../components/preview-refresh-button";
import { ThemePalettePicker } from "../components/theme-palette-picker";
import { initAnalytics, trackPageView } from "../lib/analytics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-foreground">404</h1>
        <h2 className="mt-4 text-xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page has wandered off. Let's get you back to glowing skin.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing the page.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent/10">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Skin Grocer — Authentic Korean Skincare, Dispatched from Melbourne" },
      { name: "description", content: "Melbourne's destination for authentic K-beauty and premium imports. Locally stocked, expertly guided and dispatched from Melbourne across Australia." },
      { name: "author", content: "Skin Grocer" },
      ...(SITE_VERIFICATION
        ? [{ name: "google-site-verification", content: SITE_VERIFICATION }]
        : []),
      { property: "og:title", content: "Skin Grocer — Authentic Korean Skincare, Dispatched from Melbourne" },
      { property: "og:description", content: "Melbourne's destination for authentic K-beauty and premium imports. Locally stocked, expertly guided and dispatched from Melbourne across Australia." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Skin Grocer" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Skin Grocer — Authentic Korean Skincare, Dispatched from Melbourne" },
      { name: "twitter:description", content: "Melbourne's destination for authentic K-beauty and premium imports. Locally stocked, expertly guided and dispatched from Melbourne across Australia." },
      { property: "og:image", content: "https://skingrocer.com.au/__l5e/assets-v1/2c278014-5745-49e3-943f-f4321b5892c7/skin-grocer-og.jpg" },
      { name: "twitter:image", content: "https://skingrocer.com.au/__l5e/assets-v1/2c278014-5745-49e3-943f-f4321b5892c7/skin-grocer-og.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,700;9..144,900&family=Bodoni+Moda:opsz,wght@6..96,700;6..96,800;6..96,900&family=Inter:wght@300;400;500;600&display=swap" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Google Search Console ownership token, supplied by configuration only. */
const SITE_VERIFICATION = (import.meta.env as Record<string, string | undefined>)[
  "VITE_GOOGLE_SITE_VERIFICATION"
];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  // Checkout runs on distraction-free chrome: no catalogue nav, no promo strip,
  // no floating chat that could cover payment fields on mobile.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCheckout = pathname === "/checkout" || pathname.startsWith("/checkout/");


  // GA4 loads only when a Measurement ID is configured for the production
  // domain; otherwise events stay in the local debug buffer.
  useEffect(() => {
    initAnalytics();
    trackPageView(window.location.pathname);
    return router.subscribe("onResolved", ({ toLocation }) => {
      trackPageView(toLocation.pathname);
    });
  }, [router]);
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
        <div className="flex min-h-dvh flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <CartDrawer />
        <ChatWidget />
        <PreviewRefreshButton />
        <ThemePalettePicker />
        <Toaster position="bottom-right" richColors closeButton />
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
