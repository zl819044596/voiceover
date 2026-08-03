import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private PDF Summarizer",
  description:
    "Summarize PDFs privately in your browser with zero server uploads. 100% client-side AI extracts key points and summaries from your documents instantly.",
  alternates: { canonical: "https://voiceover-ai.pages.dev/pdf" },
  openGraph: {
    title: "Private PDF Summarizer | Voiceover AI",
    description:
      "Summarize PDFs privately in your browser with zero server uploads. 100% client-side AI extracts key points and summaries from your documents instantly.",
  },
};

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
