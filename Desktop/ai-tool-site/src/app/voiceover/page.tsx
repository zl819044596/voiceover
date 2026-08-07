"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Mic,
  Download,
  Loader2,
  Sparkles,
  Play,
  Square,
  Plus,
  X,
  Upload,
  Trash2,
  AlertCircle,
  Heart,
  Search,
  ChevronDown,
  Volume2,
  Gauge,
  Activity,
} from "lucide-react";
import {
  cosyvoiceVoices,
  languageOptions,
  freeQuota,
  planQuotas,
  type LanguageCode,
  type Voice,
  type AgeGroup,
} from "@/config/site";
import { estimateChars } from "@/lib/utils";
import {
  canGenerate,
  incrementUsage,
  getRemainingToday,
  getTotalAvailable,
  getTodayUsed,
} from "@/lib/usage-tracker";
import { ShareBonus } from "@/components/share-bonus";
import { useAuth } from "@/lib/auth-context";

const CLONED_VOICES_KEY = "voiceover-cloned-voices";
const FAVORITES_KEY = "voiceover-favorites";
const MAX_CLONE_SIZE = 10 * 1024 * 1024; // 10MB (matches worker limit)

type VoiceTab = "all" | "favorites" | "clones";

const AGE_ORDER: AgeGroup[] = ["male", "female", "child", "elderly"];

const AGE_META: Record<AgeGroup, { label: string; emoji: string }> = {
  male: { label: "Male", emoji: "👨" },
  female: { label: "Female", emoji: "👩" },
  child: { label: "Child", emoji: "🧒" },
  elderly: { label: "Elderly", emoji: "🧓" },
};

const LANG_META = Object.fromEntries(
  languageOptions.map((o) => [o.code, o])
) as Record<LanguageCode, (typeof languageOptions)[number]>;

// Two-level language groups for display
// CosyVoice-V2 is a multilingual model — the same voice can read ANY language
// (language is determined by the text content). So no language is locked.
interface LangGroup {
  code: string;          // parent key
  label: string;         // display label
  flag: string;
  locked?: boolean;
  children: { code: LanguageCode; label: string; flag: string }[];
}
const LANGUAGE_GROUPS: LangGroup[] = [
  {
    code: "zh", label: "Mandarin", flag: "🇨🇳",
    children: [{ code: "zh", label: "Mandarin", flag: "🇨🇳" }],
  },
  {
    code: "en", label: "English", flag: "🇬🇧",
    children: [{ code: "en", label: "English", flag: "🇬🇧" }],
  },
  {
    code: "ja", label: "日本語", flag: "🇯🇵",
    children: [{ code: "ja", label: "日本語", flag: "🇯🇵" }],
  },
  {
    code: "ko", label: "한국어", flag: "🇰🇷",
    children: [{ code: "ko", label: "한국어", flag: "🇰🇷" }],
  },
  {
    code: "de", label: "Deutsch", flag: "🇩🇪",
    children: [{ code: "de", label: "Deutsch", flag: "🇩🇪" }],
  },
  {
    code: "fr", label: "Français", flag: "🇫🇷",
    children: [{ code: "fr", label: "Français", flag: "🇫🇷" }],
  },
  {
    code: "es", label: "Español", flag: "🇪🇸",
    children: [{ code: "es", label: "Español", flag: "🇪🇸" }],
  },
  {
    code: "it", label: "Italiano", flag: "🇮🇹",
    children: [{ code: "it", label: "Italiano", flag: "🇮🇹" }],
  },
  {
    code: "ru", label: "Русский", flag: "🇷🇺",
    children: [{ code: "ru", label: "Русский", flag: "🇷🇺" }],
  },
];

const CATEGORY_META: { id: VoiceTab; label: string; short?: string }[] = [
  { id: "all", label: "All Voices" },
  { id: "favorites", label: "Favorites", short: "Favs" },
  { id: "clones", label: "Clones", short: "Clones" },
];

