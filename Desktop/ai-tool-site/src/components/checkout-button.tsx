"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { safeParseJson } from "@/lib/utils";

interface CheckoutButtonProps {
  productId: string;
  label: string;
  featured?: boolean;
}

export function CheckoutButton({ productId, label, featured }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoggedIn, isPro, login } = useAuth();

  const handleClick = async () => {
    // If not logged in, redirect to login first
    if (!isLoggedIn) {
      login();
      return;
    }

    // If already pro, show a message
    if (isPro) {
      setError("You already have an active subscription.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email: user?.email,
        }),
      });

      const parsed = await safeParseJson<{
        checkoutUrl?: string;
        checkoutId?: string;
        error?: string;
      }>(res);
      if (!parsed.ok) {
        setError(parsed.error);
        setLoading(false);
        return;
      }
      const data = parsed.data;

      if (data.checkoutUrl) {
        // Store checkoutId for payment verification on return
        if (data.checkoutId) {
          localStorage.setItem("pendingCheckoutId", data.checkoutId);
        }
        window.location.href = data.checkoutUrl;
      } else if (res.status === 409) {
        setError("You already have an active subscription. Refresh the page to update.");
      } else {
        setError(data.error || "Checkout failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
          featured
            ? "bg-gray-900 text-white hover:bg-gray-700 disabled:bg-gray-400"
            : "border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:text-gray-400"
        }`}
      >
        {loading ? "Redirecting..." : label}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}