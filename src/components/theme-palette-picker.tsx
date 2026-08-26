import { useEffect, useState } from "react";
import { Check, Palette, RotateCcw } from "lucide-react";

type SiteTheme = "signature" | "matcha" | "ocean" | "blossom" | "amber" | "lavender";

const STORAGE_KEY = "sg-site-theme";

const THEMES: {
  id: SiteTheme;
  label: string;
  description: string;
  swatches: [string, string, string];
}[] = [
  {
    id: "signature",
    label: "Signature Navy",
    description: "Clean white, charcoal navy, pale gold",
    swatches: ["oklch(0.995 0 0)", "oklch(0.22 0.018 265)", "oklch(0.92 0.02 90)"],
  },
  {
    id: "matcha",
    label: "Jeju Matcha",
    description: "Cream, botanical green, champagne gold",
    swatches: ["oklch(0.985 0.012 95)", "oklch(0.26 0.05 140)", "oklch(0.82 0.14 90)"],
  },
  {
    id: "ocean",
    label: "Ocean Glow",
    description: "Seafoam, deep teal, fresh mint",
    swatches: ["oklch(0.985 0.012 190)", "oklch(0.25 0.06 210)", "oklch(0.84 0.10 170)"],
  },
  {
    id: "blossom",
    label: "Cherry Blossom",
    description: "Soft blush, plum, rose gold",
    swatches: ["oklch(0.985 0.012 20)", "oklch(0.26 0.07 340)", "oklch(0.84 0.11 40)"],
  },
  {
    id: "amber",
    label: "Seoul Amber",
    description: "Warm porcelain, roasted brown, golden amber",
    swatches: ["oklch(0.985 0.015 95)", "oklch(0.25 0.06 55)", "oklch(0.84 0.15 90)"],
  },
  {
    id: "lavender",
    label: "Cloud Lavender",
    description: "Cool porcelain, violet ink, lilac",
    swatches: ["oklch(0.985 0.01 310)", "oklch(0.26 0.06 290)", "oklch(0.84 0.09 320)"],
  },
];

function isPreviewHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("id-preview--") ||
    hostname.includes("-dev.lovable.app") ||
    hostname.endsWith(".lovableproject.com")
  );
}

function savedTheme(): SiteTheme {
  if (typeof window === "undefined") return "signature";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return THEMES.some((theme) => theme.id === saved) ? (saved as SiteTheme) : "signature";
}

/**
 * Owner-facing theme preview control. It applies a saved palette to the shared
 * design tokens across every page, but only renders its UI on preview/dev hosts
 * so customers never see an internal design tool.
 */
export function ThemePalettePicker() {
  const [theme, setTheme] = useState<SiteTheme>("signature");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const initial = savedTheme();
    setTheme(initial);
    document.documentElement.dataset.siteTheme = initial;
    setVisible(isPreviewHost(window.location.hostname));
  }, []);

  const choose = (next: SiteTheme) => {
    setTheme(next);
    document.documentElement.dataset.siteTheme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  if (!visible) return null;

  const active = THEMES.find((item) => item.id === theme) ?? THEMES[0];

  return (
    <div className="fixed bottom-16 left-4 z-[300] font-body">
      <div
        className={`mb-2 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-md transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
        role="radiogroup"
        aria-label="Preview site colour palettes"
      >
        <div className="border-b border-border px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Site palette preview
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Applies instantly across pages and is remembered in this browser.
          </p>
        </div>
        <div className="max-h-[45vh] space-y-1 overflow-y-auto p-2">
          {THEMES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={theme === item.id}
              onClick={() => choose(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                theme === item.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <span className="flex -space-x-1.5" aria-hidden="true">
                {item.swatches.map((swatch) => (
                  <span
                    key={swatch}
                    className="h-6 w-6 rounded-full border border-background shadow-sm"
                    style={{ background: swatch }}
                  />
                ))}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold">{item.label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{item.description}</span>
              </span>
              {theme === item.id && <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => choose("signature")}
          className="flex w-full items-center justify-center gap-2 border-t border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset to signature
        </button>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`Preview site palette. Current palette: ${active.label}`}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-lg transition hover:bg-secondary"
      >
        <Palette className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span>{active.label}</span>
      </button>
    </div>
  );
}
