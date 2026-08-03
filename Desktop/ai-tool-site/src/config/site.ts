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
  tts: "cosyvoice-v2",          // Voice synthesis engine
  polish: "MiniMax-M2.7",       // Script brain — emotion tagging & copywriting
  emotionTag: "MiniMax-M2.7",   // Emotion analysis & annotation
  llmFast: "DeepSeek-V4-Flash", // General purpose (fallback)
  llmPro: "DeepSeek-V4-Pro",    // Long document analysis (PDF)
  translate: "qwen-mt-turbo",   // Translation specialist
};

export const voices = [
  { id: "longjiqi", label: "James", gender: "male", style: "General", ssml: false },
  { id: "longyingxiao", label: "William", gender: "male", style: "Authoritative", ssml: false },
  { id: "longhouge", label: "George", gender: "male", style: "Deep & Warm", ssml: false },
  { id: "longjixin", label: "Oliver", gender: "male", style: "Energetic", ssml: false },
  { id: "longanyue", label: "Emma", gender: "female", style: "Gentle", ssml: false },
  { id: "longshange", label: "Sophia", gender: "female", style: "Professional", ssml: false },
  { id: "longdaiyu", label: "Lily", gender: "female", style: "Soft", ssml: false },
  { id: "longanli", label: "Grace", gender: "female", style: "Friendly", ssml: false },
  { id: "longanlang", label: "Henry", gender: "male", style: "Sunny", ssml: false },
  { id: "longanwen", label: "Clara", gender: "female", style: "Literary", ssml: false },
  { id: "longanyun", label: "Iris", gender: "female", style: "Fresh", ssml: false },
  { id: "longyumi_v2", label: "Luna", gender: "female", style: "Sweet", ssml: true },
  { id: "longxiaochun_v2", label: "Chloe", gender: "female", style: "Lively", ssml: true },
  { id: "longxiaoxia_v2", label: "Zoe", gender: "female", style: "Upbeat", ssml: true },
  { id: "longanmin", label: "Arthur", gender: "male", style: "News Anchor", ssml: false },
  { id: "longgaoseng", label: "Victor", gender: "male", style: "Narrator", ssml: false },
] as const;

export const emotions = [
  { id: "neutral", label: "Neutral", emoji: "😐", rate: 1.0, pitch: 0 },
  { id: "happy", label: "Happy", emoji: "😊", rate: 1.1, pitch: 15 },
  { id: "excited", label: "Excited", emoji: "🎉", rate: 1.25, pitch: 25 },
  { id: "serious", label: "Serious", emoji: "🎓", rate: 0.9, pitch: -10 },
  { id: "warm", label: "Warm", emoji: "🤗", rate: 1.0, pitch: 5 },
  { id: "dramatic", label: "Dramatic", emoji: "🎭", rate: 0.85, pitch: -5 },
  { id: "urgent", label: "Urgent", emoji: "⚡", rate: 1.3, pitch: 20 },
] as const;

export type Emotion = (typeof emotions)[number];

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
