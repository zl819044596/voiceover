export const siteConfig = {
  name: "Voiceover AI",
  tagline: "AI Voiceover for Short Videos",
  description:
    "Turn text into natural AI voiceovers for TikTok, Reels, and YouTube Shorts. No signup needed.",
  url: "https://voiceover.getfitai.io",
  ogImage: "/og-image.png",
};

export const apiConfig = {
  baseUrl: "https://maas.wing-ray.cn/api/open-apis",
  llmBase: "https://maas.wing-ray.cn/api/open-apis/v1",
  ttsNonStream:
    "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/synthesize-audio",
  ttsStream:
    "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/synthesize-audio-stream",
  voiceUpload:
    "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/upload",
};

export const models = {
  tts: "cosyvoice-v2",          // Voice synthesis engine
  polish: "MiniMax-M2.7",       // Script brain — copywriting & polishing
  llmFast: "DeepSeek-V4-Flash", // General purpose (fallback)
  llmPro: "DeepSeek-V4-Pro",    // Long-form content analysis
  translate: "qwen-mt-turbo",   // Translation specialist
};

export type EngineId = "cosyvoice-v2";

export type LanguageCode =
  | "zh"
  | "en"
  | "ja"
  | "ko"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "ru"
  | "yue"
  | "sichuan";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
  locked: boolean; // true = greyed out "Coming Soon"
}

export const languageOptions: LanguageOption[] = [
  { code: "zh", label: "Chinese", nativeName: "中文", flag: "🇨🇳", locked: false },
  { code: "en", label: "English", nativeName: "English", flag: "🇬🇧", locked: false },
  { code: "yue", label: "Cantonese", nativeName: "粵語", flag: "🇭🇰", locked: false },
  { code: "sichuan", label: "Sichuanese", nativeName: "四川话", flag: "🌶️", locked: false },
  { code: "ja", label: "Japanese", nativeName: "日本語", flag: "🇯🇵", locked: true },
  { code: "ko", label: "Korean", nativeName: "한국어", flag: "🇰🇷", locked: true },
  { code: "de", label: "German", nativeName: "Deutsch", flag: "🇩🇪", locked: true },
  { code: "fr", label: "French", nativeName: "Français", flag: "🇫🇷", locked: true },
  { code: "es", label: "Spanish", nativeName: "Español", flag: "🇪🇸", locked: true },
  { code: "it", label: "Italian", nativeName: "Italiano", flag: "🇮🇹", locked: true },
  { code: "ru", label: "Russian", nativeName: "Русский", flag: "🇷🇺", locked: true },
];

/** Voice group by age band — drives the left sidebar gallery sections */
export type AgeGroup = "male" | "female" | "child" | "elderly";

export interface Voice {
  id: string;
  label: string;
  gender: "male" | "female";
  age: AgeGroup;
  style: string;
  language: LanguageCode;
  engine: "cosyvoice-v2";
  /** Short style hint shown in the UI */
  chinese?: string;
  /** Description / use-case hint */
  description?: string;
  /** Use-case tags (e.g. "advertising", "podcast", "documentary") */
  tags?: string[];
  /** True for user-created cloned voices */
  cloned?: boolean;
}

