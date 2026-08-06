export const siteConfig = {
  name: "Voiceover AI",
  tagline: "AI Voiceover for Short Videos",
  description:
    "Turn text into natural AI voiceovers for TikTok, Reels, and YouTube Shorts. No signup needed.",
  url: "https://voiceover.getfitai.io",
  ogImage: "/og-image.svg",
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
  tts: "cosyvoice-v2",          // Voice synthesis engine (CosyVoice-V2)
  polish: "MiniMax-M2.7",       // Script brain — copywriting & polishing
  llmFast: "DeepSeek-V4-Flash", // General purpose (fallback)
  llmPro: "DeepSeek-V4-Pro",    // Long document analysis (PDF)
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
  locked: boolean; // true = 灰显 "Coming Soon"
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
  /** Chinese style hint (CosyVoice voices) */
  chinese?: string;
  /** Description / use-case hint */
  description?: string;
  /** Use-case tags (e.g. "advertising", "podcast", "documentary") */
  tags?: string[];
  /** True for user-created cloned voices */
  cloned?: boolean;
}

export const cosyvoiceVoices: Voice[] = [
  // 🌟 Standard Mandarin — 标准普通话 · 成年男声
  { id: "longanmin", label: "Arthur", gender: "male", age: "male", style: "News Anchor", language: "zh", engine: "cosyvoice-v2", chinese: "新闻·标准普通话", description: "沉稳新闻播音 · 适合知识/纪录片", tags: ["news", "documentary", "education"] },
  { id: "longgaoseng", label: "Victor", gender: "male", age: "male", style: "Narrator", language: "zh", engine: "cosyvoice-v2", chinese: "旁白·标准普通话", description: "温和旁白解说 · 适合故事/有声书", tags: ["narration", "audiobook", "storytelling"] },
  // 🌟 Standard Mandarin — 标准普通话 · 成年女声
  { id: "longyumi_v2", label: "Luna", gender: "female", age: "female", style: "Sweet", language: "zh", engine: "cosyvoice-v2", chinese: "甜美", description: "甜美活泼女声 · 适合营销/Vlog", tags: ["marketing", "vlog", "entertainment"] },
  { id: "longxiaochun_v2", label: "Chloe", gender: "female", age: "female", style: "Lively", language: "zh", engine: "cosyvoice-v2", chinese: "活泼", description: "活泼欢快女声 · 适合营销/娱乐", tags: ["marketing", "entertainment", "vlog"] },
  { id: "longxiaoxia_v2", label: "Zoe", gender: "female", age: "female", style: "Upbeat", language: "zh", engine: "cosyvoice-v2", chinese: "明快", description: "明快阳光女声 · 适合营销/短视频", tags: ["marketing", "tiktok", "vlog"] },
  // 🇨🇳 Chinese voices — 中文音色 · 成年女声
  { id: "longanyue", label: "Emma", gender: "female", age: "female", style: "Gentle", language: "zh", engine: "cosyvoice-v2", chinese: "温柔", description: "温柔知性女声 · 适合情感/生活", tags: ["emotional", "lifestyle", "meditation"] },
  { id: "longshange", label: "Sophia", gender: "female", age: "female", style: "Professional", language: "zh", engine: "cosyvoice-v2", chinese: "专业", description: "专业干练女声 · 适合商务/培训", tags: ["business", "training", "corporate"] },
  { id: "longdaiyu", label: "Lily", gender: "female", age: "female", style: "Soft", language: "zh", engine: "cosyvoice-v2", chinese: "柔和", description: "柔和细腻女声 · 适合睡前/冥想", tags: ["meditation", "sleep", "wellness"] },
  { id: "longanli", label: "Grace", gender: "female", age: "female", style: "Friendly", language: "zh", engine: "cosyvoice-v2", chinese: "友好", description: "亲切友好女声 · 适合客服/教学", tags: ["customer-service", "education", "tutorial"] },
  { id: "longanwen", label: "Clara", gender: "female", age: "female", style: "Literary", language: "zh", engine: "cosyvoice-v2", chinese: "文艺", description: "文艺清新女声 · 适合诗歌/散文", tags: ["poetry", "literature", "culture"] },
  { id: "longanyun", label: "Iris", gender: "female", age: "female", style: "Fresh", language: "zh", engine: "cosyvoice-v2", chinese: "清新", description: "清新自然女声 · 适合日常/美食", tags: ["daily", "food", "lifestyle"] },
  // 🇨🇳 Chinese voices — 中文音色 · 成年男声
  { id: "longanlang", label: "Henry", gender: "male", age: "male", style: "Sunny", language: "zh", engine: "cosyvoice-v2", chinese: "阳光", description: "阳光活力男声 · 适合运动/旅行", tags: ["sports", "travel", "vlog"] },
  { id: "longjiqi", label: "James", gender: "male", age: "male", style: "General", language: "zh", engine: "cosyvoice-v2", chinese: "通用", description: "通用自然男声 · 适合各类场景", tags: ["general", "all-purpose"] },
  { id: "longyingxiao", label: "William", gender: "male", age: "male", style: "Authoritative", language: "zh", engine: "cosyvoice-v2", chinese: "权威", description: "权威大气男声 · 适合广告/宣传", tags: ["advertising", "promo", "brand"] },
  { id: "longhouge", label: "George", gender: "male", age: "male", style: "Deep & Warm", language: "zh", engine: "cosyvoice-v2", chinese: "深沉", description: "深沉温暖男声 · 适合电影/纪录片", tags: ["documentary", "film", "cinematic"] },
  { id: "longjixin", label: "Oliver", gender: "male", age: "male", style: "Energetic", language: "zh", engine: "cosyvoice-v2", chinese: "活力", description: "活力四射男声 · 适合游戏/综艺", tags: ["gaming", "variety", "entertainment"] },
  // ✨ New CosyVoice voices — 追加音色 · 成年女声
  { id: "longfeiyu", label: "Fei Yu", gender: "female", age: "female", style: "Airy", language: "zh", engine: "cosyvoice-v2", chinese: "轻盈", description: "轻盈灵动女声 · 适合广告/氛围", tags: ["advertising", "vlog", "lifestyle"] },
  { id: "longxiaoqiu", label: "Xiao Qiu", gender: "female", age: "female", style: "Cheerful", language: "zh", engine: "cosyvoice-v2", chinese: "俏皮", description: "俏皮可爱女声 · 适合综艺/搞笑", tags: ["entertainment", "variety", "vlog"] },
  { id: "longyuning", label: "Yu Ning", gender: "female", age: "female", style: "Elegant", language: "zh", engine: "cosyvoice-v2", chinese: "温婉", description: "温婉优雅女声 · 适合情感/古风", tags: ["emotional", "culture", "literature"] },
  { id: "longyinpin", label: "Yin Pin", gender: "female", age: "female", style: "Crisp", language: "zh", engine: "cosyvoice-v2", chinese: "清亮", description: "清亮干净女声 · 适合口播/资讯", tags: ["news", "daily", "tutorial"] },
  { id: "longchun", label: "Chun", gender: "female", age: "female", style: "Springlike", language: "zh", engine: "cosyvoice-v2", chinese: "明媚", description: "明媚元气女声 · 适合美妆/生活", tags: ["lifestyle", "daily", "marketing"] },
  { id: "longxin", label: "Xin", gender: "female", age: "female", style: "Joyful", language: "zh", engine: "cosyvoice-v2", chinese: "欢欣", description: "欢欣明亮女声 · 适合节日/庆典", tags: ["marketing", "entertainment", "vlog"] },
  // ✨ New CosyVoice voices — 追加音色 · 成年男声
  { id: "longshuang", label: "Shuang", gender: "male", age: "male", style: "Cool", language: "zh", engine: "cosyvoice-v2", chinese: "冷冽", description: "冷冽磁性男声 · 适合影视/游戏", tags: ["cinematic", "film", "gaming"] },
  // ✨ New CosyVoice voices — 追加音色 · 童声
  { id: "longxiaoshu", label: "Xiao Shu", gender: "male", age: "child", style: "Innocent", language: "zh", engine: "cosyvoice-v2", chinese: "童真", description: "清澈童声 · 适合儿童内容/亲子", tags: ["kids", "family", "storytelling"] },
  { id: "longanran", label: "An Ran", gender: "female", age: "child", style: "Gentle", language: "zh", engine: "cosyvoice-v2", chinese: "乖巧", description: "乖巧软糯童声 · 适合儿童故事/早教", tags: ["kids", "storytelling", "education"] },
  // ✨ New CosyVoice voices — 追加音色 · 老年
  { id: "longzhen", label: "Zhen", gender: "female", age: "elderly", style: "Kindly", language: "zh", engine: "cosyvoice-v2", chinese: "慈祥", description: "慈祥温暖女声 · 适合长辈/公益", tags: ["family", "emotional", "wellness"] },
  { id: "longhua", label: "Hua", gender: "male", age: "elderly", style: "Wise", language: "zh", engine: "cosyvoice-v2", chinese: "睿智", description: "睿智沉稳男声 · 适合历史/讲坛", tags: ["documentary", "education", "culture"] },
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
  dailyTtsCount: 3,
  maxCharsPerTts: 10000,
} as const;

export const shareBonus = {
  bonusCreditsPerShare: 3,
  maxSharesPerDay: 5,
  totalBonusCap: 30,
} as const;

export const proQuota = {
  monthlyCount: 500,
  maxCharsPerTts: 10000,
} as const;

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
