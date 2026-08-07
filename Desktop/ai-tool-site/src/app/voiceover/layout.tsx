import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

const TOOL_URL = "https://voiceover.getfitai.io/voiceover";

export const metadata: Metadata = {
  title: "AI Voiceover Studio",
  description:
    "Create professional AI voiceovers for TikTok, Reels, and YouTube Shorts. Choose from 17 natural voices, adjust speed and pitch. Free — no signup required.",
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "AI Voiceover Studio | Voiceover AI",
    description:
      "Create professional AI voiceovers for TikTok, Reels, and YouTube Shorts. Choose from 17 natural voices, adjust speed and pitch. Free — no signup required.",
    url: TOOL_URL,
  },
};

export default function VoiceoverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Voiceover AI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Voiceover AI is a free AI voiceover generator that turns text into natural-sounding speech for TikTok, Reels, and YouTube Shorts. It includes AI script polish, voice cloning, and multi-language text-to-speech.",
            },
          },
          {
            "@type": "Question",
            name: "Is Voiceover AI free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The free plan gives you 10,000 characters per month with no signup required. Paid plans (Pro and Lifetime) offer higher character limits.",
            },
          },
          {
            "@type": "Question",
            name: "How many natural voices are available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Voiceover AI offers 17 preset natural voices in Mandarin Chinese — male, female, and child — powered by a multi-language model that can also read English, Japanese, Korean, German, French, Spanish, Italian, and Russian text.",
            },
          },
          {
            "@type": "Question",
            name: "Can I clone my own voice?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Upload a 10-second audio sample to clone a voice, perfect for keeping a consistent brand voice across all your videos.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to create an account?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The free tier works without signup. You only need an account when you purchase a paid plan to unlock higher character limits and API access.",
            },
          },
          {
            "@type": "Question",
            name: "What audio formats can I download?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can download your voiceovers as MP3 files, with no watermark on any plan.",
            },
          },
        ],
      }} />
      {children}
    </>
  );
}
