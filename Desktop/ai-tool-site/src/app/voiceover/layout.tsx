import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Voiceover Studio",
  description:
    "Create professional AI voiceovers for TikTok, Reels, and YouTube Shorts. Choose from 16+ natural voices, adjust speed and pitch. Free — no signup required.",
  alternates: { canonical: "https://voiceover.getfitai.io/voiceover" },
  openGraph: {
    title: "AI Voiceover Studio | Voiceover AI",
    description:
      "Create professional AI voiceovers for TikTok, Reels, and YouTube Shorts. Choose from 16+ natural voices, adjust speed and pitch. Free — no signup required.",
  },
};

export default function VoiceoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
