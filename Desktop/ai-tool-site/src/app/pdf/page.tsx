"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, Shield, Copy, Download } from "lucide-react";
import { freeQuota } from "@/config/site";
import { formatBytes } from "@/lib/utils";

// We only import pdfjs-dist types; the actual library is loaded dynamically
type PdfJsType = typeof import("pdfjs-dist");

export default function PdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"summarize" | "keypoints" | "qa">("summarize");
  const [question, setQuestion] = useState("");

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");
    setSummary("");
    setKeyPoints([]);
    setExtractedText("");

    if (f.size > freeQuota.maxPdfSize) {
      setError(`File too large. Maximum ${formatBytes(freeQuota.maxPdfSize)}.`);
      return;
    }

    setLoading(true);

    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;

      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? (item as { str: string }).str : ""))
          .join(" ");
        fullText += pageText + "\n\n";
      }

      setExtractedText(fullText.trim());
    } catch {
      setError("Failed to parse PDF. Make sure it's a valid, text-based PDF file.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!extractedText) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pdf/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText.slice(0, 8000), // Send first 8K chars for analysis
          action: mode,
          question: mode === "qa" ? question : undefined,
        }),
      });

      const data = await res.json();

      if (mode === "summarize") {
        setSummary(data.result);
      } else if (mode === "keypoints") {
        const points = data.result
          .split("\n")
          .filter((line: string) => line.trim().startsWith("-") || line.trim().startsWith("*"))
          .map((line: string) => line.replace(/^[-*]\s*/, ""));
        setKeyPoints(points.length > 0 ? points : data.result.split("\n").filter(Boolean));
      }
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportText = (format: "txt" | "md") => {
    let content = "";
    if (mode === "summarize") {
      content = format === "md" ? `# Summary\n\n${summary}` : summary;
    } else {
      content =
        format === "md"
          ? `# Key Points\n\n${keyPoints.map((p) => `- ${p}`).join("\n")}`
          : keyPoints.join("\n\n");
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Private PDF Summarizer</h1>
        <p className="mt-2 text-gray-500">
          Process PDFs directly in your browser. Your files are never uploaded to any server.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Shield className="h-3.5 w-3.5" />
          100% Private — No Upload
        </div>
      </div>

      {/* Upload zone */}
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center hover:border-purple-300 transition-colors">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <Upload className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-700">
            {file ? file.name : "Click to upload PDF"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Max {formatBytes(freeQuota.maxPdfSize)} · Text-based PDFs only
          </p>
        </label>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {/* Analysis controls */}
      {extractedText && !loading && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3">
            {(["summarize", "keypoints", "qa"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m === "summarize" ? "Summary" : m === "keypoints" ? "Key Points" : "Q&A"}
              </button>
            ))}
          </div>

          {mode === "qa" && (
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this document..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
            />
          )}

          <button
            onClick={handleAnalyze}
            disabled={(mode === "qa" && !question.trim()) || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <FileText className="h-5 w-5" />
            Analyze
          </button>

          {/* Results */}
          {(summary || keyPoints.length > 0) && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              {mode === "summarize" && summary && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{summary}</p>
                </div>
              )}
              {mode === "keypoints" && keyPoints.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Points</h3>
                  <ul className="space-y-1">
                    {keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => exportText("txt")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export TXT
                </button>
                <button
                  onClick={() => exportText("md")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Export Markdown
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
