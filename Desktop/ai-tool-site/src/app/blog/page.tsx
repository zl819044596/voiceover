import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and insights for content creators using AI voiceover tools. Learn how to create better short-form video content.",
  alternates: { canonical: "https://voiceover.getfitai.io/blog" },
};

const posts = [
  {
    title: "How to Create Viral TikTok Voiceovers with AI",
    slug: "viral-tiktok-voiceovers-ai",
    excerpt:
      "Learn how AI voiceover tools can help you create engaging TikTok content faster and more consistently.",
    date: "2026-08-01",
    readTime: "4 min read",
  },
  {
    title: "Text-to-Speech vs. Voice Cloning: Which Is Right for Your Content?",
    slug: "tts-vs-voice-cloning",
    excerpt:
      "Compare TTS and voice cloning technologies to find the best fit for your video content strategy.",
    date: "2026-07-25",
    readTime: "6 min read",
  },
  {
    title: "10 Tips for Better Short Video Scripts",
    slug: "short-video-script-tips",
    excerpt:
      "Write scripts that hook viewers in the first 3 seconds and keep them watching until the end.",
    date: "2026-07-18",
    readTime: "5 min read",
  },
  {
    title: "Why Privacy-First AI Tools Are the Future",
    slug: "privacy-first-ai-tools",
    excerpt:
      "As AI becomes ubiquitous, tools that respect user privacy are gaining traction. Here's why.",
    date: "2026-07-10",
    readTime: "3 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-gray-500">
        Tips, guides, and insights for content creators.
      </p>

      <div className="mt-10 space-y-10">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-gray-200 pb-8">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {post.excerpt}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-600"
            >
              Read more
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
