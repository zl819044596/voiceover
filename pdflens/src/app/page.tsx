"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import FeatureCards from "@/components/FeatureCards";
import StatusBar from "@/components/StatusBar";
import Results from "@/components/Results";
import Footer from "@/components/Footer";
import type {
  ProcessState,
  SummaryResults,
  DownloadProgress,
  WebGPUSupport,
} from "@/lib/types";

export default function Home() {
  const [processState, setProcessState] = useState<ProcessState>("idle");
  const [webgpuSupport, setWebgpuSupport] =
    useState<WebGPUSupport>("unknown");
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [results, setResults] = useState<SummaryResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setError(null);
    setResults(null);

    try {
      // Step 1: Extract text from PDF
      setProcessState("extracting");
      setProgress(null);

      // Dynamic import — pdfjs-dist requires browser APIs (DOMMatrix etc)
      const { extractPDFText } = await import("@/lib/pdf");
      const { text } = await extractPDFText(file);

      // Check for empty text (image-based PDF)
      if (!text.trim()) {
        setError(
          "This PDF appears to be image-based. Text extraction failed."
        );
        setProcessState("error");
        return;
      }

      // Step 2: Load model (detect WebGPU support)
      setProcessState("downloading");

      // Detect WebGPU support
      let device: "webgpu" | "wasm" = "webgpu";
      const hasWebGPU =
        typeof navigator !== "undefined" && "gpu" in navigator;
      if (!hasWebGPU) {
        device = "wasm";
        setWebgpuSupport("wasm");
      } else {
        setWebgpuSupport("webgpu");
      }

      const onProgress = (info: DownloadProgress) => {
        setProgress(info);
      };

      // Dynamic import — transformers.js requires browser APIs
      const { loadGenerator, summarizeText } = await import(
        "@/lib/summarize"
      );
      await loadGenerator(device, onProgress);

      setProcessState("ready");

      // Brief pause so user sees "Model ready!"
      await new Promise((r) => setTimeout(r, 800));

      // Step 3: Summarize
      setProcessState("summarizing");
      const summary = await summarizeText(text);

      setResults(summary);
      setProcessState("done");
    } catch (err) {
      console.error("Processing error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred.";
      setError(message);
      setProcessState("error");
    }
  }, []);

  const handleReset = useCallback(() => {
    setProcessState("idle");
    setProgress(null);
    setResults(null);
    setError(null);
    setFileName(null);
  }, []);

  const showUpload = processState === "idle";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16">
        {!results && processState !== "done" && (
          <>
            <Hero />
            {processState === "idle" && (
              <UploadZone onFile={handleFile} disabled={false} />
            )}

            {/* Status bar for processing */}
            <StatusBar
              state={processState}
              progress={progress}
              webgpuSupport={webgpuSupport}
              fileName={fileName}
            />

            {/* WebGPU fallback notice */}
            {webgpuSupport === "wasm" && processState === "summarizing" && (
              <p className="mt-4 text-center text-sm text-amber-400">
                Using WASM fallback (slower). For best performance, use a
                WebGPU-compatible browser.
              </p>
            )}

            {/* Error display */}
            {processState === "error" && error && (
              <div className="mx-auto mt-8 max-w-xl px-4 animate-fade-in">
                <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-6 text-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mx-auto mb-3 text-red-400"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="font-medium text-red-300">{error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Feature cards */}
            {showUpload && <FeatureCards />}
          </>
        )}

        {/* Results */}
        {processState === "done" && results && (
          <>
            <Results results={results} fileName={fileName} />
            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
              >
                Summarize Another PDF
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
