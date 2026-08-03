import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDFLens — Private On-Device PDF AI Summarizer",
  description:
    "AI-powered PDF summaries right in your browser. 100% private — your files never leave your device. No signup, no upload, no server.",
  openGraph: {
    title: "PDFLens — Private On-Device PDF AI Summarizer",
    description:
      "AI-powered PDF summaries right in your browser. 100% private, on-device AI via WebGPU.",
    url: "https://pdflens.pages.dev",
    siteName: "PDFLens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFLens — Private On-Device PDF AI",
    description:
      "AI-powered PDF summaries right in your browser. 100% private.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}
