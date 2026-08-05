"use client";

import { Plus, Trash2, Play, Square, Users, Volume2, Gauge } from "lucide-react";
import { cosyvoiceVoices } from "@/config/site";
import { cn } from "@/lib/utils";

// ── Shared dialogue types & color system ─────────────────────────────────────

export type SpeakerColor = "purple" | "blue" | "green" | "orange";

export interface Speaker {
  id: string; // "speaker_1", "speaker_2", ...
  name: string; // "Speaker 1", "主持人", ...
  voice: string; // voice id from cosyvoiceVoices
  text: string; // dialogue text for this speaker
  color: SpeakerColor;
}

export const SPEAKER_COLORS: SpeakerColor[] = ["purple", "blue", "green", "orange"];
export const MAX_SPEAKERS = SPEAKER_COLORS.length;

export interface SpeakerColorStyles {
  dot: string;
  text: string;
  chip: string;
  border: string;
  bubble: string;
  bubbleBorder: string;
  headerBg: string;
  focusRing: string;
  avatarBg: string;
}

export const SPEAKER_STYLE: Record<SpeakerColor, SpeakerColorStyles> = {
  purple: {
    dot: "bg-purple-500",
    text: "text-purple-700",
    chip: "bg-purple-100 text-purple-800",
    border: "border-purple-400",
    bubble: "bg-purple-100",
    bubbleBorder: "border-purple-200",
    headerBg: "bg-purple-50",
    focusRing: "focus:border-purple-500 focus:ring-purple-200",
    avatarBg: "bg-purple-600",
  },
  blue: {
    dot: "bg-blue-500",
    text: "text-blue-700",
    chip: "bg-blue-100 text-blue-800",
    border: "border-blue-400",
    bubble: "bg-blue-100",
    bubbleBorder: "border-blue-200",
    headerBg: "bg-blue-50",
    focusRing: "focus:border-blue-500 focus:ring-blue-200",
    avatarBg: "bg-blue-600",
  },
  green: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    chip: "bg-emerald-100 text-emerald-800",
    border: "border-emerald-400",
    bubble: "bg-emerald-100",
    bubbleBorder: "border-emerald-200",
    headerBg: "bg-emerald-50",
    focusRing: "focus:border-emerald-500 focus:ring-emerald-200",
    avatarBg: "bg-emerald-600",
  },
  orange: {
    dot: "bg-orange-500",
    text: "text-orange-700",
    chip: "bg-orange-100 text-orange-800",
    border: "border-orange-400",
    bubble: "bg-orange-100",
    bubbleBorder: "border-orange-200",
    headerBg: "bg-orange-50",
    focusRing: "focus:border-orange-500 focus:ring-orange-200",
    avatarBg: "bg-orange-600",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

interface SpeakerPanelProps {
  speakers: Speaker[];
  previewingId: string | null;
  speed: number;
  volume: number;
  onAddSpeaker: () => void;
  onRemoveSpeaker: (id: string) => void;
  onRenameSpeaker: (id: string, name: string) => void;
  onVoiceChange: (id: string, voice: string) => void;
  onPreviewSpeaker: (id: string) => void;
  onSpeedChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
}

export function SpeakerPanel({
  speakers,
  previewingId,
  speed,
  volume,
  onAddSpeaker,
  onRemoveSpeaker,
  onRenameSpeaker,
  onVoiceChange,
  onPreviewSpeaker,
  onSpeedChange,
  onVolumeChange,
}: SpeakerPanelProps) {
  return (
    <aside className="flex flex-col rounded-xl border border-purple-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 rounded-t-xl bg-purple-600 px-4 py-3">
        <Users className="h-4 w-4 text-purple-100" />
        <h2 className="text-sm font-semibold text-white">Multi-Speaker Dialogue</h2>
      </div>

      {/* Speaker list */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {speakers.map((speaker, index) => {
          const style = SPEAKER_STYLE[speaker.color];
          const isPreviewing = previewingId === speaker.id;
          return (
            <div
              key={speaker.id}
              className={cn(
                "rounded-lg border bg-white p-3 shadow-sm transition-colors",
                isPreviewing ? style.border : "border-gray-200"
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", style.dot)} />
                <input
                  value={speaker.name}
                  onChange={(e) => onRenameSpeaker(speaker.id, e.target.value)}
                  placeholder={`Speaker ${index + 1}`}
                  className={cn(
                    "w-full min-w-0 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold text-gray-800 outline-none transition-colors hover:border-gray-200 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  )}
                />
                <button
                  onClick={() => onPreviewSpeaker(speaker.id)}
                  disabled={isPreviewing}
                  title={isPreviewing ? "Stop preview" : "Preview this voice"}
                  className={cn(
                    "shrink-0 rounded-md p-1.5 transition-colors",
                    isPreviewing
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:bg-purple-50 hover:text-purple-600"
                  )}
                >
                  {isPreviewing ? (
                    <Square className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onRemoveSpeaker(speaker.id)}
                  disabled={speakers.length <= 1}
                  title="Remove speaker"
                  className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base leading-none">👤</span>
                <select
                  value={speaker.voice}
                  onChange={(e) => onVoiceChange(speaker.id, e.target.value)}
                  className={cn(
                    "w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-700 outline-none transition-colors",
                    "focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  )}
                >
                  {cosyvoiceVoices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} · {v.chinese ?? v.style}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}

        <button
          onClick={onAddSpeaker}
          disabled={speakers.length >= MAX_SPEAKERS}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-purple-200 px-3 py-2 text-xs font-medium text-purple-600 transition-colors hover:border-purple-400 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Speaker
        </button>
      </div>

      {/* Global controls */}
      <div className="space-y-3 border-t border-purple-50 bg-purple-50/50 p-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-medium text-gray-600">
              <Gauge className="h-3.5 w-3.5 text-purple-500" />
              Speed
            </span>
            <span className="font-semibold text-purple-700">{speed.toFixed(2)}×</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-medium text-gray-600">
              <Volume2 className="h-3.5 w-3.5 text-purple-500" />
              Volume
            </span>
            <span className="font-semibold text-purple-700">{volume}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      </div>
    </aside>
  );
}
