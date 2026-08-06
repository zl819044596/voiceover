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
  Lock,
  ChevronDown,
  Volume2,
  Gauge,
  Activity,
} from "lucide-react";
import {
  cosyvoiceVoices,
  languageOptions,
  freeQuota,
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
  male: { label: "男声 Male", emoji: "👨" },
  female: { label: "女声 Female", emoji: "👩" },
  child: { label: "童声 Child", emoji: "🧒" },
  elderly: { label: "老年 Elderly", emoji: "🧓" },
};

const LANG_META = Object.fromEntries(
  languageOptions.map((o) => [o.code, o])
) as Record<LanguageCode, (typeof languageOptions)[number]>;

// Two-level language groups for display
interface LangGroup {
  code: string;          // parent key
  label: string;         // display label
  flag: string;
  locked?: boolean;
  children: { code: LanguageCode; label: string; flag: string }[];
}
const LANGUAGE_GROUPS: LangGroup[] = [
  {
    code: "zh", label: "中文", flag: "🇨🇳",
    children: [
      { code: "zh", label: "普通话", flag: "🇨🇳" },
      { code: "yue", label: "粤语", flag: "🇭🇰" },
      { code: "sichuan", label: "四川话", flag: "🌶️" },
    ],
  },
  {
    code: "en", label: "English", flag: "🇬🇧",
    children: [{ code: "en", label: "English", flag: "🇬🇧" }],
  },
  {
    code: "ja", label: "日本語", flag: "🇯🇵", locked: true,
    children: [{ code: "ja", label: "日本語", flag: "🇯🇵" }],
  },
  {
    code: "ko", label: "한국어", flag: "🇰🇷", locked: true,
    children: [{ code: "ko", label: "한국어", flag: "🇰🇷" }],
  },
  {
    code: "de", label: "Deutsch", flag: "🇩🇪", locked: true,
    children: [{ code: "de", label: "Deutsch", flag: "🇩🇪" }],
  },
  {
    code: "fr", label: "Français", flag: "🇫🇷", locked: true,
    children: [{ code: "fr", label: "Français", flag: "🇫🇷" }],
  },
  {
    code: "es", label: "Español", flag: "🇪🇸", locked: true,
    children: [{ code: "es", label: "Español", flag: "🇪🇸" }],
  },
  {
    code: "it", label: "Italiano", flag: "🇮🇹", locked: true,
    children: [{ code: "it", label: "Italiano", flag: "🇮🇹" }],
  },
  {
    code: "ru", label: "Русский", flag: "🇷🇺", locked: true,
    children: [{ code: "ru", label: "Русский", flag: "🇷🇺" }],
  },
];

const CATEGORY_META: { id: VoiceTab; label: string; short?: string }[] = [
  { id: "all", label: "全部音色" },
  { id: "favorites", label: "我的收藏", short: "收藏" },
  { id: "clones", label: "克隆声音", short: "克隆" },
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
  news: "新闻",
  documentary: "纪录片",
  education: "教育",
  narration: "旁白",
  audiobook: "有声书",
  storytelling: "故事",
  marketing: "营销",
  vlog: "Vlog",
  entertainment: "娱乐",
  tiktok: "短视频",
  emotional: "情感",
  lifestyle: "生活",
  meditation: "冥想",
  business: "商务",
  training: "培训",
  corporate: "企业",
  sleep: "助眠",
  wellness: "健康",
  "customer-service": "客服",
  tutorial: "教程",
  sports: "运动",
  travel: "旅行",
  poetry: "诗歌",
  literature: "文学",
  culture: "文化",
  daily: "日常",
  food: "美食",
  general: "通用",
  "all-purpose": "全能",
  advertising: "广告",
  promo: "宣传",
  brand: "品牌",
  film: "电影",
  cinematic: "电影感",
  gaming: "游戏",
  variety: "综艺",
  kids: "亲子",
  family: "家庭",
};

