import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  AudioWaveform,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  Download,
  Fingerprint,
  Languages,
  Mic,
  MonitorPlay,
  Podcast,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { JsonLd } from "@/components/json-ld";

// The six FAQ Q&As mirror the FAQPage JSON-LD below — keep both in sync.
const faqs = [
  {
    q: "免费版能用吗？",
    a: "能。免费版每月 10,000 字符额度，无需注册即可使用。字符用完后升级 Pro 或 Lifetime 获得更多额度。",
  },
  {
    q: "支持哪些语言？",
    a: "中文普通话 + 英语、日语、韩语、德语、法语、西班牙语、意大利语、俄语，共 9 种。CosyVoice-V2 是多语言模型，同一个音色可以朗读任意语言。",
  },
  {
    q: "生成的语音能商用吗？",
    a: "可以。所有套餐生成的 MP3 均无水印、可下载，可自由用于 TikTok、抖音、YouTube 等平台的视频，包括商业用途。",
  },
  {
    q: "多角色对白怎么用？",
    a: "进入「多角色对白」页面，为每位说话人分配一个音色、填入台词（或让 AI 自动生成台词），一键生成并合并成一条音频。",
  },
  {
    q: "语音克隆怎么用？",
    a: "上传一段 10–30 秒的清晰人声音频（MP3/WAV），即可克隆该声音，用于保持一致的声音风格。",
  },
  {
    q: "字符额度用完了怎么办？",
    a: "免费版每月 10,000 字符，用完可升级 Pro（每月更多字符）或一次性买断 Lifetime，获得更高额度与更多功能。",
  },
];

