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
      "Unlimited Projects",
      "10,000 Characters per Month",
      "1,000 Characters per Request",
      "MP3 Downloading",
      "No watermark",
    ],
  },
  {
    name: "Pro Monthly",
    price: "$9.99",
    period: "per month",
    cta: "Subscribe Monthly",
    productId: "prod_6i35t3PDKABIwpugKXq9IV",
    featured: true,
    features: [
      "Unlimited Projects",
      "100,000 Characters per Month",
      "MP3 Downloading",
      "No watermark",
    ],
  },
  {
    name: "Pro Yearly",
    price: "$7.99",
    period: "per month, billed annually",
    subtext: "$95.88/year",
    cta: "Subscribe Yearly",
    productId: "prod_2XbnoPWpc9Gfq7rFTR6qTW",
    features: [
      "Unlimited Projects",
      "250,000 Characters per Month",
      "MP3 Downloading",
      "No watermark",
    ],
  },
  {
    name: "Lifetime",
    price: "$149",
    period: "one-time",
    cta: "Buy Lifetime",
    productId: "prod_5SC6SMZsrRNFxhkNilsMBN",
    features: [
      "Unlimited Projects",
      "100,000 Characters per Month",
      "MP3 Downloading",
      "No watermark",
      "Limited to 500 seats",
    ],
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    cta: "Subscribe Business",
    productId: "prod_1Z4E00JBKlHYut6Gp1I4kG",
    features: [
      "Unlimited Projects",
      "1,000,000 Characters per Month",
      "MP3 Downloading",
      "No watermark",
      "API Access",
      "Custom Support",
    ],
  },
];

export default function PricingPage() {
  const { isPro, subscription } = useAuth();
  const currentPlan = subscription?.plan || null;

  const getButtonForPlan = (plan: (typeof plans)[number]) => {
    if (!plan.productId) {
      // Free plan
      return (
        <Link
          href={plan.href as string}
          className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          {plan.cta}
        </Link>
      );
    }

    if (!isPro) {
      // Not a member — show checkout button
      return (
        <CheckoutButton
          productId={plan.productId}
          label={plan.cta}
          featured={plan.featured}
        />
      );
    }

    // Pro member — check which plan this is
    const planIdMap: Record<string, string> = {
      prod_6i35t3PDKABIwpugKXq9IV: "pro_monthly",
      prod_2XbnoPWpc9Gfq7rFTR6qTW: "pro_yearly",
      prod_5SC6SMZsrRNFxhkNilsMBN: "lifetime",
      prod_1Z4E00JBKlHYut6Gp1I4kG: "business",
    };
    const thisPlanName = planIdMap[plan.productId];

    if (thisPlanName === currentPlan) {
      // Current plan — cannot repurchase
      return (
        <span className="block w-full rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 text-center text-sm font-semibold text-accent">
          ✓ Current Plan
        </span>
      );
    }

    // Different plan — allow upgrade/downgrade
    return (
      <CheckoutButton
        productId={plan.productId}
        label={currentPlan ? "Switch Plan" : plan.cta}
        featured={plan.featured}
      />
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Simple, transparent <span className="text-gradient">pricing</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          {isPro
            ? `You're on the ${getPlanLabel(subscription?.plan || "pro")} plan.`
            : "Start free. Upgrade when you need more."}
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              plan.featured
                ? "border-violet-500/60 bg-gray-50 ring-1 ring-violet-500/30"
                : "border-gray-200 bg-white"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <div className="mt-3">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-sm text-gray-500"> {plan.period}</span>
            </div>
            {plan.subtext && (
              <p className="mt-1 text-xs text-gray-500">{plan.subtext}</p>
            )}
            {getButtonForPlan(plan)}
            <ul className="mt-6 space-y-2.5 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-500">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
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
