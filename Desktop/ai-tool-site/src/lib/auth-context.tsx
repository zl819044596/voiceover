"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { safeParseJson } from "@/lib/utils";

interface User {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface Subscription {
  plan: string;
  status: string;
  purchasedAt: string;
  expiresAt?: string;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  isLoggedIn: boolean;
  isPro: boolean;
  login: () => void;
  logout: () => void;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  subscription: null,
  isLoggedIn: false,
  isPro: false,
  login: () => {},
  logout: () => {},
  refreshSubscription: async () => {},
});

const PLAN_LABELS: Record<string, string> = {
  pro_monthly: "Pro Monthly",
  pro_yearly: "Pro Yearly",
  lifetime: "Lifetime",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isPro = subscription != null && subscription.status === "active";

  useEffect(() => {
    // Helper: read cookie by name
    function getCookie(name: string): string | null {
      const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
      return match ? decodeURIComponent(match[1]) : null;
    }

    // 0. Check URL hash for #auth=xxx (primary flow, WAF-safe)
    const hashToken = (() => {
      const hash = window.location.hash;
      if (!hash) return null;
      const params = new URLSearchParams(hash.slice(1)); // remove '#'
      const token = params.get("auth");
      if (token) {
        // Clean URL: remove hash
        window.history.replaceState({}, "", window.location.pathname + window.location.search);
      }
      return token;
    })();

    // 1. Check URL for ?token=xxx (legacy), store in localStorage, clean URL
    const url = new URL(window.location.href);
    const urlToken = url.searchParams.get("token");
    if (urlToken) {
      localStorage.setItem("authToken", urlToken);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }

    // 2. Check cookie for authToken
    const cookieToken = getCookie("authToken");
    if (cookieToken && !hashToken && !urlToken) {
      localStorage.setItem("authToken", cookieToken);
    }

    // 3. Check localStorage for existing token, validate via /api/auth/me
    const storedToken = hashToken || urlToken || cookieToken || localStorage.getItem("authToken");
    if (storedToken) {
      localStorage.setItem("authToken", storedToken);
    }
    if (!storedToken) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Invalid token");
        const parsed = await safeParseJson<{
          user: User;
          subscription: Subscription;
        }>(res);
        if (!parsed.ok) throw new Error(parsed.error);
        return parsed.data;
      })
      .then((data) => {
        setUser(data.user);
        setSubscription(data.subscription);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        setUser(null);
        setSubscription(null);
        setIsLoggedIn(false);
      });
  }, []);

  const refreshSubscription = useCallback(async () => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) return;

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (res.ok) {
        const parsed = await safeParseJson<{ subscription?: Subscription }>(res);
        if (parsed.ok) setSubscription(parsed.data.subscription ?? null);
      }
    } catch {
      // ignore network errors during poll
    }
  }, []);

  // Poll subscription after returning from checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") !== "checkout") return;

    const pendingCheckoutId = localStorage.getItem("pendingCheckoutId");

    let attempts = 0;
    const maxAttempts = 15;

    const poll = setInterval(async () => {
      attempts++;

      // First check KV (webhook may have fired)
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        clearInterval(poll);
        return;
      }

      try {
        // Check via /api/auth/me (KV-based, fast path if webhook worked)
        const meRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (meRes.ok) {
          const data = await meRes.json();
          if (data.subscription && data.subscription.status === "active") {
            setSubscription(data.subscription);
            clearInterval(poll);
            localStorage.removeItem("pendingCheckoutId");
            const url = new URL(window.location.href);
            url.searchParams.delete("from");
            window.history.replaceState({}, "", url.toString());
            return;
          }
        }
      } catch { /* ignore */ }

      // If webhook didn't fire, try Creem API verification
      if (pendingCheckoutId) {
        try {
          const verifyRes = await fetch(`/api/verify-payment?ch=${pendingCheckoutId}`);
          if (verifyRes.ok) {
            const vdata = await verifyRes.json();
            if (vdata.verified && vdata.subscription) {
              setSubscription(vdata.subscription);
              clearInterval(poll);
              localStorage.removeItem("pendingCheckoutId");
              const url = new URL(window.location.href);
              url.searchParams.delete("from");
              window.history.replaceState({}, "", url.toString());
              return;
            }
          }
        } catch { /* ignore */ }
      }

      if (attempts >= maxAttempts) {
        clearInterval(poll);
        localStorage.removeItem("pendingCheckoutId");
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [refreshSubscription]);

  const login = useCallback(() => {
    window.location.href = "/api/auth/google";
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    document.cookie = "authToken=; Path=/; Max-Age=0; Secure; SameSite=Lax";
    setUser(null);
    setSubscription(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, subscription, isLoggedIn, isPro, login, logout, refreshSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getPlanLabel(plan: string): string {
  return PLAN_LABELS[plan] || plan.charAt(0).toUpperCase() + plan.slice(1);
}