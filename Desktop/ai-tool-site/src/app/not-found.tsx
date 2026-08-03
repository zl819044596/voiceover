import Link from "next/link";
import { Mic, Home, Newspaper } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      {/* 404 graphic */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <Mic className="h-16 w-16 text-purple-200" />
          <span
            className="absolute -inset-4 flex items-center justify-center text-8xl font-bold text-gray-200/50 select-none"
            aria-hidden="true"
          >
            404
          </span>
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Page not found
      </h1>

      <p className="mt-4 text-base leading-relaxed text-gray-500 sm:text-lg">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved. Try checking the URL or heading back to our homepage.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-purple-700 transition-colors sm:w-auto"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors sm:w-auto"
        >
          <Newspaper className="h-5 w-5" />
          Browse Blog
        </Link>
      </div>
    </div>
  );
}