// Preview sample text per language
const SAMPLE_BY_LANG: Record<LanguageCode, (label: string) => string> = {
  zh: (l) => `你好！我是${l}，很高兴为你朗读这段声音。`,
  en: (l) => `Hi! I'm ${l}. This is how I sound — warm, clear and natural.`,
  yue: (l) => `你好！我係${l}，好開心可以同你朗讀呢段聲音。`,
  sichuan: (l) => `你好！我是${l}，很高兴给你朗读这段声音。`,
  ja: (l) => `こんにちは！私は${l}です。よろしくお願いします。`,
  ko: (l) => `안녕하세요! 저는 ${l}입니다. 만나서 반갑습니다.`,
  de: (l) => `Hallo! Ich bin ${l}. Schön, dich kennenzulernen.`,
  fr: (l) => `Bonjour ! Je suis ${l}. Enchanté de vous rencontrer.`,
  es: (l) => `¡Hola! Soy ${l}. Encantado de conocerte.`,
  it: (l) => `Ciao! Sono ${l}. Piacere di conoscerti.`,
  ru: (l) => `Привет! Я ${l}. Приятно познакомиться.`,
};

const TAG_LABELS: Record<string, string> = {
  news: "News",
  documentary: "Documentary",
  education: "Education",
  narration: "Narration",
  audiobook: "Audiobook",
  storytelling: "Storytelling",
  marketing: "Marketing",
  vlog: "Vlog",
  entertainment: "Entertainment",
  tiktok: "Short Video",
  emotional: "Emotional",
  lifestyle: "Lifestyle",
  meditation: "Meditation",
  business: "Business",
  training: "Training",
  corporate: "Corporate",
  sleep: "Sleep",
  wellness: "Wellness",
  "customer-service": "Service",
  tutorial: "Tutorial",
  sports: "Sports",
  travel: "Travel",
  poetry: "Poetry",
  literature: "Literature",
  culture: "Culture",
  daily: "Daily",
  food: "Food",
  general: "General",
  "all-purpose": "All-Purpose",
  advertising: "Advertising",
  promo: "Promo",
  brand: "Brand",
  film: "Film",
  cinematic: "Cinematic",
  gaming: "Gaming",
  variety: "Variety",
  kids: "Kids",
  family: "Family",
};

