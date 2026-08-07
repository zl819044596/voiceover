import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  AudioWaveform,
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
    q: "Is the free plan actually usable?",
    a: "Yes. The free plan gives you 10,000 characters per month with no signup required. When you run out, upgrade to Pro or Lifetime for more quota.",
  },
  {
    q: "Which languages are supported?",
    a: "Mandarin Chinese plus English, Japanese, Korean, German, French, Spanish, Italian and Russian — 9 languages in total. One voice can speak any of the 9 languages.",
  },
  {
    q: "Can I use the generated audio commercially?",
    a: "Yes. MP3s from every plan are watermark-free and downloadable, and can be used freely in videos on TikTok, YouTube and other platforms, including commercial use.",
  },
  {
    q: "How does multi-speaker dialogue work?",
    a: "Open the Dialogue editor, assign a voice to each speaker, type (or let AI write) their lines, then generate and merge everything into a single audio file.",
  },
  {
    q: "How does voice cloning work?",
    a: "Upload a clear 10–30 second voice recording (MP3/WAV) and we'll clone it so you can keep a consistent brand voice across all your content.",
  },
  {
    q: "What happens when I run out of characters?",
    a: "The free plan resets monthly with 10,000 characters. Upgrade to Pro for more monthly quota, or grab Lifetime for a one-time payment with generous limits.",
  },
];

