"use client";

import { useAuth, getPlanLabel } from "@/lib/auth-context";
import { getTodayUsed, getTotalAvailable } from "@/lib/usage-tracker";
import { Mic } from "lucide-react";

export default function DashboardPage() {
  const { user, subscription, isLoggedIn, isPro } = useAuth();
  const used = getTodayUsed();
  const total = getTotalAvailable();

  const planLabel = isPro && subscription ? getPlanLabel(subscription.plan) : "Free";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your account and usage.</p>

      {isLoggedIn && user && (
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <img
            src={user.picture}
            alt={user.name}
            className="h-12 w-12 rounded-full ring-1 ring-gray-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">Voiceover Quota</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {used} / {total}
          </p>
          <p className="mt-1 text-xs text-gray-500">TTS generations used today</p>
          {isPro && (
            <p className="mt-2 text-xs text-accent">
              Unlimited voiceovers with {planLabel} plan
            </p>
          )}
        </div>

        <div className={`rounded-xl border p-6 ${isPro ? "border-accent/30 bg-accent/5" : "border-gray-200 bg-white"}`}>
          <h3 className="text-sm font-semibold text-gray-900">Current Plan</h3>
          <p className="mt-2 text-xl font-bold text-gray-900">
            {planLabel}
            {isPro ? (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Pro Member
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                Free
              </span>
            )}
          </p>
          {isPro && subscription && (
            <p className="mt-1 text-xs text-violet-600">
              Purchased: {new Date(subscription.purchasedAt).toLocaleDateString()}
              {subscription.expiresAt && (
                <> · Expires: {new Date(subscription.expiresAt).toLocaleDateString()}</>
              )}
            </p>
          )}
          {!isPro && (
            <p className="mt-1 text-xs text-gray-500">
              <a href="/pricing" className="text-violet-600 font-medium hover:underline">
                Upgrade to Pro →
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <a
          href="/voiceover"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 hover:bg-gray-700 transition-colors"
        >
          <Mic className="h-4 w-4" />
          Go to Voiceover Studio
        </a>
      </div>
    </div>
  );
}