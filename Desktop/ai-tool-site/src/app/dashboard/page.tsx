"use client";

import { useAuth, getPlanLabel } from "@/lib/auth-context";
import { getTodayUsed, getTotalAvailable, getBonusCredits } from "@/lib/usage-tracker";
import { ShareBonus } from "@/components/share-bonus";

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

        <div className="rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900">Current Plan</h3>
          <p className={`mt-2 text-xl font-bold ${planColor}`}>
            {planLabel}
            {isPro && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                Active
              </span>
            )}
          </p>
          {isPro && subscription && (
            <p className="mt-1 text-xs text-gray-400">
              Purchased: {new Date(subscription.purchasedAt).toLocaleDateString()}
              {subscription.expiresAt && (
                <> · Expires: {new Date(subscription.expiresAt).toLocaleDateString()}</>
              )}
            </p>
          )}
          {!isPro && (
            <p className="mt-1 text-xs text-gray-400">
              <a href="/pricing" className="text-purple-600 hover:underline">
                Upgrade to Pro
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <ShareBonus />
      </div>
    </div>
  );
}