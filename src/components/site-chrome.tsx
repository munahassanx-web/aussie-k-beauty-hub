import { NewsletterForm } from "@/components/newsletter-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart";
import logoAsset from "@/assets/skin-grocer-seal.png.asset.json";
const logo = logoAsset.url;

type MegaLink = { label: string; to: string; search?: Record<string, string>; hash?: string };
type MegaSection = {
  heading: string;
  links: MegaLink[];
};

const topLevelLinks: Record<string, MegaLink> = {
  Shop: { label: "Shop", to: "/shop" },
  Concerns: { label: "Concerns", to: "/skin-concerns" },
  Brands: { label: "Brands", to: "/brands" },
};

const megaMenus: Record<string, MegaSection[]> = {
  Shop: [
    {
      heading: "By Category",
      links: [
        { label: "Cleansers", to: "/shop", search: { category: "cleanse" } },
        { label: "Toners & Essences", to: "/shop", search: { category: "tone" } },
        { label: "Serums & Ampoules", to: "/shop", search: { category: "treat" } },
        { label: "Moisturisers", to: "/shop", search: { category: "moisturise" } },
        { label: "Masks & Treatments", to: "/shop", search: { category: "masks" } },
        { label: "Sun Protection", to: "/shop", search: { category: "protect" } },
      ],
    },
    {
      heading: "By Routine",
      links: [
        { label: "AM Routine", to: "/journey" },
        { label: "PM Routine", to: "/journey" },
        { label: "Weekly Treatments", to: "/journey" },
        { label: "Build Mine (Quiz)", to: "/consultation" },
      ],
    },
    {
      heading: "Curated",
      links: [
        { label: "Bestsellers", to: "/shop" },
        { label: "New Arrivals", to: "/shop" },
        { label: "Subscribe & Save", to: "/club" },
        { label: "Bundles", to: "/", hash: "bundles" },
      ],
    },
  ],
  Concerns: [
    {
      heading: "Skin Goals",
      links: [
        { label: "Hydration & Glow", to: "/shop", search: { concern: "hydration" } },
        { label: "Acne & Breakouts", to: "/shop", search: { concern: "acne" } },
        { label: "Pigmentation", to: "/shop", search: { concern: "pigmentation" } },
        { label: "Sensitivity & Redness", to: "/shop", search: { concern: "sensitivity" } },
        { label: "Anti-Ageing", to: "/shop", search: { concern: "anti-aging" } },
        { label: "Barrier Repair", to: "/shop", search: { concern: "barrier" } },
      ],
    },
    {
      heading: "Find Your Routine",
      links: [
        { label: "Take the Routine Consultation", to: "/consultation" },
        { label: "Ingredient Finder", to: "/learn/snail-mucin" },
        { label: "Talk to an Advisor", to: "/contact" },
      ],
    },
  ],
  Brands: [
    {
      heading: "K-Beauty Icons",
      links: [
        { label: "COSRX", to: "/shop", search: { brand: "COSRX" } },
        { label: "Beauty of Joseon", to: "/shop", search: { brand: "Beauty of Joseon" } },
        { label: "Anua", to: "/shop", search: { brand: "Anua" } },
        { label: "SKIN1004", to: "/shop", search: { brand: "SKIN1004" } },
        { label: "Numbuzin", to: "/shop", search: { brand: "Numbuzin" } },
      ],
    },
    {
      heading: "Premium Imports",
      links: [
        { label: "Abib", to: "/shop", search: { brand: "Abib" } },
        { label: "Mediheal", to: "/shop", search: { brand: "Mediheal" } },
        { label: "Some By Mi", to: "/shop", search: { brand: "Some By Mi" } },
        { label: "View All Brands", to: "/brands" },
      ],
    },
  ],
};

