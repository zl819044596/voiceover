import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    cta: "Get Started",
    href: "/voiceover",
    features: [
      "3 voiceovers per day",
      "500 characters per voiceover",
      "3 basic voices",
      "MP3 download (with watermark)",
      "PDF summarizer (20/day, 10MB)",
      "No signup required",
    ],
  },
  {
    name: "Pro Monthly",
    price: "$14.99",
    period: "per month",
    cta: "Subscribe Monthly",
    href: "/login",
    featured: true,
    features: [
      "Unlimited voiceovers",
      "10,000 characters per voiceover",
      "All 16 professional voices",
      "Voice cloning (upload your own)",
      "AI script polish & translate",
      "No watermark · MP3 + WAV",
      "PDF Pro (50MB, deep analysis)",
      "API access",
      "Priority support",
    ],
  },
  {
    name: "Pro Yearly",
    price: "$9.99",
    period: "per month, billed annually",
    subtext: "$119.88/year",
    cta: "Subscribe Yearly",
    href: "/login",
    features: [
      "Everything in Pro Monthly",
      "2 months free",
      "Early access to new voices",
    ],
  },
  {
    name: "Lifetime",
    price: "$89",
    period: "one-time",
    cta: "Buy Lifetime",
    href: "/login",
    features: [
      "Everything in Pro, forever",
      "No recurring payments",
      "All future Pro features included",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Start free. Upgrade when you need more.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 ${
              plan.featured
                ? "border-purple-500 ring-2 ring-purple-200"
                : "border-gray-200"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
                Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <div className="mt-3">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-sm text-gray-500"> {plan.period}</span>
            </div>
            {plan.subtext && (
              <p className="mt-1 text-xs text-gray-400">{plan.subtext}</p>
            )}
            <Link
              href={plan.href}
              className={`mt-6 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                plan.featured
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {plan.cta}
            </Link>
            <ul className="mt-6 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
