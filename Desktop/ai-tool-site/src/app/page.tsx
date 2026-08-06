import Link from "next/link";
import { Mic, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/json-ld";

const faqs = [
  {
    q: "Voiceover AI 免费吗？",
    a: "免费。无需注册即可使用，免费套餐每月 10,000 字符。需要更高字符额度或 API 访问权限时，再按需升级付费套餐。",
  },
  {
    q: "支持哪些语言？",
    a: "中文（普通话）效果最佳，同时支持英语、日语、韩语、德语、法语、西班牙语、意大利语、俄语等文字的朗读。",
  },
  {
    q: "生成的配音可以商用吗？",
    a: "可以。所有套餐生成的 MP3 均无水印，可自由用于 TikTok、抖音、YouTube 等平台的视频，包括商业用途。",
  },
  {
    q: "如何下载 MP3？",
    a: "配音生成完成后，点击「下载 MP3」按钮即可导出音频文件，所有套餐均支持无水印 MP3 下载。",
  },
  {
    q: "多角色对白怎么用？",
    a: "进入「多角色对白」页面，为每位说话人分配不同的音色，输入各自的台词，即可生成一段完整的多人对话并合并为一个 MP3。",
  },
  {
    q: "语音克隆怎么用？",
    a: "上传一段 10–30 秒的清晰人声音频（MP3/WAV），即可克隆该声音，保持品牌一致的配音风格。",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      }} />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
              <Sparkles className="h-4 w-4" />
              No signup required
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              AI Voiceover for{" "}
              <span className="text-purple-600">Short Videos</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-500 sm:text-xl">
              Turn any text into natural, professional AI voiceovers in seconds.
              Perfect for TikTok, Reels, and YouTube Shorts. No signup, no hassle.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/voiceover"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-purple-700 transition-colors sm:w-auto"
              >
                Try Free Voiceover
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Mic className="h-6 w-6" />}
              title="17 Natural Voices"
              description="Choose from male, female, and specialty voices. Adjust speed and volume to match your video style perfectly."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="AI Script Polish"
              description="Input rough text, get a polished, conversational script ready for voiceover. Optimized for short video pacing."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Voice Cloning"
              description="Upload a 10-second audio sample, clone any voice. Perfect for consistent brand voice across all your videos."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Multi-language Support"
              description="Translate and voiceover in English, Spanish, French, German, Japanese, Korean, and more."
            />
            <FeatureCard
              icon={<ArrowRight className="h-6 w-6" />}
              title="API Access"
              description="Pro users get full API access. Integrate AI voiceover directly into your content workflow and tools."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            常见问题
          </h2>
          <p className="mt-4 text-center text-lg text-gray-500">
            关于 Voiceover AI，你可能想知道的都在这里。
          </p>
          <dl className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <dt className="text-base font-semibold text-gray-900">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-600 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to level up your videos?
          </h2>
          <p className="mt-4 text-lg text-purple-100">
            Start creating professional AI voiceovers today. No credit card required.
          </p>
          <Link
            href="/voiceover"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}
