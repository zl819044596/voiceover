"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  subscription: null,
  isLoggedIn: false,
  isPro: false,
  login: () => {},
  logout: () => {},
});

const PLAN_LABELS: Record<string, string> = {
  pro_monthly: "Pro Monthly",
  pro_yearly: "Pro Yearly",
  lifetime: "Lifetime",
  business: "Business",
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
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Invalid token");
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
    <AuthContext.Provider value={{ user, subscription, isLoggedIn, isPro, login, logout }}>
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