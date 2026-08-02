"use client";

import { useState, useRef } from "react";
import { Mic, Download, Loader2, Sparkles, Languages } from "lucide-react";
import { voices, freeQuota } from "@/config/site";
import { estimateChars } from "@/lib/utils";

export default function VoiceoverPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("longjiqi");
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [polishedText, setPolishedText] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const charsUsed = estimateChars(text);
  const isOverLimit = charsUsed > freeQuota.maxCharsPerTts;

  const handleGenerate = async () => {
    if (!text.trim() || isOverLimit) return;
    setLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const textToUse = polishedText || text;

      const res = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [textToUse],
          voice,
          speed,
          volume,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePolish = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/llm/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: text }),
      });
      const data = await res.json();
      if (data.polished) {
        setPolishedText(data.polished);
      }
    } catch {
      // Polish is non-critical
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Voiceover Studio</h1>
        <p className="mt-2 text-gray-500">
          Turn text into natural voiceover audio. Free tier: {freeQuota.maxCharsPerTts} chars, {freeQuota.dailyTtsCount}x/day.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Controls sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} — {v.style} ({v.gender})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speed: {speed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0.5x</span>
              <span>2.0x</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume: {volume}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-xs font-medium text-purple-700">Free Tier</p>
            <p className="mt-1 text-xs text-purple-600">
              {charsUsed}/{freeQuota.maxCharsPerTts} chars
              {isOverLimit && (
                <span className="ml-1 text-red-500 font-medium">— Over limit!</span>
              )}
            </p>
          </div>
        </div>

        {/* Main area */}
        <div className="space-y-6 lg:col-span-2">
          {/* Text input */}
          <div>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setPolishedText("");
              }}
              placeholder="Enter your script here... e.g. 'Welcome to my channel! Today I'm going to show you...'"
              rows={6}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {charsUsed} / {freeQuota.maxCharsPerTts} chars
              </span>
              <button
                onClick={handlePolish}
                disabled={!text.trim() || loading}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Polish
              </button>
              <button
                disabled={!text.trim() || loading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <Languages className="h-3.5 w-3.5" />
                Translate
              </button>
            </div>
          </div>

          {/* Polished result */}
          {polishedText && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-xs font-medium text-purple-700 mb-1">AI Polished:</p>
              <p className="text-sm text-purple-900">{polishedText}</p>
              <button
                onClick={() => setPolishedText("")}
                className="mt-2 text-xs text-purple-500 hover:text-purple-700"
              >
                Use original instead
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isOverLimit || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            {loading ? "Generating..." : "Generate Voiceover"}
          </button>

          {/* Audio player */}
          {audioUrl && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <audio ref={audioRef} controls className="w-full" src={audioUrl}>
                Your browser does not support audio playback.
              </audio>
              <a
                href={audioUrl}
                download="voiceover.mp3"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                <Download className="h-4 w-4" />
                Download MP3
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
