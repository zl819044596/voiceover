"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import { useAuth, getPlanLabel } from "@/lib/auth-context";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    cta: "Get Started",
    href: "/voiceover",
    productId: null,
    features: [
      "3 voiceovers per day",
      "500 characters per voiceover",
      "All 13 voices",
      "AI script polish & emotion tagging",
      "MP3 download",
      "No signup required",
    ],
  },
  {
    name: "Pro Monthly",
    price: "$14.99",
    period: "per month",
    cta: "Subscribe Monthly",
    productId: "prod_6gXyPkmTSZuwMgkYU2DPQd",
    featured: true,
    features: [
      "500 voiceovers per month",
      "10,000 characters per voiceover",
      "All 13 professional voices",
      "AI script polish & emotion tagging",
      "No watermark",
      "MP3 + WAV download",
      "Priority support",
    ],
  },
  {
    name: "Pro Yearly",
    price: "$9.99",
    period: "per month, billed annually",
    subtext: "$119.88/year",
    cta: "Subscribe Yearly",
    productId: "prod_7NtvaKyjtGRU1SPDXDMGuw",
    features: [
      "Everything in Pro Monthly",
      "2 months free",
      "Early access to new voices",
    ],
  },
  {
    name: "Lifetime",
    price: "$149",
    period: "one-time",
    subtext: "Limited to first 500 users",
    cta: "Buy Lifetime",
    productId: "prod_5VrKGtT4jWn3OJ4XPvoy1b",
    features: [
      "Everything in Pro, forever",
      "No recurring payments",
      "All future Pro features included",
    ],
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    cta: "Subscribe Business",
    productId: "prod_72NSownOenMiIf4WdEnQat",
    features: [
      "Unlimited voiceovers",
      "10,000 characters per voiceover",
      "Team accounts (up to 5 seats)",
      "API access with usage-based billing",
      "Dedicated support",
      "Custom voice integration",
    ],
  },
];

export default function PricingPage() {
  const { isPro, subscription } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          {isPro
            ? `You're on the ${getPlanLabel(subscription?.plan || "pro")} plan.`
            : "Start free. Upgrade when you need more."}
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-6 ${
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
            {plan.productId ? (
              isPro ? (
                <span className="block w-full rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-center text-sm font-semibold text-green-700">
                  Current Plan
                </span>
              ) : (
                <CheckoutButton
                  productId={plan.productId}
                  label={plan.cta}
                  featured={plan.featured}
                />
              )
            ) : (
              <Link
                href={plan.href as string}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                {plan.cta}
              </Link>
            )}
            <ul className="mt-6 space-y-2.5 flex-1">
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