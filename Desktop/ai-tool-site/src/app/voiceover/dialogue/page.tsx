"use client";

import { useRef, useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { SpeakerPanel, MAX_SPEAKERS, SPEAKER_COLORS, type Speaker } from "@/components/voiceover/speaker-panel";
import { DialogueEditor } from "@/components/voiceover/dialogue-editor";
import { DialoguePreview } from "@/components/voiceover/dialogue-preview";
import { mergeAudioBlobs } from "@/lib/audio-merge";
import { safeParseJson, splitTextForTts } from "@/lib/utils";
import { cosyvoiceVoices, type Voice } from "@/config/site";
import { incrementUsage } from "@/lib/usage-tracker";

const CLONED_VOICES_KEY = "voiceover-cloned-voices";
const FAVORITES_KEY = "voiceover-favorites";

interface Progress {
  done: number;
  total: number;
}

interface AiDialogueLine {
  speaker: number;
  text: string;
}

const SAMPLE_PREVIEW_TEXT = "Hi! This is a quick preview of my voice. Nice to meet you!";

function nextSpeaker(list: Speaker[]): Speaker {
  const index = list.length;
  const voices = cosyvoiceVoices;
  return {
    id: `speaker_${index + 1}`,
    name: `Speaker ${index + 1}`,
    voice: voices[index % voices.length].id,
    text: "",
    color: SPEAKER_COLORS[index % SPEAKER_COLORS.length],
  };
}

/** Parse LLM output into dialogue lines, tolerating markdown fences & extra prose. */
function parseDialogueScript(content: string): AiDialogueLine[] {
  let cleaned = content.trim();
  cleaned = cleaned.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start !== -1 && end > start) {
    try {
      const parsed = JSON.parse(cleaned.slice(start, end + 1)) as unknown;
      if (Array.isArray(parsed)) {
        const lines = parsed
          .filter(
            (x): x is Record<string, unknown> =>
              !!x && typeof x === "object" && typeof (x as Record<string, unknown>).text === "string"
          )
          .map((x) => ({
            speaker: Math.max(1, Number((x as Record<string, unknown>).speaker) || 1),
            text: String((x as Record<string, unknown>).text).trim(),
          }))
          .filter((x) => x.text.length > 0);
        if (lines.length > 0) return lines;
      }
    } catch {
      // fall through to line-based fallback
    }
  }

  // Fallback: treat each non-empty line as a turn, alternating speakers
  return cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text, i) => ({ speaker: (i % 2) + 1, text }));
}

