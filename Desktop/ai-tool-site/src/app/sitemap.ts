import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://voiceover.getfitai.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/voiceover`, priority: 0.9 },
    { url: `${BASE_URL}/voiceover/dialogue`, priority: 0.8 },
    { url: `${BASE_URL}/pricing`, priority: 0.8 },
    { url: `${BASE_URL}/blog`, priority: 0.7 },
    { url: `${BASE_URL}/blog/short-video-script-tips`, priority: 0.6 },
    { url: `${BASE_URL}/blog/tts-vs-voice-cloning`, priority: 0.6 },
    { url: `${BASE_URL}/blog/viral-tiktok-voiceovers-ai`, priority: 0.6 },
    { url: `${BASE_URL}/blog/privacy-first-ai-tools`, priority: 0.6 },
    { url: `${BASE_URL}/login`, priority: 0.5 },
    { url: `${BASE_URL}/dashboard`, priority: 0.4 },
    { url: `${BASE_URL}/terms`, priority: 0.3 },
    { url: `${BASE_URL}/privacy`, priority: 0.3 },
    { url: `${BASE_URL}/gdpr`, priority: 0.3 },
  ];
}