// Voices shown in the hero product window (pure CSS mock, no screenshot).
const mockVoices = [
  { emoji: "👨", name: "Arthur", tag: "News · Calm", active: false },
  { emoji: "👩", name: "Luna", tag: "Sweet · Marketing", active: true },
  { emoji: "👩", name: "Emma", tag: "Gentle · Emotional", active: false },
  { emoji: "👨", name: "Victor", tag: "Narrator · Audiobook", active: false },
  { emoji: "🧒", name: "An Ran", tag: "Child · Kids", active: false },
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
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="glow-violet pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <Sparkles className="h-4 w-4 text-violet-500" />
              No signup required · Free to start
            </div>
            <h1 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              AI Voiceover for{" "}
              <span className="text-gradient-accent">Short Videos</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
              Turn any text into natural, professional AI voiceovers in seconds.
              Perfect for TikTok, Reels, and YouTube Shorts — 17 voices, 9 languages, no signup.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/voiceover"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-base font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5 hover:bg-gray-700 sm:w-auto"
              >
                <Mic className="h-5 w-5" />
                Try Free Voiceover
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-base font-medium text-gray-700 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Hero visual — Qwen-Image generated artwork */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-violet-200/40 via-transparent to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_4px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-gray-200" />
                <span className="h-3 w-3 rounded-full bg-gray-200" />
                <span className="h-3 w-3 rounded-full bg-gray-200" />
                <span className="ml-3 hidden rounded-md bg-white px-3 py-1 text-xs text-gray-400 ring-1 ring-gray-200 sm:block">
                  voiceover.getfitai.io/voiceover
                </span>
              </div>
              <div className="relative">
                <Image
                  src="/images/hero.png"
                  alt="AI voiceover studio — waveform and audio player illustration"
                  width={1024}
                  height={1024}
                  priority
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 sm:p-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg">
                      <PlayGlyph />
                    </span>
                    <div className="hidden h-10 min-w-0 flex-1 items-center gap-[3px] px-1 sm:flex" aria-hidden>
                      {Array.from({ length: 28 }).map((_, i) => (
                        <span
                          key={i}
                          className="wave-bar h-8 flex-1 rounded-full bg-white/80"
                          style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/25">
                    ▶ 1:04
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. Stats bar ════════════════════════════════════════════════ */}
      <section className="border-y border-gray-100 bg-gray-50/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          <Stat value="17" label="Natural Voices" icon={<AudioLines className="h-5 w-5" />} />
          <Stat value="9" label="Languages" icon={<Languages className="h-5 w-5" />} />
          <Stat value="3 steps" label="To a Finished Voiceover" icon={<Zap className="h-5 w-5" />} />
          <Stat value="$0" label="To Start" icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>
      </section>

      {/* ═══ 3. Feature grid ══════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Features"
            title="Everything you need for a video voiceover"
            subtitle="From voices and languages to script polish and cloning — all in one workflow."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<AudioLines className="h-6 w-6" />}
              title="17 Natural Voices"
              desc="Male, female and child voices with fine-grained control over speed, pitch, volume and emotion instructions."
            />
            <FeatureCard
              icon={<Languages className="h-6 w-6" />}
              title="9 Languages, One Voice"
              desc="Mandarin plus English, Japanese, Korean, German, French, Spanish, Italian and Russian — any voice, any language."
              image="/images/feature-languages.png"
              imageAlt="Global communication illustration — globe with speech bubbles"
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI Script Polish"
              desc="Drop in rough notes and AI rewrites them into tight, spoken-word scripts that are built for the mic."
            />
            <FeatureCard
              icon={<Fingerprint className="h-6 w-6" />}
              title="Voice Cloning"
              desc="Upload a clear 10–30 second recording and clone any voice to keep a consistent brand sound."
              image="/images/feature-clone.png"
              imageAlt="Voice cloning illustration — ear with sound waves"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Multi-Speaker Dialogue"
              desc="Assign a voice to each character, let AI write the lines, and merge everything into one audio file."
              href="/voiceover/dialogue"
              highlight
              image="/images/feature-dialogue.png"
              imageAlt="Multi-speaker dialogue illustration — podcast conversation"
            />
            <FeatureCard
              icon={<Download className="h-6 w-6" />}
              title="Watermark-Free MP3"
              desc="Every plan downloads clean MP3s with no watermark — ready for TikTok, YouTube, and commercial use."
            />
          </div>
        </div>
      </section>

      {/* ═══ 4. Use cases ═════════════════════════════════════════════════ */}
      <section className="bg-gray-50/60 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Use Cases"
            title="Find the right voice for your video"
            subtitle="From viral talking-head clips to podcasts and audiobooks, one tool covers every voiceover scenario."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <UseCaseCard
              icon={<Clapperboard className="h-6 w-6" />}
              title="Short-form / TikTok"
              desc="Hooks, conversational narration and tight pacing — make the first 3 seconds count."
            />
            <UseCaseCard
              icon={<MonitorPlay className="h-6 w-6" />}
              title="YouTube Narrations"
              desc="Documentary-style calm or warm storytelling that stays consistent across long videos."
            />
            <UseCaseCard
              icon={<Podcast className="h-6 w-6" />}
              title="Podcasts & Audiobooks"
              desc="Multi-character dialogue, story narration and audio drama — generated and merged in one pass."
            />
          </div>
        </div>
      </section>

      {/* ═══ 5. Dialogue highlight ════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-900 py-20 sm:py-28">
        <div aria-hidden className="glow-violet pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white">
                <Users className="h-4 w-4 text-violet-300" />
                Multi-Speaker Dialogue
              </div>
              <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
                One click to a complete{" "}
                <span className="text-gradient">conversation</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-300">
                Give every character a different voice, let AI write the lines, and merge
                everything into a single audio file. Perfect for interviews, podcasts,
                explainers and short dramas.
              </p>
              <div className="mt-8">
                <Link
                  href="/voiceover/dialogue"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-100"
                >
                  Open the Dialogue Editor
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-[26rem]">
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src="/images/feature-dialogue.png"
                  alt="Two speakers in a podcast recording session"
                  width={1024}
                  height={1024}
                  className="h-auto w-full object-cover"
                />
              </div>
              {/* Three-step mini diagram */}
              <div className="mt-4 space-y-3">
                {[
                  { n: "1", t: "Assign Voices", d: "Pick a voice for each speaker", icon: <Users className="h-5 w-5" /> },
                  { n: "2", t: "AI Writes the Lines", d: "Enter a topic, get a full script", icon: <Sparkles className="h-5 w-5" /> },
                  { n: "3", t: "Generate & Merge", d: "One click, one MP3", icon: <AudioWaveform className="h-5 w-5" /> },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-white/20"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30">
                      {step.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">
                        <span className="mr-1.5 text-violet-300">{step.n}.</span>
                        {step.t}
                      </p>
                      <p className="text-xs text-gray-400">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. Pricing teaser ════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Pricing"
            title="Start free, upgrade when you need more"
            subtitle="No credit card required. Only pay when the free tier isn't enough."
          />
          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">
            <PricingCard
              name="Free"
              price="$0"
              period="Forever · no signup"
              cta="Start Free"
              href="/voiceover"
              features={["10,000 chars / month", "1,000 chars per request", "Watermark-free MP3"]}
            />
            <PricingCard
              name="Pro"
              price="$9.99"
              period="Per month"
              cta="Upgrade to Pro"
              href="/pricing"
              featured
              features={["100,000 chars / month", "10,000 chars per request", "Priority generation"]}
            />
            <PricingCard
              name="Lifetime"
              price="$149"
              period="One-time payment"
              cta="Get Lifetime"
              href="/pricing"
              features={["100,000 chars / month", "Pay once, keep forever", "Limited to 500 seats"]}
            />
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Plus Pro Yearly and Business (with API access) plans — see{" "}
            <Link href="/pricing" className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
              full pricing
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ═══ 7. FAQ ══════════════════════════════════════════════════════ */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHead
            kicker="FAQ"
            title="Frequently asked questions"
            subtitle="Everything you might want to know about Voiceover AI."
          />
          <div className="mt-12 space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all open:border-violet-200 open:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-violet-50 text-xs font-semibold text-violet-600">
                      {i + 1}
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 group-open:text-violet-500" />
                </summary>
                <dd className="mt-3 pl-8 text-sm leading-relaxed text-gray-500">{faq.a}</dd>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. Bottom CTA ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <Image
          src="/images/cta-bg.png"
          alt=""
          fill
          aria-hidden
          className="object-cover"
          sizes="100vw"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
            Turn your text into <span className="text-gradient">sound</span> now
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Free to start. No signup. No watermark. Commercial use allowed.
          </p>
          <Link
            href="/voiceover"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-medium text-gray-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-100"
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
      <p className="text-sm font-medium tracking-wider text-violet-600 uppercase">{kicker}</p>
      <h2 className="mt-3 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
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
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
        {icon}
      </span>
      <div className="text-left">
        <p className="text-2xl font-medium tracking-tight text-gray-900">{value}</p>
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
  image,
  imageAlt,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href?: string;
  highlight?: boolean;
  image?: string;
  imageAlt?: string;
}) {
  const inner = (
    <>
      {image && (
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-100">
          <Image
            src={image}
            alt={imageAlt ?? title}
            width={1024}
            height={1024}
            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
          highlight ? "bg-gray-900 text-white" : "bg-violet-50 text-violet-600"
        }`}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium tracking-tight text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
      {href && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-violet-600">
          Try it now
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </>
  );
  const cardClass = `group flex h-full flex-col rounded-2xl border p-6 transition-all ${
    highlight
      ? "border-gray-900/20 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.12)]"
      : "border-gray-100 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:border-gray-200 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)]"
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
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-gray-200 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium tracking-tight text-gray-900">{title}</h3>
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
          ? "border-gray-900 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)]"
          : "border-gray-100 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)]"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white shadow-md">
          Most Popular
        </span>
      )}
      <h3 className="text-base font-medium text-gray-900">{name}</h3>
      <p className="mt-2">
        <span className="text-3xl font-light tracking-tight text-gray-900">{price}</span>
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
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
          featured
            ? "bg-gray-900 text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:bg-gray-700"
            : "border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
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
