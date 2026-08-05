"use client";

import { useAuth, getPlanLabel } from "@/lib/auth-context";
import { getTodayUsed, getTotalAvailable, getBonusCredits } from "@/lib/usage-tracker";
import { ShareBonus } from "@/components/share-bonus";
import { Mic } from "lucide-react";

export default function DashboardPage() {
  const { user, subscription, isLoggedIn, isPro } = useAuth();
  const used = getTodayUsed();
  const total = getTotalAvailable();
  const bonus = getBonusCredits();

  const planLabel = isPro && subscription ? getPlanLabel(subscription.plan) : "Free";
  const planColor = isPro ? "text-purple-600" : "text-gray-900";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your account and usage.</p>

      {isLoggedIn && user && (
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-gray-100 p-4">
          <img
            src={user.picture}
            alt={user.name}
            className="h-12 w-12 rounded-full"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900">Voiceover Quota</h3>
          <p className={`mt-2 text-3xl font-bold ${planColor}`}>
            {used} / {total}
          </p>
          <p className="mt-1 text-xs text-gray-400">TTS generations used today</p>
          {bonus > 0 && (
            <p className="mt-1 text-xs text-purple-400">
              +{bonus} bonus credits from sharing
            </p>
          )}
          {isPro && (
            <p className="mt-2 text-xs text-green-600">
              Unlimited voiceovers with {planLabel} plan
            </p>
          )}
        </div>

        <div className={`rounded-xl border p-6 ${isPro ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-gray-50"}`}>
          <h3 className="text-sm font-semibold text-gray-900">Current Plan</h3>
          <p className={`mt-2 text-xl font-bold ${planColor}`}>
            {planLabel}
            {isPro ? (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Pro Member
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                Free
              </span>
            )}
          </p>
          {isPro && subscription && (
            <p className="mt-1 text-xs text-purple-500">
              Purchased: {new Date(subscription.purchasedAt).toLocaleDateString()}
              {subscription.expiresAt && (
                <> · Expires: {new Date(subscription.expiresAt).toLocaleDateString()}</>
              )}
            </p>
          )}
          {!isPro && (
            <p className="mt-1 text-xs text-gray-400">
              <a href="/pricing" className="text-purple-600 font-medium hover:underline">
                Upgrade to Pro →
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <a
          href="/voiceover"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          <Mic className="h-4 w-4" />
          Go to Voiceover Studio
        </a>
      </div>

      <div className="mt-8">
        <ShareBonus />
      </div>
    </div>
  );
}