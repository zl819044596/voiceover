"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Mic } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/voiceover", label: "Voiceover" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <Mic className="h-6 w-6 text-purple-600" />
          <span>Voiceover AI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && user ? (
            <div className="ml-4 flex items-center gap-3">
              <img
                src={user.picture}
                alt={user.name}
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="text-gray-700">{user.name}</span>
              <button
                onClick={logout}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
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

          {isLoggedIn && user ? (
            <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3">
              <img
                src={user.picture}
                alt={user.name}
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="ml-auto rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="mt-2 block rounded-lg bg-purple-600 px-4 py-2 text-center text-sm font-medium text-white"
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