export default function DialoguePage() {
  // ── State ──
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: "speaker_1", name: "Speaker 1", voice: "longgaoseng", text: "", color: "purple" },
    { id: "speaker_2", name: "Speaker 2", voice: "longanyun", text: "", color: "blue" },
  ]);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const [speakerAudios, setSpeakerAudios] = useState<
    { id: string; name: string; url: string }[] | null
  >(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0); // semitones, -20 .. +20
  const [volume, setVolume] = useState(80);

  // ── Cloned voices & favorites (shared with /voiceover via localStorage) ──
  const [clonedVoices, setClonedVoices] = useState<Voice[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load cloned voices from localStorage
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

  // Load favorites from localStorage
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

  // ── Speaker list operations ──
  const addSpeaker = () => {
    setSpeakers((prev) => (prev.length >= MAX_SPEAKERS ? prev : [...prev, nextSpeaker(prev)]));
  };

  const removeSpeaker = (id: string) => {
    setSpeakers((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== id)));
  };

  const renameSpeaker = (id: string, name: string) => {
    setSpeakers((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const changeVoice = (id: string, voice: string) => {
    setSpeakers((prev) => prev.map((s) => (s.id === id ? { ...s, voice } : s)));
  };

  const changeText = (id: string, text: string) => {
    setSpeakers((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  };

  const changeInstruct = (id: string, instruct: string) => {
    setSpeakers((prev) => prev.map((s) => (s.id === id ? { ...s, instruct } : s)));
  };

  const toggleFavorite = (voiceId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(voiceId)
        ? prev.filter((x) => x !== voiceId)
        : [...prev, voiceId];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // storage may be full/unavailable
      }
      return next;
    });
  };

  // ── Per-speaker / per-voice preview ──
  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setPreviewingId(null);
  };

  const playPreview = async (voiceId: string, text: string, displayId?: string) => {
    stopPreview();
    setError("");
    setPreviewingId(displayId ?? voiceId);
    try {
      const res = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [text],
          voice: voiceId,
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
        const parsed = await safeParseJson<{ error?: string }>(res);
        throw new Error(
          parsed.ok ? parsed.data?.error || "Preview failed" : parsed.error
        );
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

  const previewSpeaker = (id: string) => {
    const speaker = speakers.find((s) => s.id === id);
    if (!speaker) return;
    const text = speaker.text.trim() || SAMPLE_PREVIEW_TEXT;
    playPreview(speaker.voice, text, id);
  };

  const previewVoice = (voiceId: string) => {
    if (previewingId === voiceId) {
      stopPreview();
      return;
    }
    playPreview(voiceId, SAMPLE_PREVIEW_TEXT);
  };

  // ── AI Auto-Generate Dialogue ──
  const autoGenerate = async () => {
    if (!topic.trim() || generating) return;
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "MiniMax-M2.7",
          systemPrompt: `You are a podcast/audio drama scriptwriter. Generate a natural multi-speaker dialogue based on the given topic.

Rules:
- Write 6–12 short spoken lines (1–2 sentences each), alternating between speakers.
- Keep the tone conversational, lively and natural for TTS synthesis.
- Each line must be pure spoken text — no stage directions, no labels, no markdown.

Output ONLY a JSON array in this exact format (no code fences, no extra text):
[{"speaker": 1, "text": "..."}, {"speaker": 2, "text": "..."}]`,
          userMessage: topic,
          temperature: 0.8,
          maxTokens: 2048,
        }),
      });
      if (!res.ok) {
        const parsed = await safeParseJson<{ error?: string }>(res);
        throw new Error(
          parsed.ok ? parsed.data?.error || "AI generation failed" : parsed.error
        );
      }
      const parsed = await safeParseJson<{ content?: string }>(res);
      if (!parsed.ok) throw new Error(parsed.error);
      const lines = parseDialogueScript(parsed.data?.content ?? "");
      if (lines.length === 0) throw new Error("AI returned no dialogue. Try a different topic.");

      setSpeakers((prev) => {
        const maxSpeakerIndex = Math.max(1, ...lines.map((l) => l.speaker));
        let list = prev.map((s) => ({ ...s, text: "" }));
        while (list.length < Math.min(maxSpeakerIndex, MAX_SPEAKERS)) {
          list = [...list, nextSpeaker(list)];
        }
        for (const line of lines) {
          const idx = Math.min(Math.max(line.speaker - 1, 0), list.length - 1);
          list[idx] = {
            ...list[idx],
            text: list[idx].text ? list[idx].text + "\n" + line.text : line.text,
          };
        }
        return list;
      });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setGenerating(false);
    }
  };

  // ── Generate All & Merge ──
  const generateAll = async () => {
    const active = speakers.filter((s) => s.text.trim());
    if (active.length === 0 || generating) {
      setError("Please enter some dialogue text first.");
      return;
    }
    setGenerating(true);
    setError("");
    setMergedAudioUrl(null);
    setSpeakerAudios(null);

    const blobs: Blob[] = [];
    const audios: { id: string; name: string; url: string }[] = [];
    try {
      for (let i = 0; i < active.length; i++) {
        const speaker = active[i];
        setProgress({ done: i, total: active.length });
        // A speaker's text can exceed the ~200-char single-request ceiling
        // (AI generates 6–12 lines merged into one speaker). Split per speaker,
        // synthesize each chunk, then merge them into that speaker's segment.
        const chunks = splitTextForTts(speaker.text);
        const speakerBlobs: Blob[] = [];
        for (const chunk of chunks) {
          const res = await fetch("/api/tts/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: [chunk],
              voice: speaker.voice,
              engine: "cosyvoice-v2",
              speed,
              volume,
              pitch: Math.pow(2, pitch / 12),
              enableSsml: false,
              ...(speaker.instruct?.trim() ? { instruct: speaker.instruct.trim() } : {}),
            }),
          });
          if (!res.ok) {
            const parsed = await safeParseJson<{ error?: string }>(res);
            throw new Error(
              parsed.ok
                ? parsed.data?.error || `TTS failed for ${speaker.name}`
                : parsed.error
            );
          }
          const blob = await res.blob();
          // Validate the segment actually contains decodable audio — wingray
          // occasionally returns 200 with a corrupt/empty body; catching it here
          // avoids a silent "missing speaker" merged result.
          try {
            const probeCtx = new OfflineAudioContext(1, 1, 24000);
            const probeBuf = await blob.arrayBuffer();
            const probe = await probeCtx.decodeAudioData(probeBuf);
            // wingray occasionally returns 200 with a decodable-but-silent body
            // (network degradation). Check both duration and actual energy so a
            // silent segment fails loudly instead of silently vanishing.
            const channel = probe.getChannelData(0);
            let peak = 0;
            for (let k = 0; k < channel.length; k += 4) {
              const v = Math.abs(channel[k]);
              if (v > peak) peak = v;
            }
            if (probe.duration < 0.05 || peak < 0.005) throw new Error("empty audio");
          } catch {
            throw new Error(`TTS returned empty audio for ${speaker.name}. Please try again.`);
          }
          speakerBlobs.push(blob);
        }
        const speakerBlob = speakerBlobs.length === 1 ? speakerBlobs[0] : await mergeAudioBlobs(speakerBlobs);
        blobs.push(speakerBlob);
        audios.push({
          id: speaker.id,
          name: speaker.name || `Speaker ${i + 1}`,
          url: URL.createObjectURL(speakerBlob),
        });
      }

      setProgress({ done: active.length, total: active.length });
      setSpeakerAudios(audios);
      const merged = await mergeAudioBlobs(blobs);
      setMergedAudioUrl(URL.createObjectURL(merged));
      incrementUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  };

  // ── Render: three-column layout ──
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
      {/* Page header banner */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 p-5 text-white shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold sm:text-xl">Multi-Speaker Dialogue Editor</h1>
            <p className="mt-0.5 text-xs text-purple-100 sm:text-sm">
              Multi-Speaker Dialogue — assign a voice to each speaker, then generate &amp; merge into one audio file.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            Multi-Speaker
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            AI Script Generation
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            One Merged MP3
          </span>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[16rem_minmax(0,1fr)_20rem]">
        {/* Left: speaker list + global controls */}
        <SpeakerPanel
          speakers={speakers}
          previewingId={previewingId}
          speed={speed}
          pitch={pitch}
          volume={volume}
          clonedVoices={clonedVoices}
          favorites={favorites}
          onAddSpeaker={addSpeaker}
          onRemoveSpeaker={removeSpeaker}
          onRenameSpeaker={renameSpeaker}
          onVoiceChange={changeVoice}
          onPreviewSpeaker={previewSpeaker}
          onPreviewVoice={previewVoice}
          onSpeedChange={setSpeed}
          onPitchChange={setPitch}
          onVolumeChange={setVolume}
          onToggleFavorite={toggleFavorite}
          onInstructChange={changeInstruct}
        />

        {/* Center: text editors + action bar */}
        <DialogueEditor
          speakers={speakers}
          clonedVoices={clonedVoices}
          topic={topic}
          generating={generating}
          progress={progress}
          error={error}
          mergedAudioUrl={mergedAudioUrl}
          speakerAudios={speakerAudios}
          onTextChange={changeText}
          onTopicChange={setTopic}
          onAutoGenerate={autoGenerate}
          onGenerateAll={generateAll}
        />

        {/* Right: chat-bubble preview */}
        <DialoguePreview speakers={speakers} />
      </div>
    </div>
  );
}