// Voices shown in the hero product window (pure CSS mock, no screenshot).
const mockVoices = [
  { emoji: "👨", name: "Arthur", tag: "新闻 · 沉稳", active: false },
  { emoji: "👩", name: "Luna", tag: "甜美 · 营销", active: true },
  { emoji: "👩", name: "Emma", tag: "温柔 · 情感", active: false },
  { emoji: "👨", name: "Victor", tag: "旁白 · 有声书", active: false },
  { emoji: "🧒", name: "An Ran", tag: "童声 · 早教", active: false },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
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
        }}
      />

      {/* ═══ 1. Hero ═════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 -bottom-32 h-96 w-96 rounded-full bg-purple-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-purple-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              No signup required · 免费开始
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              AI Voiceover for{" "}
              <span className="text-purple-600">Short Videos</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
              Turn any text into natural, professional AI voiceovers in seconds.
              Perfect for TikTok, Reels, and YouTube Shorts — 17 voices, 9 languages, no signup.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/voiceover"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-300 active:translate-y-0 active:shadow-md sm:w-auto"
              >
                <Mic className="h-5 w-5" />
                Try Free Voiceover
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 sm:w-auto"
              >
                View Pricing 看价格
              </Link>
            </div>
          </div>

          {/* Hero product window — pure CSS mock of the voiceover editor */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div aria-hidden className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-purple-200/60 to-purple-100/30 blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-purple-100">
              {/* Window top bar */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-gray-200" />
                <span className="h-3 w-3 rounded-full bg-gray-200" />
                <span className="h-3 w-3 rounded-full bg-gray-200" />
                <span className="ml-3 hidden rounded-md bg-white px-3 py-1 text-xs text-gray-400 ring-1 ring-gray-200 sm:block">
                  voiceover.getfitai.io/voiceover
                </span>
              </div>

              <div className="grid gap-0 md:grid-cols-[16rem_minmax(0,1fr)]">
                {/* Left: voice list */}
                <div className="border-b border-gray-100 bg-gray-50/50 p-4 md:border-r md:border-b-0">
                  <p className="mb-3 text-[11px] font-semibold text-gray-400">配音语言 · Language</p>
                  <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-600">
                    <span className="text-sm">🇨🇳</span> 普通话
                    <span className="ml-auto text-gray-300">▼</span>
                  </div>
                  <div className="space-y-1.5">
                    {mockVoices.map((v) => (
                      <div
                        key={v.name}
                        className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors ${
                          v.active
                            ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                            : "border-transparent bg-white text-gray-700"
                        }`}
                      >
                        <span className="text-sm leading-none">{v.emoji}</span>
                        <div className="min-w-0 flex-1 leading-tight">
                          <p className={`truncate text-xs font-semibold ${v.active ? "text-white" : "text-gray-800"}`}>
                            {v.name}
                          </p>
                          <p className={`truncate text-[10px] ${v.active ? "text-purple-200" : "text-gray-400"}`}>
                            {v.tag}
                          </p>
                        </div>
                        {v.active && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-white" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: text input + playbar with waveform */}
                <div className="flex min-w-0 flex-col p-4 sm:p-5">
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <p className="text-sm leading-relaxed text-gray-800">
                      今天给大家分享三个让短视频更专业的小技巧——尤其是第二个，真的很好用！
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/50 p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm">
                      <PlayGlyph />
                    </span>
                    <div className="flex h-10 min-w-0 flex-1 items-center gap-[3px] px-1" aria-hidden>
                      {Array.from({ length: 32 }).map((_, i) => (
                        <span
                          key={i}
                          className="wave-bar h-8 flex-1 rounded-full bg-purple-500"
                          style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
                        />
                      ))}
                    </div>
                    <span className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-purple-700 shadow-sm ring-1 ring-purple-100">
                      ▶ 1:04
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-gray-400">
                      <span className="font-semibold text-purple-600">0:32</span> / 1:04 · CosyVoice-V2
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                      <Download className="h-3.5 w-3.5" />
                      MP3 无水印下载
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. Stats bar ════════════════════════════════════════════════ */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          <Stat value="17" label="自然音色 · Natural Voices" icon={<AudioLines className="h-5 w-5" />} />
          <Stat value="9" label="多语言 · Languages" icon={<Languages className="h-5 w-5" />} />
          <Stat value="3 步" label="生成配音 · Steps" icon={<Zap className="h-5 w-5" />} />
          <Stat value="$0" label="免费开始 · Start Free" icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>
      </section>

      {/* ═══ 3. Feature grid ══════════════════════════════════════════════ */}
      <section className="bg-gray-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Features"
            title="一条音频，搞定整条视频的配音"
            subtitle="从音色、语言到台词润色与克隆，一站式完成短视频配音。"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<AudioLines className="h-6 w-6" />}
              title="自然语音 · 17 种音色"
              desc="男声、女声、童声共 17 个音色，支持语速、语调、音量与 Instruct 情绪指令精细调节。"
            />
            <FeatureCard
              icon={<Languages className="h-6 w-6" />}
              title="多语言朗读 · 9 种语言"
              desc="中文普通话 + 英日韩德法西意俄。CosyVoice-V2 多语言模型，同一音色可读任意语言。"
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI 台词润色 · Script Polish"
              desc="输入粗糙文本，AI 一键改写成适合口播、节奏紧凑的短视频脚本。"
            />
            <FeatureCard
              icon={<Fingerprint className="h-6 w-6" />}
              title="语音克隆 · Voice Cloning"
              desc="上传 10–30 秒清晰人声，克隆任意声音，保持品牌一致的声音风格。"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="多角色对白 · Dialogue"
              desc="为每个角色分配音色，AI 自动生成台词，一键合并成一条音频。核心新功能，点此体验 →"
              href="/voiceover/dialogue"
              highlight
            />
            <FeatureCard
              icon={<Download className="h-6 w-6" />}
              title="MP3 下载 · 无水印"
              desc="所有套餐生成的 MP3 均无水印、可商用，随时下载，即取即用。"
            />
          </div>
        </div>
      </section>

      {/* ═══ 4. Use cases ═════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Use Cases"
            title="为你的视频找到合适的声音"
            subtitle="从爆款口播到播客有声书，一个工具覆盖所有配音场景。"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <UseCaseCard
              icon={<Clapperboard className="h-6 w-6" />}
              title="短视频 / TikTok 口播"
              desc="爆款开头 + 口语化旁白 + 紧凑节奏，让每个短片的开头 3 秒都抓住用户。"
            />
            <UseCaseCard
              icon={<MonitorPlay className="h-6 w-6" />}
              title="视频号 / YouTube 旁白"
              desc="纪录片式沉稳旁白或温暖解说，长视频也能保持一致的讲述感。"
            />
            <UseCaseCard
              icon={<Podcast className="h-6 w-6" />}
              title="播客 / 有声内容"
              desc="多人对白、故事演绎、有声书朗读，AI 自动生成并合并为一条完整音频。"
            />
          </div>
        </div>
      </section>

      {/* ═══ 5. Dialogue highlight ════════════════════════════════════════ */}
      <section className="overflow-hidden bg-purple-600 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-purple-100">
                <Users className="h-4 w-4" />
                Multi-Speaker Dialogue
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                多角色对白，一键生成完整对话
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-purple-100">
                给每个角色分配不同音色，AI 自动生成台词，一键合并成一条音频。
                适合访谈、带货拆解、情景短剧等所有需要多人对话的内容。
              </p>
              <div className="mt-8">
                <Link
                  href="/voiceover/dialogue"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-purple-600 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-xl active:translate-y-0 active:shadow-md"
                >
                  打开多角色对白编辑器
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Three-step mini diagram */}
            <div className="w-full space-y-4 lg:w-auto">
              {[
                { n: "1", t: "分配音色", d: "每位说话人选一个音色", icon: <Users className="h-5 w-5" /> },
                { n: "2", t: "AI 生成台词", d: "输入主题，自动写对白", icon: <Sparkles className="h-5 w-5" /> },
                { n: "3", t: "一键合并", d: "生成并合并为一条音频", icon: <AudioWaveform className="h-5 w-5" /> },
              ].map((step) => (
                <div
                  key={step.n}
                  className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-purple-600">
                    {step.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      <span className="mr-1.5 text-purple-200">{step.n}.</span>
                      {step.t}
                    </p>
                    <p className="text-xs text-purple-100/80">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. Pricing teaser ════════════════════════════════════════════ */}
      <section className="bg-gray-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Pricing"
            title="免费开始，按需升级"
            subtitle="无需信用卡，免费额度用完再升级。"
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            <PricingCard
              name="Free"
              price="$0"
              period="免费 · 无需注册"
              cta="免费使用"
              href="/voiceover"
              features={["每月 10,000 字符", "1,000 字符 / 次", "MP3 无水印下载"]}
            />
            <PricingCard
              name="Pro"
              price="$9.99"
              period="每月 · 按月订阅"
              cta="升级 Pro"
              href="/pricing"
              featured
              features={["每月 100,000 字符", "10,000 字符 / 次", "更高额度与优先级"]}
            />
            <PricingCard
              name="Lifetime"
              price="$149"
              period="一次性买断"
              cta="买断 Lifetime"
              href="/pricing"
              features={["每月 100,000 字符", "一次付费，长期使用", "限 500 个名额"]}
            />
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            还有 Pro Yearly 与 Business（含 API）方案，见{" "}
            <Link href="/pricing" className="font-medium text-purple-600 hover:text-purple-700 hover:underline">
              完整定价
            </Link>
            。
          </p>
        </div>
      </section>

      {/* ═══ 7. FAQ ══════════════════════════════════════════════════════ */}
      <section className="border-t border-gray-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHead
            kicker="FAQ"
            title="常见问题"
            subtitle="关于 Voiceover AI，你可能想知道的都在这里。"
          />
          <div className="mt-12 space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all open:border-purple-200 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-purple-50 text-xs font-bold text-purple-600">
                      {i + 1}
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 group-open:text-purple-600" />
                </summary>
                <dd className="mt-3 pl-8 text-sm leading-relaxed text-gray-500">{faq.a}</dd>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. Bottom CTA ════════════════════════════════════════════════ */}
      <section className="bg-purple-600 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            现在就把文字变成声音
          </h2>
          <p className="mt-4 text-lg text-purple-100">
            免费开始，无需注册，无水印，可商用。
          </p>
          <Link
            href="/voiceover"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-purple-600 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-xl active:translate-y-0 active:shadow-md"
          >
            <Mic className="h-5 w-5" />
            Try Free Voiceover
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}

/* ── Shared section pieces ─────────────────────────────────────────────── */

function SectionHead({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold tracking-wider text-purple-600 uppercase">{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg text-gray-500">{subtitle}</p>
    </div>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-3 text-center">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
        {icon}
      </span>
      <div className="text-left">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  href,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
          highlight ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"
        }`}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
      {href && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-purple-600">
          立即体验
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </>
  );
  const cardClass = `group flex h-full flex-col rounded-2xl border p-6 transition-all ${
    highlight
      ? "border-purple-300 bg-purple-50/60 shadow-md shadow-purple-100 hover:-translate-y-1 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-200"
      : "border-gray-100 bg-white shadow-sm hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100"
  }`;
  return href ? (
    <Link href={href} className={cardClass}>
      {inner}
    </Link>
  ) : (
    <div className={cardClass}>{inner}</div>
  );
}

function UseCaseCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  cta,
  href,
  features,
  featured,
}: {
  name: string;
  price: string;
  period: string;
  cta: string;
  href: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
        featured
          ? "border-purple-400 bg-white shadow-lg shadow-purple-100 ring-2 ring-purple-200"
          : "border-gray-200 bg-white shadow-sm"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          最受欢迎
        </span>
      )}
      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
      <p className="mt-2">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        <span className="ml-1 text-sm text-gray-500">{period}</span>
      </p>
      <ul className="mt-5 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
          featured
            ? "bg-purple-600 text-white shadow-sm shadow-purple-200 hover:-translate-y-0.5 hover:bg-purple-700"
            : "border border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
        }`}
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden>
      <path d="M8 5.14v13.72c0 .82.9 1.33 1.6.9l11.02-6.86a1.06 1.06 0 0 0 0-1.8L9.6 4.24A1.06 1.06 0 0 0 8 5.14z" />
    </svg>
  );
}
