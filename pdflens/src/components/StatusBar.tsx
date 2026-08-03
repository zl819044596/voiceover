"use client";

import type { ProcessState, DownloadProgress, WebGPUSupport } from "@/lib/types";

interface StatusBarProps {
  state: ProcessState;
  progress: DownloadProgress | null;
  webgpuSupport: WebGPUSupport;
  fileName: string | null;
}

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export default function StatusBar({
  state,
  progress,
  webgpuSupport,
  fileName,
}: StatusBarProps) {
  if (state === "idle" || state === "done") return null;

  if (state === "error") return null; // error handled separately

  const pct =
    progress && progress.total > 0
      ? Math.round((progress.loaded / progress.total) * 100)
      : 0;

  return (
    <div className="mx-auto mt-8 max-w-xl px-4 animate-fade-in">
      <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-6">
        {/* File name */}
        {fileName && (
          <p className="mb-3 text-sm text-gray-400">
            <span className="font-medium text-gray-300">{fileName}</span>
          </p>
        )}

        {/* Extracting state */}
        {state === "extracting" && (
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <div>
              <p className="font-medium text-white">Extracting text from PDF…</p>
              <p className="text-sm text-gray-500">
                Parsing pages with on-device PDF engine
              </p>
            </div>
          </div>
        )}

        {/* Downloading state */}
        {state === "downloading" && (
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <div>
                <p className="font-medium text-white">
                  Downloading AI model…
                </p>
                <p className="text-sm text-gray-500">
                  {progress
                    ? `${formatMB(progress.loaded)} MB / ${formatMB(progress.total)} MB`
                    : "Initializing…"}
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-300 pulse-glow"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-600">
              First load downloads ~460MB model. Subsequent uses are instant.
            </p>
          </div>
        )}

        {/* Ready state */}
        {state === "ready" && (
          <div className="flex items-center gap-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-emerald-400"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="font-medium text-emerald-400">Model ready!</p>
          </div>
        )}

        {/* Summarizing state */}
        {state === "summarizing" && (
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <div>
              <p className="font-medium text-white">
                AI is summarizing…
              </p>
              <p className="text-sm text-gray-500">
                Generating summary, key points, and section analysis
                {webgpuSupport === "wasm" && " (WASM — slower)"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
