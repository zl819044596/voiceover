"use client";

import {
  Sparkles,
  Loader2,
  Download,
  AlertCircle,
  Wand2,
} from "lucide-react";
import {
  SPEAKER_STYLE,
  type Speaker,
} from "@/components/voiceover/speaker-panel";
import { cosyvoiceVoices, type Voice } from "@/config/site";
import { estimateChars } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MAX_CHARS_PER_SPEAKER = 500;

interface DialogueEditorProps {
  speakers: Speaker[];
  clonedVoices?: Voice[];
  topic: string;
  generating: boolean;
  progress: { done: number; total: number } | null;
  error: string;
  mergedAudioUrl: string | null;
  speakerAudios?: { id: string; name: string; url: string }[] | null;
  onTextChange: (id: string, text: string) => void;
  onTopicChange: (topic: string) => void;
  onAutoGenerate: () => void;
  onGenerateAll: () => void;
}

export function DialogueEditor({
  speakers,
  clonedVoices = [],
  topic,
  generating,
  progress,
  error,
  mergedAudioUrl,
  speakerAudios = null,
  onTextChange,
  onTopicChange,
  onAutoGenerate,
  onGenerateAll,
}: DialogueEditorProps) {
  const voiceLabel = (id: string): string => {
    const v = [...cosyvoiceVoices, ...clonedVoices].find((voice) => voice.id === id);
    return v ? `${v.label} · ${v.chinese ?? v.style}` : id;
  };

  const activeCount = speakers.filter((s) => s.text.trim()).length;
  const totalChars = speakers.reduce((acc, s) => acc + estimateChars(s.text), 0);
  const progressPct =
    generating && progress && progress.total > 0
      ? Math.round(((progress.done + 1) / progress.total) * 100)
      : 0;

  return (
    <section className="flex min-w-0 flex-col gap-4">
      {/* Per-speaker text areas */}
      <div className="space-y-4">
        {speakers.map((speaker, index) => {
          const style = SPEAKER_STYLE[speaker.color];
          const chars = estimateChars(speaker.text);
          const overLimit = chars > MAX_CHARS_PER_SPEAKER;
          return (
            <div
              key={speaker.id}
              className={cn(
                "overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-colors",
                style.border
              )}
            >
              {/* Card header */}
              <div
                className={cn(
                  "flex items-center gap-2 border-b border-gray-200 px-4 py-2.5",
                  style.headerBg
                )}
              >
                <span className="text-base leading-none">👤</span>
                <span className={cn("text-sm font-semibold", style.text)}>
                  {speaker.name || `Speaker ${index + 1}`}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    style.chip
                  )}
                >
                  {voiceLabel(speaker.voice)}
                </span>
                <span
                  className={cn(
                    "ml-auto text-[11px] font-medium tabular-nums",
                    overLimit ? "text-red-500" : "text-gray-500"
                  )}
                >
                  {chars}/{MAX_CHARS_PER_SPEAKER}
                </span>
              </div>

              {/* Textarea */}
              <textarea
                value={speaker.text}
                onChange={(e) => onTextChange(speaker.id, e.target.value)}
                placeholder={`Enter ${speaker.name || `Speaker ${index + 1}`}'s lines…`}
                rows={3}
                className={cn(
                  "block w-full resize-y rounded-b-xl border-0 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 outline-none transition-colors",
                  "focus:ring-2",
                  style.focusRing
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom action bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Topic + AI auto-generate */}
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Topic for AI dialogue, e.g. two friends talking about AI tools / podcast about space travel…"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-violet-500 focus:bg-gray-50 focus:ring-2 focus:ring-violet-100"
          />
          <button
            onClick={onAutoGenerate}
            disabled={generating || !topic.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" />
            AI Auto-Generate Dialogue
          </button>
        </div>

        {/* Generate + merge */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            onClick={onGenerateAll}
            disabled={generating || activeCount === 0}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-black/5 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generating ? "Generating…" : "Generate All & Merge"}
          </button>
          <span className="text-xs text-gray-500">
            {activeCount > 0
              ? `${activeCount} speaker${activeCount > 1 ? "s" : ""} · ~${totalChars} chars`
              : "Enter dialogue above to enable generation"}
          </span>

          {/* Progress */}
          {generating && progress && (
            <div className="flex flex-1 flex-col gap-1 sm:ml-2">
              <div className="flex items-center justify-between text-[11px] font-medium text-violet-600">
                <span>
                  Generating {Math.min(progress.done + 1, progress.total)}/
                  {progress.total}…
                </span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Merged result — one audio, all speakers talking */}
        {mergedAudioUrl && (
          <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="shrink-0 text-xs font-semibold text-violet-700">
                Merge Audio · {activeCount}-speaker dialogue
              </span>
              <audio controls src={mergedAudioUrl} className="h-10 min-w-0 flex-1" />
              <a
                href={mergedAudioUrl}
                download="dialogue-merged.wav"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700"
              >
                <Download className="h-3.5 w-3.5" />
                Download WAV
              </a>
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              {speakers
                .filter((s) => s.text.trim())
                .map((s) => `${s.name || "Speaker"} (${voiceLabel(s.voice)})`)
                .join("  ⇄  ")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
