import type { Metadata } from "next";

const DIALOGUE_URL = "https://voiceover.getfitai.io/voiceover/dialogue";

export const metadata: Metadata = {
  title: "Multi-Speaker Dialogue Voiceover",
  description:
    "Create multi-speaker dialogue voiceovers with AI. Assign different voices to each speaker, generate a full conversation, and download as one MP3. Free — no signup required.",
  alternates: { canonical: DIALOGUE_URL },
  openGraph: {
    title: "Multi-Speaker Dialogue Voiceover | Voiceover AI",
    description:
      "Create multi-speaker dialogue voiceovers with AI. Assign different voices to each speaker, generate a full conversation, and download as one MP3.",
    url: DIALOGUE_URL,
  },
};

export default function DialogueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
