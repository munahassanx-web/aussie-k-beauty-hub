import { createFileRoute } from "@tanstack/react-router";
import pdf from "@/assets/print/skin-grocer-packaging-page_v2.pdf.asset.json";
import artwork from "@/assets/print/skin-grocer-packaging-page_v2.png.asset.json";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/packaging")({
  head: () => ({
    meta: [
      { title: "Packaging — The Grocer Stripe | Skin Grocer" },
      { name: "description", content: "Skin Grocer's navy-and-cream stripe packaging: mailer box, tissue, seal sticker and thank-you card, with a print-ready PDF." },
      { property: "og:title", content: "Packaging — The Grocer Stripe | Skin Grocer" },
      { property: "og:description", content: "Navy-and-cream stripe packaging with a print-ready PDF mockup." },
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
        <h1 className="font-serif text-2xl text-ink sm:text-3xl">The Grocer Stripe — packaging</h1>
        <Button asChild size="lg">
          <a href={pdf.url} download="skin-grocer-packaging-page_v2.pdf">
            <Download aria-hidden="true" /> Download A4 PDF
          </a>
        </Button>
      </div>
      <img
        src={artwork.url}
        alt="Skin Grocer packaging mockup with the real bilingual logo, navy-and-cream scalloped website stripe, branded tissue, thank-you card, navy brand sticker and six real product cards."
        width={1323}
        height={1871}
        fetchPriority="high"
        className="block h-auto w-full"
      />
    </main>
  );
}

