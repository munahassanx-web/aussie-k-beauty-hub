import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-wordmark.png";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/brands", label: "Brands" },
  { to: "/skin-concerns", label: "Skin Concerns" },
  { to: "/journal", label: "Skin Journal" },
  { to: "/contact", label: "Contact" },
] as const;

const announcements = [
  "Free shipping on orders over $100",
  "10% off your first order with code GLOW10",
  "Same-day delivery across Sydney",
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      {/* Announcement strip */}
      <div className="bg-foreground py-2 text-center text-xs text-background">
        <div className="mx-auto max-w-6xl px-4">
          <span className="opacity-90">{announcements[0]} · <span className="font-medium text-accent">{announcements[1]}</span></span>
        </div>
      </div>
      <div className="border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Skin Grocer — Ritual · Renew · Reveal" className="h-12 w-auto md:h-14" width={220} height={56} />
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm text-foreground/70 transition-colors hover:text-primary"
                activeProps={{ className: "text-sm text-primary font-medium" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden text-sm text-foreground/70 hover:text-primary md:inline">Sign In</button>
            <Link
              to="/shop"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Join
            </Link>
          </div>
        </div>
      </div>
      {/* Marquee strip */}
      <div className="overflow-hidden border-b border-border bg-secondary py-2 text-xs text-foreground/80">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...announcements, ...announcements, ...announcements, ...announcements].map((a, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 uppercase tracking-[0.18em]">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {a}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <img src={logo} alt="Skin Grocer" className="h-12 w-auto brightness-0 invert" width={220} height={48} />
          <p className="mt-5 max-w-sm text-sm text-background/70">
            Curated authentic K-beauty and premium imports, locally stocked in
            Sydney with same-day delivery across Australia.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-accent">Ritual · Renew · Reveal</p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            <li><Link to="/shop" className="hover:text-accent">All Products</Link></li>
            <li><Link to="/brands" className="hover:text-accent">Brands</Link></li>
            <li><Link to="/skin-concerns" className="hover:text-accent">Skin Concerns</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/journal" className="hover:text-accent">Skin Journal</Link></li>
            <li><Link to="/reviews" className="hover:text-accent">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium">Newsletter</h4>
          <p className="mt-4 text-sm text-background/70">Subscribe for 10% off your first order.</p>
          <form className="mt-3 flex overflow-hidden rounded-full border border-background/30">
            <input type="email" placeholder="you@email.com" className="w-full bg-transparent px-4 py-2 text-sm text-background placeholder:text-background/50 focus:outline-none" />
            <button className="bg-accent px-4 text-xs font-medium uppercase tracking-wider text-foreground hover:opacity-90">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-background/10 py-4 text-center text-xs text-background/50">
        © {new Date().getFullYear()} Skin Grocer · Proudly Australian owned & operated
      </div>
    </footer>
  );
}
