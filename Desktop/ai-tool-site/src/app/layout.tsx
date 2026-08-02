import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
  openGraph: {
    type: "website",
    siteName: "Voiceover AI",
    title: "Voiceover AI — Free AI Voiceover for Short Videos",
    description:
      "Turn text into natural AI voiceovers for TikTok, Reels, and YouTube Shorts. No signup needed.",
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
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
