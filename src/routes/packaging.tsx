import { createFileRoute } from "@tanstack/react-router";
import pdf from "@/assets/print/skin-grocer-packaging-peach_v3.pdf.asset.json";
import artwork from "@/assets/print/skin-grocer-packaging-peach_v3.png.asset.json";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/packaging")({
  head: () => ({
    meta: [
      { title: "Soft Peach & Cream Packaging | Skin Grocer" },
      { name: "description", content: "Skin Grocer's soft peach and cream packaging direction with a bilingual logo, real catalogue products and a printable A4 mockup." },
      { property: "og:title", content: "Soft Peach & Cream Packaging | Skin Grocer" },
      { property: "og:description", content: "Soft peach packaging, cream interiors and gold details in a printable A4 mockup." },
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
        <h1 className="font-serif text-2xl text-ink sm:text-3xl">Soft peach & cream — packaging</h1>
        <Button asChild size="lg">
          <a href={pdf.url} download="skin-grocer-packaging-peach_v3.pdf">
            <Download aria-hidden="true" /> Download A4 PDF
          </a>
        </Button>
      </div>
      <img
        src={artwork.url}
        alt="Soft peach Skin Grocer mailer with cream interior, gold bilingual logo, peach-and-cream striped edge, thank-you card and three real catalogue products, with matching print colour swatches."
        width={1132}
        height={1600}
        fetchPriority="high"
        className="block h-auto w-full"
      />
    </main>
  );
}

