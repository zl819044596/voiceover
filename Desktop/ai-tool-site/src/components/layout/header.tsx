"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Mic, ChevronDown, LogOut, CreditCard, LayoutDashboard } from "lucide-react";
import { useAuth, getPlanLabel } from "@/lib/auth-context";

const navLinks = [
  { href: "/voiceover", label: "Voiceover" },
  { href: "/voiceover/dialogue", label: "Dialogue" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, subscription, isLoggedIn, isPro, logout } = useAuth();

  // Close account menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const planLabel = isPro && subscription ? getPlanLabel(subscription.plan) : "Free";
  const expiresText =
    isPro && subscription && subscription.expiresAt
      ? new Date(subscription.expiresAt).toLocaleDateString()
      : null;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-medium tracking-tight text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">
            <Mic className="h-4 w-4" />
          </span>
          <span>
            Voiceover <span className="font-light">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-[15px] font-medium text-gray-500 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && user ? (
            <div className="relative ml-2 flex items-center gap-3" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 transition-colors hover:border-gray-300 hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-7 w-7 rounded-full ring-1 ring-gray-200"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden text-sm font-medium text-gray-700 lg:inline">
                  {user.name}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-black/10"
                  role="menu"
                >
                  {/* User info */}
                  <div className="border-b border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-10 w-10 rounded-full ring-1 ring-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Plan details */}
                  <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Membership
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-700">
                        <CreditCard className="h-4 w-4 text-violet-600" />
                        {planLabel}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isPro ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {isPro ? "Active" : "Free"}
                      </span>
                    </div>
                    {expiresText && (
                      <p className="mt-2 text-xs text-gray-500">
                        Expires: <span className="font-medium text-gray-700">{expiresText}</span>
                      </p>
                    )}
                    {!isPro && (
                      <Link
                        href="/pricing"
                        onClick={() => setUserMenuOpen(false)}
                        className="mt-3 block rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-gray-700"
                      >
                        Upgrade to Pro
                      </Link>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-100 p-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-500"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="block py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {isLoggedIn && user ? (
            <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3">
              <img
                src={user.picture}
                alt={user.name}
                className="h-9 w-9 rounded-full ring-1 ring-gray-200"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-700">{user.name}</p>
                <p className="truncate text-xs text-gray-400">
                  {planLabel}
                  {expiresText ? ` · Expires ${expiresText}` : ""}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="ml-auto rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="mt-2 block rounded-full bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