export const cosyvoiceVoices: Voice[] = [
  // 🌟 Standard Mandarin · adult male
  { id: "longanmin", label: "Arthur", gender: "male", age: "male", style: "News Anchor", language: "zh", engine: "cosyvoice-v2", chinese: "News · Standard Mandarin", description: "Steady news anchor — great for documentaries and education", tags: ["news", "documentary", "education"] },
  { id: "longgaoseng", label: "Victor", gender: "male", age: "male", style: "Narrator", language: "zh", engine: "cosyvoice-v2", chinese: "Narration · Standard Mandarin", description: "Warm narrator — great for stories and audiobooks", tags: ["narration", "audiobook", "storytelling"] },
  // 🌟 Standard Mandarin · adult female
  { id: "longyumi_v2", label: "Luna", gender: "female", age: "female", style: "Sweet", language: "zh", engine: "cosyvoice-v2", chinese: "Sweet", description: "Sweet and lively — great for marketing and vlogs", tags: ["marketing", "vlog", "entertainment"] },
  { id: "longxiaochun_v2", label: "Chloe", gender: "female", age: "female", style: "Lively", language: "zh", engine: "cosyvoice-v2", chinese: "Lively", description: "Cheerful and upbeat — great for marketing and entertainment", tags: ["marketing", "entertainment", "vlog"] },
  { id: "longxiaoxia_v2", label: "Zoe", gender: "female", age: "female", style: "Upbeat", language: "zh", engine: "cosyvoice-v2", chinese: "Upbeat", description: "Bright and sunny — great for marketing and short videos", tags: ["marketing", "tiktok", "vlog"] },
  // 🇨🇳 Chinese voices · adult female
  { id: "longanyue", label: "Emma", gender: "female", age: "female", style: "Gentle", language: "zh", engine: "cosyvoice-v2", chinese: "Gentle", description: "Warm and elegant — great for emotional and lifestyle content", tags: ["emotional", "lifestyle", "meditation"] },
  { id: "longshange", label: "Sophia", gender: "female", age: "female", style: "Professional", language: "zh", engine: "cosyvoice-v2", chinese: "Professional", description: "Polished and capable — great for business and training", tags: ["business", "training", "corporate"] },
  { id: "longdaiyu", label: "Lily", gender: "female", age: "female", style: "Soft", language: "zh", engine: "cosyvoice-v2", chinese: "Soft", description: "Soft and delicate — great for bedtime and meditation", tags: ["meditation", "sleep", "wellness"] },
  { id: "longanli", label: "Grace", gender: "female", age: "female", style: "Friendly", language: "zh", engine: "cosyvoice-v2", chinese: "Friendly", description: "Warm and approachable — great for customer service and teaching", tags: ["customer-service", "education", "tutorial"] },
  { id: "longanwen", label: "Clara", gender: "female", age: "female", style: "Literary", language: "zh", engine: "cosyvoice-v2", chinese: "Literary", description: "Fresh and artistic — great for poetry and prose", tags: ["poetry", "literature", "culture"] },
  { id: "longanyun", label: "Iris", gender: "female", age: "female", style: "Fresh", language: "zh", engine: "cosyvoice-v2", chinese: "Fresh", description: "Natural and fresh — great for daily life and food", tags: ["daily", "food", "lifestyle"] },
  // 🇨🇳 Chinese voices · adult male
  { id: "longanlang", label: "Henry", gender: "male", age: "male", style: "Sunny", language: "zh", engine: "cosyvoice-v2", chinese: "Sunny", description: "Energetic and bright — great for sports and travel", tags: ["sports", "travel", "vlog"] },
  { id: "longjiqi", label: "James", gender: "male", age: "male", style: "General", language: "zh", engine: "cosyvoice-v2", chinese: "General", description: "Natural and versatile — works for almost any use case", tags: ["general", "all-purpose"] },
  { id: "longyingxiao", label: "William", gender: "male", age: "male", style: "Authoritative", language: "zh", engine: "cosyvoice-v2", chinese: "Authoritative", description: "Bold and commanding — great for ads and promos", tags: ["advertising", "promo", "brand"] },
  { id: "longhouge", label: "George", gender: "male", age: "male", style: "Deep & Warm", language: "zh", engine: "cosyvoice-v2", chinese: "Deep & Warm", description: "Deep and warm — great for film and documentaries", tags: ["documentary", "film", "cinematic"] },
  { id: "longjixin", label: "Oliver", gender: "male", age: "male", style: "Energetic", language: "zh", engine: "cosyvoice-v2", chinese: "Energetic", description: "Full of energy — great for gaming and variety shows", tags: ["gaming", "variety", "entertainment"] },
  // ✨ Chinese voices · child
  { id: "longanran", label: "An Ran", gender: "female", age: "child", style: "Gentle", language: "zh", engine: "cosyvoice-v2", chinese: "Cute", description: "Soft and cute child voice — great for kids stories and education", tags: ["kids", "storytelling", "education"] },
];

/** Voices grouped by age band for the left sidebar gallery */
export const voicesByAge: Record<AgeGroup, Voice[]> = {
  male: cosyvoiceVoices.filter((v) => v.age === "male"),
  female: cosyvoiceVoices.filter((v) => v.age === "female"),
  child: cosyvoiceVoices.filter((v) => v.age === "child"),
  elderly: cosyvoiceVoices.filter((v) => v.age === "elderly"),
};

/** All built-in voices (CosyVoice-V2 only) */
export const allVoices: Voice[] = [...cosyvoiceVoices];

export const freeQuota = {
  dailyTtsCount: 5,
  maxCharsPerTts: 1000,
} as const;

export const shareBonus = {
  bonusCreditsPerShare: 3,
  maxSharesPerDay: 5,
  totalBonusCap: 30,
} as const;

/** Per-plan quotas (chars per month + per-request cap) */
export const planQuotas: Record<
  string,
  { label: string; monthlyChars: number; maxCharsPerTts: number; limit?: number }
> = {
  free: { label: "Free", monthlyChars: 10000, maxCharsPerTts: 1000 },
  pro_monthly: { label: "Pro Monthly", monthlyChars: 100000, maxCharsPerTts: 10000 },
  pro_yearly: { label: "Pro Yearly", monthlyChars: 250000, maxCharsPerTts: 10000 },
  lifetime: { label: "Lifetime", monthlyChars: 100000, maxCharsPerTts: 10000, limit: 500 },
  business: { label: "Business", monthlyChars: 1000000, maxCharsPerTts: 10000 },
};

export const shareConfig = {
  bonusCreditsPerShare: 3,
  maxBonusCredits: 30,
  shareText:
    "🎙️ Turn text into natural AI voiceovers for free! No signup needed. https://voiceover.getfitai.io",
  shareTitle: "AI Voiceover — Free Text-to-Speech",
} as const;

export const pricing = {
  monthly: { price: 14.99, stripePriceId: "price_monthly" },
  yearly: { price: 9.99, stripePriceId: "price_yearly" },
  yearlyTotal: 119.88,
  lifetime: { price: 149, stripePriceId: "price_lifetime", limit: 500 },
  business: { price: 49, stripePriceId: "price_business" },
} as const;