export default function VoiceoverPage() {
  const { isLoggedIn, login, isPro, subscription } = useAuth();

  // ── Voice & language ──
  const [voice, setVoice] = useState<string>(cosyvoiceVoices[0].id);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>("zh");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [clonedVoices, setClonedVoices] = useState<Voice[]>([]);

  // ── Voice browsing ──
  const [tab, setTab] = useState<VoiceTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<Record<AgeGroup, boolean>>({
    male: false,
    female: false,
    child: false,
    elderly: false,
  });

  // ── Text & generation ──
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [polishedText, setPolishedText] = useState("");
  const [showCreditsExhausted, setShowCreditsExhausted] = useState(false);

  // ── Voice settings (right panel) ──
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0); // semitones, -20 .. +20
  const [volume, setVolume] = useState(80); // 0-100
  const [instruct, setInstruct] = useState("");

  // ── Preview ──
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // ── Clone panel ──
  const [cloneOpen, setCloneOpen] = useState(false);
  const [cloneFile, setCloneFile] = useState<File | null>(null);
  const [cloneName, setCloneName] = useState("");
  const [clonePrompt, setClonePrompt] = useState("");
  const [cloneDuration, setCloneDuration] = useState<number | null>(null);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [cloneError, setCloneError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clonePanelRef = useRef<HTMLDivElement>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Load cloned voices from localStorage ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLONED_VOICES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Voice[];
        if (Array.isArray(parsed)) setClonedVoices(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // ── Load favorites from localStorage ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setFavorites(parsed.filter((x): x is string => typeof x === "string"));
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const persistClonedVoices = (list: Voice[]) => {
    setClonedVoices(list);
    try {
      localStorage.setItem(CLONED_VOICES_KEY, JSON.stringify(list));
    } catch {
      // storage may be full/unavailable — voice still works this session
    }
  };

  // ── Derived state ──
  const charsUsed = estimateChars(text);
  // Members get the per-request cap of their plan; free users get freeQuota.
  const maxCharsPerTts = isPro
    ? planQuotas[subscription?.plan ?? "free"]?.maxCharsPerTts ??
      freeQuota.maxCharsPerTts
    : freeQuota.maxCharsPerTts;
  const isOverLimit = charsUsed > maxCharsPerTts;

  const availableVoices = useMemo(
    () => [...cosyvoiceVoices, ...clonedVoices],
    [clonedVoices]
  );
  const selectedVoice =
    availableVoices.find((v) => v.id === voice) || cosyvoiceVoices[0];

  // ── Voice browsing: tabs, search ──
  const tabVoices = useMemo(() => {
    let list: Voice[];
    switch (tab) {
      case "favorites":
        list = availableVoices.filter((v) => favorites.includes(v.id));
        break;
      case "clones":
        list = clonedVoices;
        break;
      default:
        list = availableVoices;
    }
    // NOTE: CosyVoice-V2 is a multilingual model — every voice can read every
    // language. So we do NOT filter by language; the language selector only
    // picks the target language for preview/generation text.
    return list;
  }, [tab, availableVoices, favorites, clonedVoices]);

  const visibleVoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tabVoices;
    return tabVoices.filter((v) =>
      [v.label, v.style, v.chinese, v.description, ...(v.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [tabVoices, searchQuery]);

  const tabCount = (t: VoiceTab): number => {
    switch (t) {
      case "favorites":
        return availableVoices.filter((v) => favorites.includes(v.id)).length;
      case "clones":
        return clonedVoices.length;
      default:
        return availableVoices.length;
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // storage may be full/unavailable
      }
      return next;
    });
  };

  const toggleCollapse = (age: AgeGroup) =>
    setCollapsed((prev) => ({ ...prev, [age]: !prev[age] }));

  const avatarFor = (v: Voice) => {
    if (v.cloned) return "🤖";
    return AGE_META[v.age].emoji;
  };

  // ── Preview a voice with a short sample ──
  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setPreviewingId(null);
  };

  const handlePreview = async (v: Voice) => {
    if (previewingId === v.id) {
      stopPreview();
      return;
    }
    stopPreview();
    setPreviewingId(v.id);
    setError("");

    const sample = SAMPLE_BY_LANG[selectedLang](v.label);

    try {
      const res = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [sample],
          voice: v.id,
          engine: "cosyvoice-v2",
          speed,
          volume,
          pitch: Math.pow(2, pitch / 12),
          enableSsml: false,
        }),
        // wingray can hang for a long time; don't let the preview spin forever
        signal: AbortSignal.timeout(25000),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Preview failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setPreviewingId(null);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setPreviewingId(null);
        setError("Could not play this voice preview.");
        URL.revokeObjectURL(url);
      };
      previewAudioRef.current = audio;
      try {
        await audio.play();
      } catch (playErr) {
        // Autoplay policy: if the TTS round-trip outlasts the user-gesture
        // activation window, Chrome rejects play(). Resume on next tap.
        if (playErr instanceof DOMException && playErr.name === "NotAllowedError") {
          const resume = () => {
            audio.play().catch(() => {});
            window.removeEventListener("pointerdown", resume);
          };
          window.addEventListener("pointerdown", resume);
          return;
        }
        throw playErr;
      }
    } catch {
      setPreviewingId(null);
      setError("Could not load this voice preview. Please try again.");
    }
  };

  // ── Generate ──
  const handleGenerate = async () => {
    if (!text.trim() || isOverLimit) return;
    if (!canGenerate(isPro)) {
      setShowCreditsExhausted(true);
      return;
    }
    setShowCreditsExhausted(false);
    setLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const sourceText = polishedText || text;

      const res = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [sourceText],
          voice,
          engine: "cosyvoice-v2",
          speed,
          volume,
          pitch: Math.pow(2, pitch / 12),
          enableSsml: false,
          ...(instruct.trim() ? { instruct: instruct.trim() } : {}),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      incrementUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── AI Polish ──
  const handlePolish = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "MiniMax-M2.7",
          systemPrompt: `You are a professional short-video voiceover script editor. Your job is to preprocess raw text into a polished, speakable voiceover script optimized for TTS synthesis.

1. Rewrite for natural speech flow — short punchy sentences, conversational tone
2. Add an attention-grabbing hook at the start
3. Add a clear call-to-action at the end
4. Insert natural pauses with dashes and line breaks
5. Optimize pacing for short video (15–60 seconds)

Output ONLY the polished script — no explanations, no markdown.`,
          userMessage: text,
          temperature: 0.8,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setPolishedText(data.content);
      }
    } catch {
      // Polish is non-critical
    } finally {
      setLoading(false);
    }
  };

  // ── Clone panel helpers ──
  const openClonePanel = () => {
    if (!isLoggedIn) {
      login();
      return;
    }
    setCloneOpen(true);
    setTimeout(
      () =>
        clonePanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      50
    );
  };

  const handleCloneFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      setCloneFile(null);
      setCloneDuration(null);
      setCloneError("Please choose an audio file (MP3/WAV)");
      return;
    }
    if (file.size > MAX_CLONE_SIZE) {
      setCloneFile(null);
      setCloneDuration(null);
      setCloneError("Audio file must be under 10MB");
      return;
    }
    setCloneFile(file);
    setCloneError("");
    setCloneDuration(null);

    // Read duration to validate the 10–30s requirement
    const url = URL.createObjectURL(file);
    const probe = new Audio(url);
    probe.addEventListener(
      "loadedmetadata",
      () => {
        setCloneDuration(probe.duration);
        URL.revokeObjectURL(url);
      },
      { once: true }
    );
    probe.addEventListener("error", () => URL.revokeObjectURL(url), {
      once: true,
    });
  };

  const handleCloneSubmit = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }
    if (!cloneFile) {
      setCloneError("Please upload an audio file first");
      return;
    }
    if (!cloneName.trim()) {
      setCloneError("Please enter a voice name");
      return;
    }
    if (!clonePrompt.trim()) {
      setCloneError("Please enter the text spoken in the audio (prompt_text)");
      return;
    }
    if (cloneDuration !== null && (cloneDuration < 10 || cloneDuration > 30)) {
      setCloneError(`Audio must be 10–30 seconds long (currently ${cloneDuration.toFixed(1)}s)`);
      return;
    }

    setCloneLoading(true);
    setCloneError("");

    try {
      const fd = new FormData();
      fd.append("audio_file", cloneFile);
      fd.append("voice_name", cloneName.trim());
      fd.append("prompt_text", clonePrompt.trim());
      fd.append("engine", "cosyvoice-v2");

      const res = await fetch("/api/tts/clone", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Cloning failed, please try again");
      }

      const data = await res.json();
      const newVoice: Voice = {
        id: data.voiceId || cloneName.trim(),
        label: cloneName.trim(),
        gender: "female",
        age: "female",
        style: "Cloned",
        engine: "cosyvoice-v2",
        language: "zh",
        description: "My cloned voice · trained from uploaded audio",
        tags: [],
        cloned: true,
      };

      // Dedupe by id, then append
      const next = [
        ...clonedVoices.filter((v) => v.id !== newVoice.id),
        newVoice,
      ];
      persistClonedVoices(next);

      // Close panel and select the new clone
      setCloneOpen(false);
      setCloneFile(null);
      setCloneName("");
      setClonePrompt("");
      setCloneDuration(null);
      setTab("clones");
      setVoice(newVoice.id);
    } catch (err) {
      setCloneError(err instanceof Error ? err.message : "Cloning failed, please try again");
    } finally {
      setCloneLoading(false);
    }
  };

  const handleDeleteClone = (id: string) => {
    const next = clonedVoices.filter((v) => v.id !== id);
    persistClonedVoices(next);
    if (voice === id) setVoice(cosyvoiceVoices[0].id);
  };

  const clearFilters = () => {
    setTab("all");
    setSearchQuery("");
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
      {/* Header banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 p-6 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Mic className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">AI Voiceover Studio</h1>
            <p className="mt-1 text-sm text-violet-100">
              Turn text into natural voiceover audio. Free tier: 10,000 chars/month, 1,000 chars/request.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            17 Voices
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            9 Languages
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            MP3 Download
          </span>
        </div>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-[16rem_minmax(0,1fr)_20rem]">
        {/* ══ Left column: language selector + voice library ══ */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:col-span-2 lg:col-span-1">
          {/* Language selector */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400">Language</p>
              <span className="text-[10px] text-gray-400">
                {(() => { const child = LANGUAGE_GROUPS.flatMap(g => g.children).find(c => c.code === selectedLang); return child ? `${child.flag} ${child.label}` : "Mandarin"; })()}
              </span>
            </div>
            <p className="mb-2 text-[10px] leading-relaxed text-gray-400">
              Pick the target language for your text. Every voice can speak any language.
            </p>
            <div className="space-y-1">
              {LANGUAGE_GROUPS.map((group) => {
                const hasChildren = group.children.length > 1;
                const isExpanded = expandedGroup === group.code;
                const isGroupActive = group.children.some((c) => c.code === selectedLang);
                return (
                  <div key={group.code}>
                    {/* Parent button */}
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          setExpandedGroup(isExpanded ? null : group.code);
                        } else {
                          setSelectedLang(group.children[0].code);
                          setExpandedGroup(null);
                        }
                      }}
                      title={group.label}
                      className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-medium transition-all ${
                        isGroupActive
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:bg-violet-50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">{group.flag}</span>
                        <span>{group.label}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        {hasChildren && (
                          <ChevronDown
                            className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        )}
                      </span>
                    </button>
                    {/* Child options */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-violet-100 pl-3">
                        {group.children.map((child) => {
                          const isActive = selectedLang === child.code;
                          return (
                            <button
                              key={child.code}
                              onClick={() => {
                                setSelectedLang(child.code);
                                setExpandedGroup(null);
                              }}
                              className={`block w-full rounded-md px-2 py-1 text-left text-[11px] font-medium transition-all ${
                                isActive
                                  ? "bg-violet-100 text-violet-700"
                                  : "text-gray-400 hover:bg-violet-50 hover:text-violet-600"
                              }`}
                            >
                              <span className="text-xs">{child.flag}</span>{" "}
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search voices (name / style / tag)..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-7 text-xs placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                title="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Currently selected voice */}
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-violet-100 bg-violet-50 p-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-lg shadow-sm">
              {avatarFor(selectedVoice)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-gray-900">
                {selectedVoice.label}
                {selectedVoice.cloned && (
                  <span className="ml-1 rounded bg-gray-900 px-1 py-0.5 text-[9px] font-bold text-white">
                    🤖
                  </span>
                )}
              </p>
              <p className="truncate text-[10px] text-violet-600">● In use</p>
            </div>
          </div>

          {/* Tabs: all / favorites / clones */}
          <div className="mt-3 flex gap-1 rounded-lg bg-gray-50 p-1">
            {CATEGORY_META.map((c) => (
              <button
                key={c.id}
                onClick={() => setTab(c.id)}
                className={`flex-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-all ${
                  tab === c.id
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-400 hover:text-gray-800"
                }`}
              >
                {c.short ?? c.label}
                <span className={tab === c.id ? "text-violet-600/80" : "text-gray-400"}>
                  {" "}({tabCount(c.id)})
                </span>
              </button>
            ))}
          </div>

          {/* Voice gallery grouped by age */}
          <div className="mt-3 max-h-[430px] space-y-2 overflow-y-auto pr-0.5">
            {AGE_ORDER.map((age) => {
              const group = visibleVoices.filter((v) => v.age === age);
              if (group.length === 0) return null;
              const isCollapsed = collapsed[age];
              return (
                <div key={age}>
                  <button
                    onClick={() => toggleCollapse(age)}
                    className="flex w-full items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 text-left transition-colors hover:bg-gray-50"
                  >
                    <ChevronDown
                      className={`h-3 w-3 text-gray-400 transition-transform ${
                        isCollapsed ? "" : "rotate-180"
                      }`}
                    />
                    <span className="text-sm leading-none">{AGE_META[age].emoji}</span>
                    <span className="text-[11px] font-bold text-gray-700">
                      {AGE_META[age].label}
                    </span>
                    <span className="ml-auto text-[10px] text-gray-400">
                      {group.length}
                    </span>
                  </button>
                  {!isCollapsed && (
                    <div className="mt-1 space-y-1">
                      {group.map((v) => {
                        const selected = voice === v.id;
                        const previewing = previewingId === v.id;
                        const fav = favorites.includes(v.id);
                        const isClone = !!v.cloned;
                        return (
                          <div
                            key={v.id}
                            onClick={() => setVoice(v.id)}
                            className={`group flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 transition-all ${
                              selected
                                ? "border-violet-500 bg-gray-900 text-white shadow-sm"
                                : "border-transparent bg-gray-50 hover:border-violet-200 hover:bg-violet-50"
                            }`}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base ${
                                selected ? "bg-gray-200" : "bg-gray-100"
                              }`}
                            >
                              {avatarFor(v)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p
                                className={`truncate text-xs font-semibold ${
                                  selected ? "text-white" : "text-gray-800"
                                }`}
                              >
                                <span className="mr-1">
                                  {LANG_META[v.language]?.flag ?? "🌐"}
                                </span>
                                {v.label}
                                {isClone && (
                                  <span
                                    className={`ml-1 text-[9px] ${
                                      selected ? "text-violet-200" : "text-violet-600"
                                    }`}
                                  >
                                    🤖
                                  </span>
                                )}
                              </p>
                              <p
                                className={`truncate text-[10px] ${
                                  selected ? "text-violet-200" : "text-gray-400"
                                }`}
                              >
                                {isClone ? "My clone" : v.chinese || v.style}
                              </p>
                            </div>
                            {/* Preview */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(v);
                              }}
                              className={`shrink-0 rounded-full p-1 transition-colors ${
                                previewing
                                  ? "bg-gray-100 text-violet-600"
                                  : selected
                                    ? "text-violet-200 hover:text-white"
                                    : "text-gray-400 hover:bg-violet-100 hover:text-violet-600"
                              }`}
                              title={previewing ? "Stop preview" : "Preview"}
                            >
                              {previewing ? (
                                <Square className="h-3.5 w-3.5 fill-current" />
                              ) : (
                                <Play className="h-3.5 w-3.5 fill-current" />
                              )}
                            </button>
                            {/* Favorite */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(v.id);
                              }}
                              className={`shrink-0 rounded-full p-1 transition-colors ${
                                fav
                                  ? "text-red-400"
                                  : selected
                                    ? "text-violet-200 hover:text-white"
                                    : "text-gray-400 hover:text-red-400"
                              }`}
                              title={fav ? "Unfavorite" : "Favorite"}
                            >
                              <Heart
                                className={`h-3.5 w-3.5 ${fav ? "fill-current" : ""}`}
                              />
                            </button>
                            {/* Delete clone */}
                            {isClone && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClone(v.id);
                                }}
                                className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                title="Delete clone"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty state */}
            {visibleVoices.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-gray-400">
                <p className="text-xs">
                  {tab === "clones"
                    ? "No clones yet"
                    : tab === "favorites"
                      ? "No favorites yet"
                      : "No matching voices"}
                </p>
                {(searchQuery || tab !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="mt-1 text-[11px] text-violet-600 underline hover:text-violet-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Clone button */}
          <button
            onClick={openClonePanel}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-violet-200 bg-violet-50 py-2 text-xs font-semibold text-violet-600 transition-colors hover:border-violet-300 hover:bg-violet-100"
          >
            <Plus className="h-3.5 w-3.5" />
            Voice Cloning 🔬
          </button>
        </aside>

        {/* ══ Center column: text input + clone + generate ══ */}
        <main className="min-w-0 space-y-4">
          {/* Text input */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setPolishedText("");
              }}
              placeholder="Type your script here..."
              rows={8}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none resize-none"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`text-xs ${
                  isOverLimit ? "text-red-600 font-medium" : "text-gray-400"
                }`}
              >
                {charsUsed} / {maxCharsPerTts} chars
                {isOverLimit && " — over limit!"}
              </span>
              <button
                onClick={handlePolish}
                disabled={!text.trim() || loading}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-50 transition-colors"
                title="MiniMax M2.7 — Script polishing & optimization"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Polish
              </button>
            </div>
          </div>

          {/* Polished result */}
          {polishedText && (
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-medium text-violet-700">
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  MiniMax M2.7 — Polished Script
                </p>
                <span className="text-xs text-violet-600/80">Voiceover optimized</span>
              </div>
              <p className="text-sm text-violet-900">{polishedText}</p>
              <button
                onClick={() => setPolishedText("")}
                className="mt-2 text-xs text-violet-600 hover:text-violet-700"
              >
                Use original instead
              </button>
            </div>
          )}

          {/* Clone upload panel */}
          <div
            ref={clonePanelRef}
            className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                🔬 Voice Cloning
              </h3>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    login();
                    return;
                  }
                  setCloneOpen(!cloneOpen);
                }}
                className="text-xs text-gray-400 hover:text-gray-500"
              >
                {cloneOpen ? "Collapse ▲" : "Expand ▼"}
              </button>
            </div>
            {cloneOpen ? (
              <div className="space-y-3">
                {/* Audio upload */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Audio file (MP3/WAV, 10–30s, clear voice)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                    className="hidden"
                    onChange={(e) => handleCloneFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={cloneLoading}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 text-left transition-colors disabled:opacity-50 ${
                      cloneFile
                        ? "border-violet-200 bg-violet-50"
                        : "border-gray-200 bg-gray-50 hover:border-violet-200 hover:bg-violet-50"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <Upload className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      {cloneFile ? (
                        <>
                          <span className="block truncate text-sm font-medium text-gray-900">
                            {cloneFile.name}
                          </span>
                          <span className="block text-xs text-gray-400">
                            {(cloneFile.size / 1024 / 1024).toFixed(1)} MB
                            {cloneDuration !== null &&
                              ` · ${cloneDuration.toFixed(1)}s${
                                cloneDuration < 10 || cloneDuration > 30
                                  ? " ⚠️ 10–30s recommended"
                                  : ""
                              }`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="block text-sm font-medium text-gray-700">
                            Click to choose an audio file
                          </span>
                          <span className="block text-xs text-gray-400">
                            MP3 / WAV supported, up to 10MB
                          </span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Voice name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Voice name
                  </label>
                  <input
                    type="text"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    disabled={cloneLoading}
                    placeholder="e.g. My Voice"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none disabled:opacity-50"
                  />
                </div>

                {/* Prompt text */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Text spoken in the audio (prompt_text)
                  </label>
                  <textarea
                    value={clonePrompt}
                    onChange={(e) => setClonePrompt(e.target.value)}
                    disabled={cloneLoading}
                    rows={3}
                    placeholder="Paste the exact words read in the audio to help AI match the voice…"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none resize-none disabled:opacity-50"
                  />
                </div>

                {cloneError && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{cloneError}</span>
                  </div>
                )}

                <button
                  onClick={handleCloneSubmit}
                  disabled={cloneLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {cloneLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cloning…
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start Cloning
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Upload a clear 10–30s voice recording and AI will clone it.
              </p>
            )}
          </div>

          {/* Credits exhausted */}
          {showCreditsExhausted && (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">
                Credit exhausted — share to get more!
              </p>
              <ShareBonus />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate + preview buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={!text.trim() || isOverLimit || loading || !canGenerate(isPro)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm shadow-black/5"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
              {loading ? "Generating..." : "🎤 Generate Voiceover"}
            </button>
            <button
              onClick={() => handlePreview(selectedVoice)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3.5 text-sm font-semibold text-violet-700 hover:bg-violet-100 disabled:opacity-50 transition-colors"
              title="Preview current voice"
            >
              {previewingId === selectedVoice.id ? (
                <Square className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
              Preview
            </button>
          </div>

          {/* Audio player */}
          {audioUrl && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <audio ref={audioRef} controls className="w-full" src={audioUrl}>
                Your browser does not support audio playback.
              </audio>
              <div className="mt-3 flex items-center gap-4">
                <a
                  href={audioUrl}
                  download="voiceover.mp3"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700"
                >
                  <Download className="h-4 w-4" />
                  Download MP3
                </a>
                <button
                  onClick={() => setAudioUrl(null)}
                  className="text-xs text-gray-400 hover:text-gray-500"
                >
                  Clear audio
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ══ Right column: voice detail + sliders + instruct ══ */}
        <aside className="min-w-0 space-y-4">
          {/* Current voice detail */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold text-gray-400">
              Current Voice
            </p>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-3xl shadow-sm">
                {avatarFor(selectedVoice)}
              </span>
              <h3 className="mt-2 flex items-center gap-1 text-base font-semibold text-gray-900">
                {selectedVoice.label}
                {selectedVoice.cloned && (
                  <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    🤖 Clone
                  </span>
                )}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
                <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  {LANG_META[selectedVoice.language]?.flag}{" "}
                  {LANG_META[selectedVoice.language]?.label ?? "Mandarin"}
                </span>
                <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  {AGE_META[selectedVoice.age]?.emoji}{" "}
                  {AGE_META[selectedVoice.age]?.label ?? "Female"}
                </span>
              </div>
            </div>

            {selectedVoice.chinese && (
              <p className="mt-3 text-center text-xs font-medium text-gray-700">
                {selectedVoice.chinese}
              </p>
            )}
            {selectedVoice.description && (
              <p className="mt-2 text-center text-xs leading-relaxed text-gray-400">
                {selectedVoice.description}
              </p>
            )}
            {selectedVoice.tags && selectedVoice.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {selectedVoice.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-600"
                  >
                    {TAG_LABELS[t] ?? t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Parameters: speed / pitch / volume / instruct */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-semibold text-gray-400">
              Voice Settings
            </p>

            {/* Speed */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Gauge className="h-3.5 w-3.5 text-violet-600" />
                  Speed
                </label>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-semibold text-violet-700">
                  {speed.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-violet-600"
              />
              <div className="flex justify-between text-[9px] text-gray-400">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>1.5x</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Activity className="h-3.5 w-3.5 text-violet-600" />
                  Pitch
                </label>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-semibold text-violet-700">
                  {pitch > 0 ? `+${pitch}` : pitch} st
                </span>
              </div>
              <input
                type="range"
                min={-20}
                max={20}
                step={1}
                value={pitch}
                onChange={(e) => setPitch(parseInt(e.target.value, 10))}
                className="w-full accent-violet-600"
              />
              <div className="flex justify-between text-[9px] text-gray-400">
                <span>-20</span>
                <span>0</span>
                <span>+20</span>
              </div>
            </div>

            {/* Volume */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Volume2 className="h-3.5 w-3.5 text-violet-600" />
                  Volume
                </label>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-semibold text-violet-700">
                  {volume}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                className="w-full accent-violet-600"
              />
            </div>

            {/* Instruct */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">
                  Instruct
                </label>
                <span className="text-[9px] text-gray-400">Instruct mode</span>
              </div>
              <textarea
                value={instruct}
                onChange={(e) => setInstruct(e.target.value)}
                rows={3}
                placeholder="e.g. Speak in a cheerful and enthusiastic tone, like a game show host"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none resize-none"
              />
              {instruct.trim() && (
                <p className="mt-1 text-[10px] text-violet-600">
                  ✨ Instruct mode enabled — instructions are sent with each generation
                </p>
              )}
            </div>
          </div>

          {/* Quota — members see their plan cap, free users see free tier */}
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-medium text-violet-700">
                {isPro ? "Plan" : "Free Tier"}
              </p>
              <p className="mt-1 text-xs text-violet-600">
                {charsUsed}/{maxCharsPerTts} chars
                {isOverLimit && (
                  <span className="ml-1 font-medium text-red-600">
                    — Over limit!
                  </span>
                )}
              </p>
            </div>
            {!isPro && (
              <div>
                <p className="text-xs font-medium text-violet-700">Credits Today</p>
                <p className="mt-1 text-xs text-violet-600">
                  {getTodayUsed()} / {getTotalAvailable()} used
                  {getRemainingToday() <= 1 && (
                    <span className="ml-1 font-medium text-red-600">
                      — Low credits!
                    </span>
                  )}
                </p>
              </div>
            )}
            <ShareBonus />
          </div>
        </aside>
      </div>
    </div>
  );
}
