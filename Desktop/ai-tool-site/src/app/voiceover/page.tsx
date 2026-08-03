"use client";

import { useState, useRef } from "react";
import { Mic, Download, Loader2, Sparkles, Languages, Tags } from "lucide-react";
import { voices, emotions, models, freeQuota } from "@/config/site";
import { estimateChars, buildSsml, parseEmotionTags } from "@/lib/utils";
import type { Emotion } from "@/config/site";

export default function VoiceoverPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("longjiqi");
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(80);
  const [emotion, setEmotion] = useState<Emotion["id"]>("neutral");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [polishedText, setPolishedText] = useState("");
  const [emotionTaggedText, setEmotionTaggedText] = useState("");
  const [taggingMode, setTaggingMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const charsUsed = estimateChars(text);
  const isOverLimit = charsUsed > freeQuota.maxCharsPerTts;
  const selectedVoice = voices.find((v) => v.id === voice);
  const selectedEmotion = emotions.find((e) => e.id === emotion);
  const supportsSsml = selectedVoice?.ssml === true;

  const handleGenerate = async () => {
    if (!text.trim() || isOverLimit) return;
    setLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const sourceText = emotionTaggedText || polishedText || text;
      const emo = selectedEmotion || emotions[0];
      const hasEmotionTags = /\[(\w+)\].*?\[\/\1\]/.test(sourceText);

      // Build SSML: emotion-tagged text → parsed SSML, or simple SSML from emotion preset
      const useSsml = supportsSsml && (hasEmotionTags || emo.id !== "neutral");
      let finalText: string;

      if (hasEmotionTags && supportsSsml) {
        // MiniMax M2.7 tagged output → full SSML with per-sentence emotion
        finalText = parseEmotionTags(sourceText);
      } else if (useSsml) {
        // Simple SSML with single emotion prosody
        finalText = buildSsml(sourceText, { rate: emo.rate, pitch: emo.pitch });
      } else {
        finalText = sourceText;
      }

      const res = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [finalText],
          voice,
          speed: emo.rate * speed,
          volume,
          pitch: pitch * (1 + emo.pitch / 100),
          enableSsml: useSsml,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePolish = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const emo = selectedEmotion || emotions[0];
      const emotionHint =
        emo.id !== "neutral"
          ? ` Match a "${emo.label}" emotional tone throughout.`
          : "";

      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: models.polish,
          systemPrompt: `You are a professional short-video voiceover script editor. Your job is to preprocess raw text into a polished, speakable voiceover script optimized for TTS synthesis.

1. Rewrite for natural speech flow — short punchy sentences, conversational tone
2. Add an attention-grabbing hook at the start
3. Add a clear call-to-action at the end
4. Insert natural pauses with dashes and line breaks
5. Optimize pacing for short video (15–60 seconds)${emotionHint}

Output ONLY the polished script — no explanations, no markdown.`,
          userMessage: text,
          temperature: 0.8,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setPolishedText(data.content);
        setEmotionTaggedText("");
      }
    } catch {
      // Polish is non-critical
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionTag = async () => {
    const sourceText = polishedText || text;
    if (!sourceText.trim()) return;
    setLoading(true);
    setError("");
    setTaggingMode(true);

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: models.emotionTag,
          systemPrompt: `You are an emotion annotation engine. Analyze the text and wrap each sentence or phrase in emotion tags.

Available tags: [happy] [excited] [serious] [warm] [dramatic] [urgent] [calm] [sad]

Format: [emotion]sentence text here[/emotion]

Example input: "Welcome to my channel. Today I have amazing news. This will change everything."

Example output: "[warm]Welcome to my channel.[/warm] [excited]Today I have amazing news![/excited] [dramatic]This will change everything.[/dramatic]"

Rules:
- Use at most 3-4 different emotions per script
- Match emotion to the actual sentiment of each sentence
- Keep sentences intact — don't split mid-sentence
- Output ONLY the tagged text, no explanations`,
          userMessage: sourceText,
          temperature: 0.4,
          maxTokens: 2048,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setEmotionTaggedText(data.content);
        setPolishedText("");
      }
    } catch {
      // Non-critical
    } finally {
      setLoading(false);
      setTaggingMode(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Voiceover Studio</h1>
        <p className="mt-2 text-gray-500">
          Turn text into natural voiceover audio. Free tier: {freeQuota.maxCharsPerTts} chars, {freeQuota.dailyTtsCount}x/day.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Controls sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} — {v.style} ({v.gender}){v.ssml ? " 🎭" : ""}
                </option>
              ))}
            </select>
            {supportsSsml && (
              <p className="mt-1 text-xs text-purple-500">
                Supports emotion SSML — try different emotions!
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emotion
            </label>
            <div className="grid grid-cols-2 gap-1">
              {emotions.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEmotion(e.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    emotion === e.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{e.emoji}</span>
                  {e.label}
                </button>
              ))}
            </div>
            {!supportsSsml && emotion !== "neutral" && (
              <p className="mt-1 text-xs text-amber-500">
                SSML only supported on Luna/Chloe/Zoe voices
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speed: {speed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pitch: {pitch.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Deep</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume: {volume}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-xs font-medium text-purple-700">Free Tier</p>
            <p className="mt-1 text-xs text-purple-600">
              {charsUsed}/{freeQuota.maxCharsPerTts} chars
              {isOverLimit && (
                <span className="ml-1 text-red-500 font-medium">— Over limit!</span>
              )}
            </p>
          </div>
        </div>

        {/* Main area */}
        <div className="space-y-6 lg:col-span-2">
          {/* Text input */}
          <div>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setPolishedText("");
              }}
              placeholder="Enter your script here... e.g. 'Welcome to my channel! Today I'm going to show you...'"
              rows={6}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {charsUsed} / {freeQuota.maxCharsPerTts} chars
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
              <button
                onClick={handleEmotionTag}
                disabled={!text.trim() || loading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 disabled:opacity-50 transition-colors"
                title="MiniMax M2.7 — Per-sentence emotion tagging"
              >
                <Tags className="h-3.5 w-3.5" />
                Tag Emotions
              </button>
              <button
                disabled={!text.trim() || loading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <Languages className="h-3.5 w-3.5" />
                Translate
              </button>
            </div>
          </div>

          {/* Polished result */}
          {polishedText && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-purple-700">
                  <Sparkles className="inline h-3 w-3 mr-1" />
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

          {/* Emotion tagged result */}
          {emotionTaggedText && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-orange-700">
                  <Tags className="inline h-3 w-3 mr-1" />
                  MiniMax M2.7 — Emotion Tagged
                </p>
                <span className="text-xs text-orange-400">
                  {supportsSsml ? "SSML ready" : "Use with Luna/Chloe/Zoe voices for SSML"}
                </span>
              </div>
              <p className="text-sm text-orange-900 font-mono">{emotionTaggedText}</p>
              <button
                onClick={() => setEmotionTaggedText("")}
                className="mt-2 text-xs text-orange-500 hover:text-orange-700"
              >
                Use original instead
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isOverLimit || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            {loading ? "Generating..." : "Generate Voiceover"}
          </button>

          {/* Audio player */}
          {audioUrl && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <audio ref={audioRef} controls className="w-full" src={audioUrl}>
                Your browser does not support audio playback.
              </audio>
              <a
                href={audioUrl}
                download="voiceover.mp3"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                <Download className="h-4 w-4" />
                Download MP3
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