export default function VoiceoverPage() {
  const { isLoggedIn, login } = useAuth();

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
  const isOverLimit = charsUsed > freeQuota.maxCharsPerTts;

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
    // Filter by selected language
    list = list.filter((v) => v.language === selectedLang);
    // If no voices for this language, fall back to showing all (cross-language)
    if (list.length === 0 && tab === "all") list = availableVoices;
    return list;
  }, [tab, availableVoices, favorites, clonedVoices, selectedLang]);

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
      });
      if (!res.ok) throw new Error("Preview failed");
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
      await audio.play();
    } catch {
      setPreviewingId(null);
      setError("Could not load this voice preview.");
    }
  };

  // ── Generate ──
  const handleGenerate = async () => {
    if (!text.trim() || isOverLimit) return;
    if (!canGenerate()) {
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
      setCloneError("请上传音频文件（MP3/WAV）");
      return;
    }
    if (file.size > MAX_CLONE_SIZE) {
      setCloneFile(null);
      setCloneDuration(null);
      setCloneError("音频文件需小于 10MB");
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
      setCloneError("请先上传音频文件");
      return;
    }
    if (!cloneName.trim()) {
      setCloneError("请输入声音名称");
      return;
    }
    if (!clonePrompt.trim()) {
      setCloneError("请输入音频对应的文本（prompt_text）");
      return;
    }
    if (cloneDuration !== null && (cloneDuration < 10 || cloneDuration > 30)) {
      setCloneError(`音频时长需为 10–30 秒（当前 ${cloneDuration.toFixed(1)} 秒）`);
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
        throw new Error(err.error || "克隆失败，请重试");
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
        description: "我的克隆声音 · 使用上传音频训练",
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
      setCloneError(err instanceof Error ? err.message : "克隆失败，请重试");
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
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Voiceover Studio</h1>
          <p className="mt-1 text-sm text-gray-500">
            Turn text into natural voiceover audio. Free tier: 10,000 chars/month, 1,000 chars/request.
          </p>
        </div>
        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600 ring-1 ring-purple-200">
          CosyVoice-V2 · Instruct Mode
        </span>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-[16rem_minmax(0,1fr)_20rem]">
        {/* ══ Left column: language selector + voice library ══ */}
        <aside className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:col-span-2 lg:col-span-1">
          {/* Language selector */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400">语言 · Language</p>
              <span className="text-[10px] text-gray-400">
                {(() => { const child = LANGUAGE_GROUPS.flatMap(g => g.children).find(c => c.code === selectedLang); return child ? `${child.flag} ${child.label}` : "普通话"; })()}
              </span>
            </div>
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
                        if (group.locked) return;
                        if (hasChildren) {
                          setExpandedGroup(isExpanded ? null : group.code);
                        } else {
                          setSelectedLang(group.children[0].code);
                          setExpandedGroup(null);
                        }
                      }}
                      disabled={group.locked}
                      title={group.locked ? "母语音色即将上线" : group.label}
                      className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-medium transition-all ${
                        group.locked
                          ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                          : isGroupActive
                            ? "border-purple-600 bg-purple-50 text-purple-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">{group.flag}</span>
                        <span>{group.label}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        {group.locked && <Lock className="h-2.5 w-2.5" />}
                        {hasChildren && (
                          <ChevronDown
                            className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        )}
                      </span>
                    </button>
                    {/* Child options */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-purple-100 pl-3">
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
                                  ? "bg-purple-100 text-purple-700"
                                  : "text-gray-500 hover:bg-purple-50 hover:text-purple-600"
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
              placeholder="搜索声音（名称 / 风格 / 标签）..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-7 text-xs placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                title="清除搜索"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Currently selected voice */}
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-purple-100 bg-purple-50 p-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 text-lg shadow-sm">
              {avatarFor(selectedVoice)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-gray-900">
                {selectedVoice.label}
                {selectedVoice.cloned && (
                  <span className="ml-1 rounded bg-purple-600 px-1 py-0.5 text-[9px] font-bold text-white">
                    🤖
                  </span>
                )}
              </p>
              <p className="truncate text-[10px] text-purple-600">● 使用中</p>
            </div>
          </div>

          {/* Tabs: all / favorites / clones */}
          <div className="mt-3 flex gap-1 rounded-lg bg-gray-100 p-1">
            {CATEGORY_META.map((c) => (
              <button
                key={c.id}
                onClick={() => setTab(c.id)}
                className={`flex-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-all ${
                  tab === c.id
                    ? "bg-white text-purple-700 shadow-sm ring-1 ring-purple-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {c.short ?? c.label}
                <span className={tab === c.id ? "text-purple-400" : "text-gray-400"}>
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
                    className="flex w-full items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 text-left transition-colors hover:bg-gray-100"
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
                                ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                                : "border-transparent bg-gray-50 hover:border-purple-300 hover:bg-purple-50"
                            }`}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base ${
                                selected ? "bg-white/20" : "bg-white"
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
                                      selected ? "text-purple-200" : "text-purple-500"
                                    }`}
                                  >
                                    🤖
                                  </span>
                                )}
                              </p>
                              <p
                                className={`truncate text-[10px] ${
                                  selected ? "text-purple-200" : "text-gray-400"
                                }`}
                              >
                                {isClone ? "我的克隆声音" : v.chinese || v.style}
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
                                  ? "bg-white text-purple-600"
                                  : selected
                                    ? "text-purple-200 hover:text-white"
                                    : "text-gray-300 hover:bg-purple-100 hover:text-purple-600"
                              }`}
                              title={previewing ? "停止试听" : "试听"}
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
                                    ? "text-purple-200 hover:text-white"
                                    : "text-gray-300 hover:text-red-400"
                              }`}
                              title={fav ? "取消收藏" : "收藏"}
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
                                className="shrink-0 rounded-full p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                title="删除克隆声音"
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
                    ? "还没有克隆声音"
                    : tab === "favorites"
                      ? "还没有收藏声音"
                      : "没有匹配的声音"}
                </p>
                {(searchQuery || tab !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="mt-1 text-[11px] text-purple-500 underline hover:text-purple-700"
                  >
                    清除筛选条件
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Clone button */}
          <button
            onClick={openClonePanel}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50/50 py-2 text-xs font-semibold text-purple-600 transition-colors hover:border-purple-400 hover:bg-purple-100"
          >
            <Plus className="h-3.5 w-3.5" />
            克隆声音 🔬
          </button>
        </aside>

        {/* ══ Center column: text input + clone + generate ══ */}
        <main className="min-w-0 space-y-4">
          {/* Text input */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setPolishedText("");
              }}
              placeholder="输入文本..."
              rows={8}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`text-xs ${
                  isOverLimit ? "text-red-500 font-medium" : "text-gray-400"
                }`}
              >
                {charsUsed} / {freeQuota.maxCharsPerTts} chars
                {isOverLimit && " — 超出上限!"}
              </span>
              <button
                onClick={handlePolish}
                disabled={!text.trim() || loading}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 disabled:opacity-50 transition-colors"
                title="MiniMax M2.7 — Script polishing & optimization"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Polish
              </button>
            </div>
          </div>

          {/* Polished result */}
          {polishedText && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-medium text-purple-700">
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  MiniMax M2.7 — Polished Script
                </p>
                <span className="text-xs text-purple-400">Voiceover optimized</span>
              </div>
              <p className="text-sm text-purple-900">{polishedText}</p>
              <button
                onClick={() => setPolishedText("")}
                className="mt-2 text-xs text-purple-500 hover:text-purple-700"
              >
                Use original instead
              </button>
            </div>
          )}

          {/* Clone upload panel */}
          <div
            ref={clonePanelRef}
            className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                🔬 克隆声音 · Voice Cloning
              </h3>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    login();
                    return;
                  }
                  setCloneOpen(!cloneOpen);
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                {cloneOpen ? "收起 ▲" : "展开 ▼"}
              </button>
            </div>
            {cloneOpen ? (
              <div className="space-y-3">
                {/* Audio upload */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    音频文件（MP3/WAV，10–30 秒，清晰人声）
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
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
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
                                  ? " ⚠️ 建议 10–30 秒"
                                  : ""
                              }`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="block text-sm font-medium text-gray-700">
                            点击选择音频文件
                          </span>
                          <span className="block text-xs text-gray-400">
                            支持 MP3 / WAV，最大 10MB
                          </span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Voice name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    声音名称
                  </label>
                  <input
                    type="text"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    disabled={cloneLoading}
                    placeholder="例如：我的声音"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none disabled:opacity-50"
                  />
                </div>

                {/* Prompt text */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    音频对应的文本（prompt_text）
                  </label>
                  <textarea
                    value={clonePrompt}
                    onChange={(e) => setClonePrompt(e.target.value)}
                    disabled={cloneLoading}
                    rows={3}
                    placeholder="输入音频中朗读的原文，帮助 AI 对齐音色…"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none disabled:opacity-50"
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {cloneLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      克隆中…
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      开始克隆
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                上传 10–30 秒清晰人声，AI 将复制这个声音。
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
              disabled={!text.trim() || isOverLimit || loading || !canGenerate()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm shadow-purple-200"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
              {loading ? "Generating..." : "🎤 生成配音 Generate"}
            </button>
            <button
              onClick={() => handlePreview(selectedVoice)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 disabled:opacity-50 transition-colors"
              title="试听当前音色"
            >
              {previewingId === selectedVoice.id ? (
                <Square className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
              试听
            </button>
          </div>

          {/* Audio player */}
          {audioUrl && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <audio ref={audioRef} controls className="w-full" src={audioUrl}>
                Your browser does not support audio playback.
              </audio>
              <div className="mt-3 flex items-center gap-4">
                <a
                  href={audioUrl}
                  download="voiceover.mp3"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  <Download className="h-4 w-4" />
                  下载 MP3
                </a>
                <button
                  onClick={() => setAudioUrl(null)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  清除音频
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ══ Right column: voice detail + sliders + instruct ══ */}
        <aside className="min-w-0 space-y-4">
          {/* Current voice detail */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold text-gray-400">
              当前声音 · Voice
            </p>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-3xl shadow-sm">
                {avatarFor(selectedVoice)}
              </span>
              <h3 className="mt-2 flex items-center gap-1 text-base font-bold text-gray-900">
                {selectedVoice.label}
                {selectedVoice.cloned && (
                  <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    🤖 克隆
                  </span>
                )}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  {LANG_META[selectedVoice.language]?.flag}{" "}
                  {LANG_META[selectedVoice.language]?.label ?? "中文"}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  {AGE_META[selectedVoice.age]?.emoji}{" "}
                  {AGE_META[selectedVoice.age]?.label ?? "女声 Female"}
                </span>
              </div>
            </div>

            {selectedVoice.chinese && (
              <p className="mt-3 text-center text-xs font-medium text-gray-700">
                {selectedVoice.chinese}
              </p>
            )}
            {selectedVoice.description && (
              <p className="mt-2 text-center text-xs leading-relaxed text-gray-500">
                {selectedVoice.description}
              </p>
            )}
            {selectedVoice.tags && selectedVoice.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {selectedVoice.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600"
                  >
                    {TAG_LABELS[t] ?? t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Parameters: speed / pitch / volume / instruct */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-semibold text-gray-400">
              参数调节 · Voice Settings
            </p>

            {/* Speed */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Gauge className="h-3.5 w-3.5 text-purple-500" />
                  语速 Speed
                </label>
                <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700">
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
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[9px] text-gray-300">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>1.5x</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Activity className="h-3.5 w-3.5 text-purple-500" />
                  语调 Pitch
                </label>
                <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700">
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
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[9px] text-gray-300">
                <span>-20</span>
                <span>0</span>
                <span>+20</span>
              </div>
            </div>

            {/* Volume */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  <Volume2 className="h-3.5 w-3.5 text-purple-500" />
                  音量 Volume
                </label>
                <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700">
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
                className="w-full accent-purple-600"
              />
            </div>

            {/* Instruct */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">
                  Instruct 指令
                </label>
                <span className="text-[9px] text-gray-400">CosyVoice Instruct 模式</span>
              </div>
              <textarea
                value={instruct}
                onChange={(e) => setInstruct(e.target.value)}
                rows={3}
                placeholder="e.g. Speak in a cheerful and enthusiastic tone, like a game show host"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
              />
              {instruct.trim() && (
                <p className="mt-1 text-[10px] text-purple-500">
                  ✨ 已启用 Instruct 模式，指令将随生成请求发送
                </p>
              )}
            </div>
          </div>

          {/* Free Tier quota */}
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-medium text-purple-700">Free Tier</p>
              <p className="mt-1 text-xs text-purple-600">
                {charsUsed}/{freeQuota.maxCharsPerTts} chars
                {isOverLimit && (
                  <span className="ml-1 font-medium text-red-500">
                    — Over limit!
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-purple-700">Credits Today</p>
              <p className="mt-1 text-xs text-purple-600">
                {getTodayUsed()} / {getTotalAvailable()} used
                {getRemainingToday() <= 1 && (
                  <span className="ml-1 font-medium text-red-500">
                    — Low credits!
                  </span>
                )}
              </p>
            </div>
            <ShareBonus />
          </div>
        </aside>
      </div>
    </div>
  );
}
