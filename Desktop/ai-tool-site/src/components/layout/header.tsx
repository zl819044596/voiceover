"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Mic } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/voiceover", label: "Voiceover" },
  { href: "/voiceover/dialogue", label: "Dialogue" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

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
            <div className="ml-2 flex items-center gap-3">
              <img
                src={user.picture}
                alt={user.name}
                className="h-8 w-8 rounded-full ring-1 ring-gray-200"
                referrerPolicy="no-referrer"
              />
              <span className="hidden text-sm text-gray-600 lg:inline">{user.name}</span>
              <button
                onClick={logout}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              >
                Logout
              </button>
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

          {isLoggedIn && user ? (
            <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3">
              <img
                src={user.picture}
                alt={user.name}
                className="h-8 w-8 rounded-full ring-1 ring-gray-200"
                referrerPolicy="no-referrer"
              />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
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
