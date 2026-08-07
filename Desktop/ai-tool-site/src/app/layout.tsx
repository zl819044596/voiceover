import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Voiceover AI — Free AI Voiceover for Short Videos",
    template: "%s | Voiceover AI",
  },
  description:
    "Turn text into natural AI voiceovers and multi-speaker dialogues for TikTok, Reels, and YouTube Shorts. 17 natural voices, voice cloning, and AI script polish. Free — no signup needed.",
  keywords: [
    "AI voiceover",
    "text to speech",
    "multi-speaker dialogue",
    "multi-speaker text to speech",
    "voice cloning",
    "TikTok voiceover",
    "AI narrator",
    "free TTS",
    "video voiceover generator",
    "AI voice generator",
    "text to speech online",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "Voiceover AI",
    title: "Voiceover AI — Free AI Voiceover for Short Videos",
    description:
      "Turn text into natural AI voiceovers and multi-speaker dialogues for TikTok, Reels, and YouTube Shorts. 17 natural voices, voice cloning. No signup needed.",
    url: SITE_URL,
    images: [{
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "Voiceover AI — Free AI Voiceover for Short Videos",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voiceover AI — Free AI Voiceover for Short Videos",
    description:
      "Turn text into natural AI voiceovers and multi-speaker dialogues for TikTok, Reels, and YouTube Shorts. No signup needed.",
    images: [`${SITE_URL}/og-image.png`],
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
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2N7QYREJNW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2N7QYREJNW');`}
        </Script>
      </head>
      <body className="flex min-h-full flex-col bg-ink text-gray-900" style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}>
        <Providers>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Voiceover AI",
          url: SITE_URL,
          logo: `${SITE_URL}/og-image.png`,
          description: "Free AI voiceover generator for short videos. Text-to-speech, voice cloning, and AI script polish.",
          foundingDate: "2026",
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Voiceover AI",
          url: SITE_URL,
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Voiceover AI",
          url: SITE_URL,
          description:
            "Free AI voiceover generator for short videos. Turn text into natural voiceovers for TikTok, Reels, and YouTube Shorts.",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            url: `${SITE_URL}/pricing`,
          },
          featureList: [
            "17 natural voices",
            "AI script polish",
            "Voice cloning",
            "Multi-language text-to-speech",
            "MP3 download",
          ],
        }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}
