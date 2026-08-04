import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Voiceover AI — Free AI Voiceover for Short Videos",
    template: "%s | Voiceover AI",
  },
  description:
    "Turn text into natural AI voiceovers for TikTok, Reels, and YouTube Shorts. No signup needed. Also: private PDF summarizer, 100% browser-based.",
  keywords: [
    "AI voiceover",
    "text to speech",
    "TikTok voiceover",
    "AI narrator",
    "free TTS",
    "PDF summarizer",
  ],
  alternates: {
    canonical: "https://voiceover.getfitai.io",
  },
  openGraph: {
    type: "website",
    siteName: "Voiceover AI",
    title: "Voiceover AI — Free AI Voiceover for Short Videos",
    description:
      "Turn text into natural AI voiceovers for TikTok, Reels, and YouTube Shorts. No signup needed.",
    url: "https://voiceover.getfitai.io",
    images: [{
      url: "https://voiceover.getfitai.io/og-image.svg",
      width: 1200,
      height: 630,
      alt: "Voiceover AI — Free AI Voiceover for Short Videos",
    }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S8841LSJ66"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S8841LSJ66');`}
        </Script>
      </head>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Providers>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Voiceover AI",
          url: "https://voiceover.getfitai.io",
          description: "Free AI voiceover generator for short videos. Text-to-speech, voice cloning, and private PDF summarizer.",
          foundingDate: "2026",
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Voiceover AI",
          url: "https://voiceover.getfitai.io",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://voiceover.getfitai.io/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}
