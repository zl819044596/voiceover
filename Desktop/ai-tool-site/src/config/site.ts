export const siteConfig = {
  name: "Voiceover AI",
  tagline: "AI Voiceover for Short Videos",
  description:
    "Turn text into natural AI voiceovers for TikTok, Reels, and YouTube Shorts. No signup needed.",
  url: "https://voiceover-ai.pages.dev",
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
  tts: "cosyvoice-v2",          // Voice synthesis engine
  polish: "MiniMax-M2.7",       // Script brain — emotion tagging & copywriting
  emotionTag: "MiniMax-M2.7",   // Emotion analysis & annotation
  llmFast: "DeepSeek-V4-Flash", // General purpose (fallback)
  llmPro: "DeepSeek-V4-Pro",    // Long document analysis (PDF)
  translate: "qwen-mt-turbo",   // Translation specialist
};

export const voices = [
  // 🌟 Recommended for Chinese / SSML-enabled (best prosody)
  { id: "longyumi_v2", label: "Luna", gender: "female", style: "Sweet", ssml: true, chinese: "甜美" },
  { id: "longxiaochun_v2", label: "Chloe", gender: "female", style: "Lively", ssml: true, chinese: "活泼" },
  { id: "longxiaoxia_v2", label: "Zoe", gender: "female", style: "Upbeat", ssml: true, chinese: "明快" },
  // 🇨🇳 Chinese-optimized voices
  { id: "longanyue", label: "Emma", gender: "female", style: "Gentle", ssml: false, chinese: "温柔" },
  { id: "longshange", label: "Sophia", gender: "female", style: "Professional", ssml: false, chinese: "专业" },
  { id: "longdaiyu", label: "Lily", gender: "female", style: "Soft", ssml: false, chinese: "柔和" },
  { id: "longanli", label: "Grace", gender: "female", style: "Friendly", ssml: false, chinese: "友好" },
  { id: "longanlang", label: "Henry", gender: "male", style: "Sunny", ssml: false, chinese: "阳光" },
  { id: "longanwen", label: "Clara", gender: "female", style: "Literary", ssml: false, chinese: "文艺" },
  { id: "longanyun", label: "Iris", gender: "female", style: "Fresh", ssml: false, chinese: "清新" },
  { id: "longjiqi", label: "James", gender: "male", style: "General", ssml: false, chinese: "通用" },
  { id: "longyingxiao", label: "William", gender: "male", style: "Authoritative", ssml: false, chinese: "权威" },
  { id: "longhouge", label: "George", gender: "male", style: "Deep & Warm", ssml: false, chinese: "深沉" },
  { id: "longjixin", label: "Oliver", gender: "male", style: "Energetic", ssml: false, chinese: "活力" },
  { id: "longanmin", label: "Arthur", gender: "male", style: "News Anchor", ssml: false, chinese: "新闻" },
  { id: "longgaoseng", label: "Victor", gender: "male", style: "Narrator", ssml: false, chinese: "旁白" },
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
