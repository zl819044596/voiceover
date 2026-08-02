export const siteConfig = {
  name: "Voiceover AI",
  tagline: "AI Voiceover for Short Videos",
  description:
    "Turn text into natural AI voiceovers for TikTok, Reels, and YouTube Shorts. No signup needed.",
  url: "https://voiceoverai.com",
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
  tts: "cosyvoice-v2",
  llmFast: "DeepSeek-V4-Flash",
  llmPro: "DeepSeek-V4-Pro",
  translate: "qwen-mt-turbo",
};

export const voices = [
  // Microsoft Edge TTS — natural neural voices (free)
  { id: "en-US-EmmaMultilingualNeural", label: "Emma (Edge)", gender: "female", style: "Natural & Multilingual", source: "edge" },
  { id: "en-US-AvaMultilingualNeural", label: "Ava (Edge)", gender: "female", style: "Warm & Clear", source: "edge" },
  { id: "en-US-AndrewMultilingualNeural", label: "Andrew (Edge)", gender: "male", style: "Deep & Trustworthy", source: "edge" },
  { id: "en-US-BrianMultilingualNeural", label: "Brian (Edge)", gender: "male", style: "Energetic & Young", source: "edge" },
  { id: "en-GB-RyanNeural", label: "Ryan (Edge)", gender: "male", style: "British Accent", source: "edge" },
  { id: "en-GB-SoniaNeural", label: "Sonia (Edge)", gender: "female", style: "British Warm", source: "edge" },
  { id: "zh-CN-XiaoxiaoNeural", label: "晓晓 (Edge)", gender: "female", style: "Chinese Natural", source: "edge" },
  { id: "zh-CN-YunxiNeural", label: "云希 (Edge)", gender: "male", style: "Chinese Warm", source: "edge" },
  // Fastmodels cosyvoice-v2 voices (backup)
  { id: "longjiqi", label: "James", gender: "male", style: "General", source: "fastmodels" },
  { id: "longyingxiao", label: "William", gender: "male", style: "Authoritative", source: "fastmodels" },
  { id: "longhouge", label: "George", gender: "male", style: "Deep & Warm", source: "fastmodels" },
  { id: "longjixin", label: "Oliver", gender: "male", style: "Energetic", source: "fastmodels" },
  { id: "longanyue", label: "Emma", gender: "female", style: "Gentle", source: "fastmodels" },
  { id: "longshange", label: "Sophia", gender: "female", style: "Professional", source: "fastmodels" },
  { id: "longanmin", label: "Arthur", gender: "male", style: "News Anchor", source: "fastmodels" },
  { id: "longgaoseng", label: "Victor", gender: "male", style: "Narrator", source: "fastmodels" },
] as const;

export const freeQuota = {
  dailyTtsCount: 3,
  maxCharsPerTts: 500,
  dailyPdfCount: 20,
  maxPdfSize: 10 * 1024 * 1024, // 10MB
} as const;

export const proQuota = {
  dailyTtsCount: Infinity,
  maxCharsPerTts: 10000,
  dailyPdfCount: Infinity,
  maxPdfSize: 50 * 1024 * 1024, // 50MB
} as const;

export const pricing = {
  monthly: { price: 14.99, stripePriceId: "price_monthly" },
  yearly: { price: 9.99, stripePriceId: "price_yearly" },
  lifetime: { price: 89, stripePriceId: "price_lifetime" },
} as const;
