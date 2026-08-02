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
  { id: "longjiqi", label: "James", gender: "male", style: "General" },
  { id: "longyingxiao", label: "William", gender: "male", style: "Authoritative" },
  { id: "longhouge", label: "George", gender: "male", style: "Deep & Warm" },
  { id: "longjixin", label: "Oliver", gender: "male", style: "Energetic" },
  { id: "longanyue", label: "Emma", gender: "female", style: "Gentle" },
  { id: "longshange", label: "Sophia", gender: "female", style: "Professional" },
  { id: "longdaiyu", label: "Lily", gender: "female", style: "Soft" },
  { id: "longanli", label: "Grace", gender: "female", style: "Friendly" },
  { id: "longanlang", label: "Henry", gender: "male", style: "Sunny" },
  { id: "longanwen", label: "Clara", gender: "female", style: "Literary" },
  { id: "longanyun", label: "Iris", gender: "female", style: "Fresh" },
  { id: "longyumi_v2", label: "Luna", gender: "female", style: "Sweet" },
  { id: "longxiaochun_v2", label: "Chloe", gender: "female", style: "Lively" },
  { id: "longxiaoxia_v2", label: "Zoe", gender: "female", style: "Upbeat" },
  { id: "longanmin", label: "Arthur", gender: "male", style: "News Anchor" },
  { id: "longgaoseng", label: "Victor", gender: "male", style: "Narrator" },
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