const announcements = [
  "Next-day Melbourne dispatch on orders before 12pm* — see footer",
  "Free express AU shipping over $80",
  "Authenticity guaranteed — sourced direct from Korea",
  "30-day glow-or-refund guarantee on every order",
];

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const cart = useCart();

  const closeMenus = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="overflow-hidden bg-primary py-2 text-xs text-primary-foreground">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...announcements, ...announcements].map((a, i) => (
            <span key={i} className="mx-8 inline-flex items-center gap-3 uppercase tracking-[0.22em]">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div
        className="border-b border-border/60 bg-background/95 backdrop-blur"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
          <Link to="/" className="flex items-center" onClick={closeMenus} onMouseEnter={() => setOpenMenu(null)}>
            <img src={logo} alt="Skin Grocer" className="h-12 w-12 md:h-14 md:w-14 object-contain drop-shadow-sm" width={56} height={56} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {Object.keys(megaMenus).map((key) => (
              <div
                key={key}
                className="relative flex items-center gap-1"
                onMouseEnter={() => setOpenMenu(key)}
                onFocus={() => setOpenMenu(key)}
              >
                <Link
                  to={topLevelLinks[key].to}
                  onClick={closeMenus}
                  className={`relative py-2 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors ${
                    openMenu === key ? "text-primary" : "text-foreground/75 hover:text-primary"
                  }`}
                >
                  {key}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-primary transition-all ${
                      openMenu === key ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
                <button
                  type="button"
                  aria-label={`Open ${key} menu`}
                  aria-expanded={openMenu === key}
                  onFocus={() => setOpenMenu(key)}
                  onClick={() => setOpenMenu(key)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-foreground/45 hover:bg-secondary hover:text-primary"
                >
                  <span className="text-[10px] leading-none">⌄</span>
                </button>
              </div>
            ))}
            <Link
              to="/routines"
              onMouseEnter={() => setOpenMenu(null)}
              className="text-[13px] font-medium uppercase tracking-[0.16em] text-foreground/75 underline-grow hover:text-primary"
            >
              Routines
            </Link>
            <Link
              to="/learn/hub"
              onMouseEnter={() => setOpenMenu(null)}
              className="text-[13px] font-medium uppercase tracking-[0.16em] text-foreground/75 underline-grow hover:text-primary"
            >
              Learn
            </Link>
            <Link
              to="/grocery-list"
              onMouseEnter={() => setOpenMenu(null)}
              className="text-[13px] font-medium uppercase tracking-[0.16em] text-foreground/75 underline-grow hover:text-primary"
            >
              Grocery List
            </Link>


          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => { closeMenus(); setSearchOpen(true); }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 hover:bg-secondary hover:text-primary"
            >
              <SearchIcon />
            </button>
            <Link
              to={user ? "/club" : "/auth"}
              onClick={closeMenus}
              aria-label={user ? "Your account" : "Sign in"}
              className="hidden items-center gap-2 rounded-full border border-border px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/80 hover:border-primary hover:text-primary md:inline-flex"
            >
              <UserIcon />
              {user ? "Club" : "Sign in"}
            </Link>
            <button
              type="button"
              onClick={() => { closeMenus(); cart.setOpen(true); }}
              aria-label={`Open basket (${cart.count} items)`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 hover:bg-secondary hover:text-primary"
            >
              <BagIcon />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">{cart.count}</span>
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => { setOpenMenu(null); setMobileOpen((open) => !open); }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 hover:border-primary hover:text-primary lg:hidden"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {openMenu && megaMenus[openMenu] && (
          <div className="hidden border-t border-border/60 bg-background shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] lg:block">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-8 md:grid-cols-4">
              {megaMenus[openMenu].map((section) => (
                <div key={section.heading}>
                  <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                    {section.heading}
                  </h4>
                  <ul className="space-y-2.5">
                    {section.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          to={l.to}
                          search={l.search as never}
                          hash={l.hash}
                          onClick={closeMenus}
                          className="inline-block text-sm text-foreground/80 transition-colors hover:text-primary"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="rounded-2xl bg-secondary p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Featured</p>
                <p className="mt-3 font-display text-xl leading-tight text-foreground">Glass Skin in 4 Steps</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our advisor-built routine for dewy, even-toned skin.
                </p>
                <Link to="/journey" onClick={closeMenus} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Explore the routine →
                </Link>
              </div>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="border-t border-border/60 bg-background lg:hidden">
            <div className="max-h-[calc(100vh-7rem)] overflow-y-auto px-6 py-5">
              <div className="grid gap-3 border-b border-border/60 pb-5">
                {Object.entries(topLevelLinks).map(([key, link]) => (
                  <Link
                    key={key}
                    to={link.to}
                    onClick={closeMenus}
                    className="flex items-center justify-between py-2 font-display text-2xl text-foreground"
                  >
                    {link.label}
                    <span className="text-base text-primary">→</span>
                  </Link>
                ))}
                <Link to={user ? "/club" : "/auth"} onClick={closeMenus} className="flex items-center justify-between py-2 font-display text-2xl text-foreground">
                  {user ? "Restock Club" : "Sign in"}
                  <span className="text-base text-primary">→</span>
                </Link>
                <Link
                  to="/routines"
                  onClick={closeMenus}
                  className="flex items-center justify-between py-2 font-display text-2xl text-foreground"
                >
                  Routine Kits
                  <span className="text-base text-primary">→</span>
                </Link>
                <Link
                  to="/learn/hub"
                  onClick={closeMenus}
                  className="flex items-center justify-between py-2 font-display text-2xl text-foreground"
                >
                  Learn
                  <span className="text-base text-primary">→</span>
                </Link>
                <Link
                  to="/grocery-list"
                  onClick={closeMenus}
                  className="flex items-center justify-between py-2 font-display text-2xl text-foreground"
                >
                  Grocery List
                  <span className="text-base text-primary">→</span>
                </Link>


              </div>

              <div className="mt-5 space-y-6">
                {Object.entries(megaMenus).map(([menu, sections]) => (
                  <div key={menu}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-clay">{menu}</p>
                    <div className="mt-3 grid gap-5 sm:grid-cols-2">
                      {sections.map((section) => (
                        <div key={section.heading}>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{section.heading}</p>
                          <ul className="mt-2 space-y-2">
                            {section.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  to={link.to}
                                  search={link.search as never}
                                  hash={link.hash}
                                  onClick={closeMenus}
                                  className="block py-1 text-sm text-foreground/80 hover:text-primary"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-3xl text-paper">Skin Grocer</p>
          <p className="mt-5 max-w-sm text-sm text-paper/65">
            Melbourne-based curators of authentic K-beauty and premium imports.
            Locally stocked, expertly guided, dispatched the next day.*
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-paper/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-paper/80">
            <span className="h-2 w-2 animate-pulse-ring rounded-full bg-accent" />
            Ships next day from Melbourne*
          </div>
          <p className="mt-4 max-w-sm text-xs text-paper/45">
            *Next-day delivery applies to metro and most regional areas. Remote
            postcodes may take 1–2 extra days.
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Shop</h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link to="/shop" className="hover:text-paper">All Products</Link></li>
            <li><Link to="/brands" className="hover:text-paper">Brands</Link></li>
            <li><Link to="/skin-concerns" className="hover:text-paper">By Concern</Link></li>
            <li><Link to="/routines" className="hover:text-paper">Routine Kits</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Learn</h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link to="/learn/hub" className="hover:text-paper">Learn Hub</Link></li>
            <li><Link to="/grocery-list" className="hover:text-paper">The Skin Grocery List</Link></li>
            <li><Link to="/learn" className="hover:text-paper">Ingredients A–Z</Link></li>
            <li><Link to="/about" className="hover:text-paper">About Us</Link></li>
            <li><Link to="/reviews" className="hover:text-paper">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
            <li><Link to="/track" className="hover:text-paper">Track your order</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Legal</h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link to="/shipping-policy" className="hover:text-paper">Shipping Policy</Link></li>
            <li><Link to="/returns-policy" className="hover:text-paper">Returns & Refund Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-paper">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">The Drop</h4>
          <p className="mt-5 text-sm text-paper/70">
            Restocks, new arrivals, ritual notes. No spam, ever.
          </p>
          <NewsletterForm source="footer" variant="dark" />
          <p className="mt-3 text-xs text-paper/45">By subscribing you agree to our Privacy Policy.</p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-paper/50 md:flex-row">
          <p>© {new Date().getFullYear()} Skin Grocer Pty Ltd — Melbourne, Australia · ABN {import.meta.env.VITE_COMPANY_ABN || "xx xxx xxx xxx"}</p>
          <div className="flex gap-5">
            <span>Shipping & Returns</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
