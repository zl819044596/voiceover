"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Play,
  Square,
  Users,
  Volume2,
  Gauge,
  Activity,
  ChevronDown,
  Search,
  Heart,
  X,
} from "lucide-react";
import { cosyvoiceVoices, type Voice, type AgeGroup } from "@/config/site";
import { cn } from "@/lib/utils";

// ── Shared dialogue types & color system ─────────────────────────────────────

export type SpeakerColor = "purple" | "blue" | "green" | "orange";

export interface Speaker {
  id: string; // "speaker_1", "speaker_2", ...
  name: string; // "Speaker 1", "主持人", ...
  voice: string; // voice id from cosyvoiceVoices
  text: string; // dialogue text for this speaker
  color: SpeakerColor;
  instruct?: string; // optional CosyVoice instruct emotion directive
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

// ── Age-group metadata (mirrors /voiceover) ──────────────────────────────────

const AGE_ORDER: AgeGroup[] = ["male", "female", "child", "elderly"];

const AGE_META: Record<AgeGroup, { label: string; emoji: string }> = {
  male: { label: "男声", emoji: "👨" },
  female: { label: "女声", emoji: "👩" },
  child: { label: "童声", emoji: "🧒" },
  elderly: { label: "老年", emoji: "🧓" },
};

const avatarFor = (v: Voice) => (v.cloned ? "🤖" : AGE_META[v.age].emoji);

// ── Voice picker dropdown (search + grouped + favorites + preview) ───────────

interface VoicePickerProps {
  value: string;
  voices: Voice[]; // merged cosyvoice + cloned
  favorites: string[];
  previewingId: string | null;
  onSelect: (id: string) => void;
  onPreview: (voiceId: string) => void;
  onToggleFavorite: (voiceId: string) => void;
}

interface VoiceGroup {
  key: string;
  label: string;
  emoji: string;
  voices: Voice[];
}

function VoicePicker({
  value,
  voices,
  favorites,
  previewingId,
  onSelect,
  onPreview,
  onToggleFavorite,
}: VoicePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = voices.find((v) => v.id === value) ?? null;

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return voices;
    return voices.filter((v) =>
      [v.label, v.style, v.chinese, v.description, ...(v.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [voices, q]);

  // Build non-overlapping groups (favorites first, then clones, then age)
  const groups: VoiceGroup[] = useMemo(() => {
    if (q) return []; // flat search mode
    const fav = voices.filter((v) => favorites.includes(v.id));
    const clones = voices.filter((v) => v.cloned && !favorites.includes(v.id));
    const ageGroups: VoiceGroup[] = AGE_ORDER.map((age) => ({
      key: age,
      label: AGE_META[age].label,
      emoji: AGE_META[age].emoji,
      voices: voices.filter(
        (v) => !v.cloned && v.age === age && !favorites.includes(v.id)
      ),
    }));
    const result: VoiceGroup[] = [];
    if (fav.length)
      result.push({ key: "favorites", label: "我的收藏", emoji: "❤️", voices: fav });
    if (clones.length)
      result.push({ key: "clones", label: "克隆声音", emoji: "🎙️", voices: clones });
    return [...result, ...ageGroups.filter((g) => g.voices.length > 0)];
  }, [voices, favorites, q]);

  const toggleGroup = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderRow = (v: Voice) => {
    const selectedYet = value === v.id;
    const previewing = previewingId === v.id;
    const fav = favorites.includes(v.id);
    return (
      <div
        key={v.id}
        onClick={() => {
          onSelect(v.id);
          setOpen(false);
        }}
        className={cn(
          "group flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 transition-all",
          selectedYet
            ? "border-purple-600 bg-purple-600 text-white shadow-sm"
            : "border-transparent bg-gray-50 hover:border-purple-300 hover:bg-purple-50"
        )}
      >
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm",
            selectedYet ? "bg-white/20" : "bg-white"
          )}
        >
          {avatarFor(v)}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-[11px] font-semibold",
              selectedYet ? "text-white" : "text-gray-800"
            )}
          >
            {v.label}
            {v.cloned && (
              <span
                className={cn(
                  "ml-1 text-[8px]",
                  selectedYet ? "text-purple-200" : "text-purple-500"
                )}
              >
                🤖
              </span>
            )}
          </p>
          <p
            className={cn(
              "truncate text-[9px]",
              selectedYet ? "text-purple-200" : "text-gray-400"
            )}
          >
            {v.cloned ? "我的克隆声音" : v.chinese || v.style}
          </p>
        </div>
        {/* Preview */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(v.id);
          }}
          className={cn(
            "shrink-0 rounded-full p-1 transition-colors",
            previewing
              ? "bg-white text-purple-600"
              : selectedYet
                ? "text-purple-200 hover:text-white"
                : "text-gray-300 hover:bg-purple-100 hover:text-purple-600"
          )}
          title={previewing ? "停止试听" : "试听"}
        >
          {previewing ? (
            <Square className="h-3 w-3 fill-current" />
          ) : (
            <Play className="h-3 w-3 fill-current" />
          )}
        </button>
        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(v.id);
          }}
          className={cn(
            "shrink-0 rounded-full p-1 transition-colors",
            fav
              ? "text-red-400"
              : selectedYet
                ? "text-purple-200 hover:text-white"
                : "text-gray-300 hover:text-red-400"
          )}
          title={fav ? "取消收藏" : "收藏"}
        >
          <Heart className={cn("h-3 w-3", fav && "fill-current")} />
        </button>
      </div>
    );
  };

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-left text-xs transition-colors",
          "hover:border-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
        )}
      >
        <span className="text-sm leading-none">{selected ? avatarFor(selected) : "👤"}</span>
        <span className="min-w-0 flex-1 truncate font-medium text-gray-700">
          {selected
            ? `${selected.label}${selected.cloned ? " 🤖" : ""}`
            : "选择音色…"}
        </span>
        <span className="text-[9px] text-gray-400">
          {selected ? selected.chinese || selected.style : ""}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索音色…"
              className="w-full rounded-md border border-gray-200 bg-gray-50 py-1 pl-6 pr-6 text-[11px] placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Flat search results */}
          {q ? (
            <div className="space-y-1">
              {filtered.map(renderRow)}
              {filtered.length === 0 && (
                <p className="py-3 text-center text-[11px] text-gray-400">
                  没有匹配的音色
                </p>
              )}
            </div>
          ) : (
            /* Grouped browsing */
            <div className="space-y-2">
              {groups.map((g) => {
                const isCollapsed = !!collapsed[g.key];
                return (
                  <div key={g.key}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(g.key)}
                      className="flex w-full items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-left transition-colors hover:bg-gray-100"
                    >
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 text-gray-400 transition-transform",
                          isCollapsed && "-rotate-90"
                        )}
                      />
                      <span className="text-xs leading-none">{g.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-700">{g.label}</span>
                      <span className="ml-auto text-[9px] text-gray-400">{g.voices.length}</span>
                    </button>
                    {!isCollapsed && (
                      <div className="mt-1 space-y-1">{g.voices.map(renderRow)}</div>
                    )}
                  </div>
                );
              })}
              {groups.length === 0 && (
                <p className="py-3 text-center text-[11px] text-gray-400">暂无可选音色</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

interface SpeakerPanelProps {
  speakers: Speaker[];
  previewingId: string | null;
  speed: number;
  pitch: number;
  volume: number;
  clonedVoices: Voice[];
  favorites: string[];
  onAddSpeaker: () => void;
  onRemoveSpeaker: (id: string) => void;
  onRenameSpeaker: (id: string, name: string) => void;
  onVoiceChange: (id: string, voice: string) => void;
  onPreviewSpeaker: (id: string) => void;
  onPreviewVoice: (voiceId: string) => void;
  onSpeedChange: (value: number) => void;
  onPitchChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onToggleFavorite: (voiceId: string) => void;
  onInstructChange: (id: string, instruct: string) => void;
}

export function SpeakerPanel({
  speakers,
  previewingId,
  speed,
  pitch,
  volume,
  clonedVoices,
  favorites,
  onAddSpeaker,
  onRemoveSpeaker,
  onRenameSpeaker,
  onVoiceChange,
  onPreviewSpeaker,
  onPreviewVoice,
  onSpeedChange,
  onPitchChange,
  onVolumeChange,
  onToggleFavorite,
  onInstructChange,
}: SpeakerPanelProps) {
  // Merge built-in + cloned voices, dedupe by id
  const availableVoices = useMemo(() => {
    const seen = new Set<string>();
    const merged: Voice[] = [];
    for (const v of [...cosyvoiceVoices, ...clonedVoices]) {
      if (!seen.has(v.id)) {
        seen.add(v.id);
        merged.push(v);
      }
    }
    return merged;
  }, [clonedVoices]);

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
                "relative rounded-lg border bg-white p-3 shadow-sm transition-colors",
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

              {/* Voice picker */}
              <div className="flex items-center gap-2">
                <VoicePicker
                  value={speaker.voice}
                  voices={availableVoices}
                  favorites={favorites}
                  previewingId={previewingId}
                  onSelect={(voice) => onVoiceChange(speaker.id, voice)}
                  onPreview={onPreviewVoice}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>

              {/* Instruct directive (optional) */}
              <input
                value={speaker.instruct ?? ""}
                onChange={(e) => onInstructChange(speaker.id, e.target.value)}
                placeholder="情绪指令 (可选) e.g. cheerful and enthusiastic"
                className={cn(
                  "mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-[10px] text-gray-600 outline-none transition-colors placeholder:text-gray-300",
                  "focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                )}
              />
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
              <Activity className="h-3.5 w-3.5 text-purple-500" />
              Pitch
            </span>
            <span className="font-semibold text-purple-700">
              {pitch > 0 ? `+${pitch}` : pitch} st
            </span>
          </div>
          <input
            type="range"
            min={-20}
            max={20}
            step={1}
            value={pitch}
            onChange={(e) => onPitchChange(Number(e.target.value))}
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