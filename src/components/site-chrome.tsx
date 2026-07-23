import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import logoAsset from "@/assets/skin-grocer-seal.png.asset.json";
const logo = logoAsset.url;

type MegaSection = {
  heading: string;
  links: { label: string; to: string }[];
};

const megaMenus: Record<string, MegaSection[]> = {
  Shop: [
    {
      heading: "By Category",
      links: [
        { label: "Cleansers", to: "/shop" },
        { label: "Toners & Essences", to: "/shop" },
        { label: "Serums & Ampoules", to: "/shop" },
        { label: "Moisturisers", to: "/shop" },
        { label: "Masks & Treatments", to: "/shop" },
        { label: "Sun Protection", to: "/shop" },
      ],
    },
    {
      heading: "By Routine",
      links: [
        { label: "AM Routine", to: "/journey" },
        { label: "PM Routine", to: "/journey" },
        { label: "Weekly Rituals", to: "/journey" },
        { label: "Travel Edits", to: "/shop" },
      ],
    },
    {
      heading: "Curated",
      links: [
        { label: "Bestsellers", to: "/shop" },
        { label: "New Arrivals", to: "/shop" },
        { label: "Subscribe & Save", to: "/shop" },
        { label: "Bundles", to: "/shop" },
      ],
    },
  ],
  Concerns: [
    {
      heading: "Skin Goals",
      links: [
        { label: "Hydration & Glow", to: "/skin-concerns" },
        { label: "Acne & Breakouts", to: "/skin-concerns" },
        { label: "Pigmentation", to: "/skin-concerns" },
        { label: "Sensitivity & Redness", to: "/skin-concerns" },
        { label: "Anti-Ageing", to: "/skin-concerns" },
        { label: "Barrier Repair", to: "/skin-concerns" },
      ],
    },
    {
      heading: "Find Your Routine",
      links: [
        { label: "Take the Skin Quiz", to: "/skin-concerns" },
        { label: "Ingredient Finder", to: "/journal" },
        { label: "Talk to an Advisor", to: "/contact" },
      ],
    },
  ],
  Brands: [
    {
      heading: "K-Beauty Icons",
      links: [
        { label: "COSRX", to: "/brands" },
        { label: "Beauty of Joseon", to: "/brands" },
        { label: "Anua", to: "/brands" },
        { label: "Round Lab", to: "/brands" },
        { label: "Skin1004", to: "/brands" },
      ],
    },
    {
      heading: "Premium Imports",
      links: [
        { label: "Sulwhasoo", to: "/brands" },
        { label: "Hera", to: "/brands" },
        { label: "Tirtir", to: "/brands" },
        { label: "View All Brands", to: "/brands" },
      ],
    },
  ],
  Learn: [
    {
      heading: "Skin Journal",
      links: [
        { label: "Ingredient Guides", to: "/journal" },
        { label: "Routine Building", to: "/journey" },
        { label: "Korean Skincare 101", to: "/journal" },
        { label: "Sunscreen in Australia", to: "/journal" },
      ],
    },
    {
      heading: "About Skin Grocer",
      links: [
        { label: "Our Story", to: "/about" },
        { label: "Authenticity Promise", to: "/about" },
        { label: "Reviews", to: "/reviews" },
        { label: "Vending Partnerships", to: "/contact" },
      ],
    },
  ],
};

const announcements = [
  "Next-day Melbourne dispatch on orders before 2pm",
  "Free express AU shipping over $80",
  "Authenticity guaranteed — sourced direct from Korea",
  "10% off first order with code GLOW10",
];

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user } = useAuth();

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
          <Link to="/" className="flex items-center" onMouseEnter={() => setOpenMenu(null)}>
            <img src={logo} alt="Skin Grocer" className="h-12 w-12 md:h-14 md:w-14 object-contain drop-shadow-sm" width={56} height={56} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {Object.keys(megaMenus).map((key) => (
              <button
                key={key}
                onMouseEnter={() => setOpenMenu(key)}
                onFocus={() => setOpenMenu(key)}
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
              </button>
            ))}
            <Link
              to="/journal"
              onMouseEnter={() => setOpenMenu(null)}
              className="text-[13px] font-medium uppercase tracking-[0.16em] text-foreground/75 underline-grow hover:text-primary"
            >
              Journal
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/70 hover:bg-secondary hover:text-primary md:flex"
            >
              <SearchIcon />
            </button>
            <Link
              to="/contact"
              aria-label="Account"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/70 hover:bg-secondary hover:text-primary md:flex"
            >
              <UserIcon />
            </Link>
            <button
              aria-label="Bag"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 hover:bg-secondary hover:text-primary"
            >
              <BagIcon />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">0</span>
            </button>
          </div>
        </div>

        {/* Mega panel */}
        {openMenu && megaMenus[openMenu] && (
          <div
            className="absolute left-0 right-0 hidden border-t border-border/60 bg-background/98 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] backdrop-blur-md lg:block"
            onMouseEnter={() => setOpenMenu(openMenu)}
          >
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-10 md:grid-cols-4">
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
                <p className="mt-3 font-display text-xl leading-tight text-foreground">
                  Glass Skin in 4 Steps
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our advisor-built routine for dewy, even-toned skin.
                </p>
                <Link to="/journey" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Explore the routine →
                </Link>
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
            Locally stocked, expertly guided, dispatched the next day.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-paper/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-paper/80">
            <span className="h-2 w-2 animate-pulse-ring rounded-full bg-accent" />
            Ships next day from Melbourne
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Shop</h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link to="/shop" className="hover:text-paper">All Products</Link></li>
            <li><Link to="/brands" className="hover:text-paper">Brands</Link></li>
            <li><Link to="/skin-concerns" className="hover:text-paper">By Concern</Link></li>
            <li><Link to="/journey" className="hover:text-paper">Routines</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Learn</h4>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link to="/journal" className="hover:text-paper">Skin Journal</Link></li>
            <li><Link to="/about" className="hover:text-paper">About Us</Link></li>
            <li><Link to="/reviews" className="hover:text-paper">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">The Drop</h4>
          <p className="mt-5 text-sm text-paper/70">
            Restocks, new arrivals, ritual notes. No spam, ever.
          </p>
          <form className="mt-4 flex overflow-hidden rounded-full border border-paper/25">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-transparent px-5 py-3 text-sm text-paper placeholder:text-paper/40 focus:outline-none"
            />
            <button className="bg-accent px-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-accent/85">
              Join
            </button>
          </form>
          <p className="mt-3 text-xs text-paper/45">By subscribing you agree to our Privacy Policy.</p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-paper/50 md:flex-row">
          <p>© {new Date().getFullYear()} Skin Grocer Pty Ltd — Melbourne, Australia · ABN xx xxx xxx xxx</p>
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
