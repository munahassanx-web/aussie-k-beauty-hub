import { createFileRoute } from "@tanstack/react-router";
import pdf from "@/assets/print/skin-grocer-packaging-rose_v1.pdf.asset.json";
import artwork from "@/assets/print/skin-grocer-packaging-rose_v1.png.asset.json";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/packaging")({
  head: () => ({
    meta: [
      { title: "Rose & Gold Box Mockup | Skin Grocer" },
      { name: "description", content: "Skin Grocer's rose-and-gold box mockup with the bilingual logo, real product cards and a matching printable A4 PDF." },
      { property: "og:title", content: "Rose & Gold Box Mockup | Skin Grocer" },
      { property: "og:description", content: "Rose-and-gold packaging, real catalogue products and matching printable artwork." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CorrectedPackagingPage,
});

function CorrectedPackagingPage() {
  return (
    <main className="packaging-page mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-ink sm:text-3xl">Rose & gold — box mockup</h1>
        <Button asChild size="lg">
          <a href={pdf.url} download="skin-grocer-packaging-rose_v1.pdf">
            <Download aria-hidden="true" /> Download A4 PDF
          </a>
        </Button>
      </div>
      <img
        src={artwork.url}
        alt="Rose-and-gold Skin Grocer gift box with bilingual logo, rose tissue, cream thank-you card, Beauty of Joseon Glow Serum, Torriden DIVE-IN Serum and Round Lab Dokdo Cleanser product cards, and print colour swatches."
        width={1132}
        height={1600}
        fetchPriority="high"
        className="block h-auto w-full"
      />
    </main>
  );
}

