"use client";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="shrink-0"
          >
            <rect width="28" height="28" rx="6" fill="#7c3aed" />
            <path
              d="M6 8h6l3 6-3 6H6l3-6-3-6zm8 0h8v2h-6l-1 2h5v2h-5l-1 2h6v2h-8l3-4-3-4z"
              fill="#fff"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight text-white">
            PDFLens
          </span>
        </a>

        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-900/50 px-3 py-1 text-xs font-medium text-violet-300 border border-violet-700/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            WebGPU (Fast)
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/50 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-700/50">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            100% Private
          </span>
        </div>
      </div>
    </header>
  );
}
