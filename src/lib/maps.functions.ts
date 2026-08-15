import { createServerFn } from "@tanstack/react-start";

export const getMapsApiKey = createServerFn({ method: "GET" }).handler(
  async () => {
    // Prefer the user-supplied key for custom-domain usage (skingrocer.com.au).
    // Falls back to the managed Lovable Google Maps connector key for previews.
    return (
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY ||
      ""
    );
  }
);
