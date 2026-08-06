import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

const blogPosts = {
  "viral-tiktok-voiceovers-ai": {
    title: "How to Create Viral TikTok Voiceovers with AI",
    date: "2026-08-01",
    content: "Creating viral TikTok content requires more than just good visuals — the voiceover can make or break your video. AI voiceover tools have revolutionized how creators produce content, allowing you to generate professional-quality narration in seconds.\\n\\n## Why Voiceover Matters on TikTok\\n\\nTikTok is a audio-first platform. Users often scroll with sound on, and a compelling voiceover can grab attention in the first 2 seconds. The right voice sets the tone, builds trust, and keeps viewers watching.\\n\\n## How AI Voiceover Tools Help\\n\\nWith AI voiceover tools like Voiceover AI, you can:\\n\\n- **Choose from 17 natural voices** — male, female, and specialty styles\\n- **Adjust speed and pitch** — match the energy of your content\\n- **Add emotional nuance** — happy, excited, serious, or warm tones\\n- **Polish your script** — AI-powered script optimization for short video pacing\\n\\n## Tips for Viral TikTok Voiceovers\\n\\n1. **Hook in the first 3 seconds** — Start with a question or surprising statement\\n2. **Keep it conversational** — Write like you're talking to a friend\\n3. **Use emotional variety** — Don't be monotone; vary your energy\\n4. **End with a CTA** — Tell viewers what to do next (follow, comment, share)\\n\\nStart creating your AI voiceovers today at Voiceover AI — no signup required.",
  },
  "tts-vs-voice-cloning": {
    title: "Text-to-Speech vs. Voice Cloning: Which Is Right for Your Content?",
    date: "2026-07-25",
    content: "When creating video content, you have two main options for AI narration: traditional text-to-speech (TTS) and voice cloning. Each has its strengths, and the right choice depends on your content strategy.\\n\\n## Text-to-Speech (TTS)\\n\\nTTS converts written text into spoken audio using pre-built voices. Our platform offers 17 natural voices across different styles and genders.\\n\\n**Best for:**\\n- Quick turnaround content\\n- Multiple voice characters\\n- Consistent brand voice\\n- Budget-conscious creators\\n\\n## Voice Cloning\\n\\nVoice cloning creates a custom voice model from a 10-second audio sample. Your unique voice can narrate any content.\\n\\n**Best for:**\\n- Personal brand consistency\\n- Long-form content series\\n- Creators who want \\\"their\\\" voice everywhere\\n\\n## Which Should You Choose?\\n\\nFor most short-form content creators, TTS is the faster, more flexible option. Voice cloning shines when you're building a personal brand and want consistent audio across all your content.",
  },
  "short-video-script-tips": {
    title: "10 Tips for Better Short Video Scripts",
    date: "2026-07-18",
    content: "The script is the backbone of any great short video. Here are 10 tips to write scripts that hook viewers and keep them watching.\\n\\n## 1. Start with a Hook\\n\\nThe first 3 seconds are critical. Start with a question, surprising fact, or bold statement.\\n\\n## 2. Keep It Short\\n\\nShort videos need short sentences. Aim for 15-60 seconds of narration.\\n\\n## 3. Write for the Ear\\n\\nRead your script aloud. If it sounds unnatural, rewrite it.\\n\\n## 4. Use Emotional Variety\\n\\nMix excitement, curiosity, and urgency to keep viewers engaged.\\n\\n## 5. Add a Clear CTA\\n\\nTell viewers what to do: follow, comment, share, or visit your link.\\n\\n## 6. Use Active Voice\\n\\nActive voice is more engaging than passive voice.\\n\\n## 7. Create a Rhythm\\n\\nVary sentence length. Short punchy sentences mixed with longer ones create rhythm.\\n\\n## 8. Ask Questions\\n\\nRhetorical questions engage viewers and make them think.\\n\\n## 9. Use Numbers and Lists\\n\\n\\\"3 tips\\\" or \\\"5 ways\\\" perform better than vague promises.\\n\\n## 10. End Strong\\n\\nYour last line should be memorable. A call to action, a punchline, or a cliffhanger.",
  },
  "privacy-first-ai-tools": {
    title: "Why Privacy-First AI Tools Are the Future",
    date: "2026-07-10",
    content: "As AI tools become part of everyday content creation, privacy matters more than ever. Here's how to think about privacy when choosing AI tools — and what creators should look for.\\n\\n## Why Privacy Matters for Creators\\n\\nYour scripts, ideas, and drafts are your intellectual property. When you use an AI tool, you should know exactly what happens to your content:\\n\\n- Is an account required just to try the tool?\\n- What data does the tool collect, and why?\\n- How long is your data kept?\\n- Is your content used to train models?\\n\\n## What to Look For in AI Tools\\n\\n1. **No unnecessary signup** — the fewer accounts you create, the smaller your data trail\\n2. **Clear data policies** — tools should explain what they collect in plain language\\n3. **Data minimization** — only collect what's needed to deliver the service\\n4. **Transparent retention** — you should know how long your data is kept\\n\\n## How Voiceover AI Approaches Privacy\\n\\nVoiceover AI is built for creators who care about their content:\\n\\n- **No signup required on the free tier** — generate voiceovers without creating an account\\n- **Clear character limits** — you always know exactly how much you can create\\n- **Transparent pricing** — free, Pro, Lifetime, and Business plans with no surprise charges\\n- **You own your creations** — download your voiceovers as MP3 files, watermark-free\\n\\n## The Future\\n\\nAs privacy regulations tighten and creators become more aware of how their data is handled, tools that respect user privacy will have a competitive advantage. Choosing tools that are transparent about their data practices isn't just good hygiene — it's a smart business decision.",
  },
};

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug as keyof typeof blogPosts];
  if (!post) return {};
  return {
    title: post.title,
    description: `Read "${post.title}" — tips and insights for content creators using AI voiceover tools.`,
    alternates: { canonical: `https://voiceover.getfitai.io/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug as keyof typeof blogPosts];
  if (!post) return <div className="mx-auto max-w-3xl px-4 py-16"><h1 className="text-2xl font-bold">Post not found</h1></div>;

  const paragraphs = post.content.split("\n\n");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/blog" className="text-sm text-purple-600 hover:underline">← Back to Blog</Link>
      <article className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <p className="mt-2 text-sm text-gray-400">{post.date}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-gray-600">
          {paragraphs.map((p, i) => {
            if (p.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-semibold text-gray-900 mt-8">{p.replace("## ", "")}</h2>;
            }
            if (p.startsWith("- ")) {
              return <ul key={i} className="list-disc pl-5 space-y-1">{p.split("\n").map((line, j) => (
                <li key={j}>{line.replace("- ", "")}</li>
              ))}</ul>;
            }
            return <p key={i}>{p}</p>;
          })}
        </div>
      </article>
      <div className="mt-10 border-t border-gray-100 pt-6">
        <Link
          href="/voiceover"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          Try AI Voiceover Free <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
