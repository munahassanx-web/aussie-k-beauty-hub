import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

/**
 * One-click "Refresh preview" control for preview/dev hosts only.
 * Clears HTTP caches + service workers and hard-reloads with a
 * cache-busting query param so the latest build and images load.
 * Never rendered on the production/custom domain.
 */
function isPreviewHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("id-preview--") ||
    hostname.includes("-dev.lovable.app") ||
    hostname.endsWith(".lovableproject.com")
  );
}

export function PreviewRefreshButton() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setVisible(isPreviewHost(window.location.hostname));
  }, []);

  if (!visible) return null;

  const refresh = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Best-effort: unregister service workers and clear Cache Storage.
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {
      // Continue to reload regardless.
    }
    const url = new URL(window.location.href);
    url.searchParams.set("_cb", Date.now().toString(36));
    window.location.replace(url.toString());
  };

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={busy}
      aria-label="Refresh preview to the latest build"
      className="fixed bottom-4 left-4 z-[300] inline-flex items-center gap-2 rounded-full border border-border bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
      {busy ? "Refreshing…" : "Refresh preview"}
    </button>
  );
}
