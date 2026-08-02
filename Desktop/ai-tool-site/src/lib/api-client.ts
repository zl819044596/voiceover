import { apiConfig, models } from "@/config/site";

// This runs in Cloudflare Worker or Next.js API routes (server-side only).
// Never expose the API key to the client.

const API_KEY = process.env.FASTMODELS_API_KEY!;

export async function generateTts(params: {
  text: string[];
  voice: string;
  format?: string;
  volume?: number;
  speechRate?: number;
  pitchRate?: number;
}): Promise<ArrayBuffer> {
  const body = {
    text: params.text,
    synthesis_param: {
      model: models.tts,
      voice: params.voice,
      format: params.format || "MP3_16000HZ_MONO_128KBPS",
      volume: params.volume ?? 80,
      speechRate: params.speechRate ?? 1.0,
      pitchRate: params.pitchRate ?? 1.0,
    },
  };

  const res = await fetch(apiConfig.ttsNonStream, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TTS failed: ${res.status} ${err}`);
  }

  return res.arrayBuffer();
}

export async function generateTtsStream(params: {
  text: string[];
  voice: string;
  format?: string;
  volume?: number;
  speechRate?: number;
  pitchRate?: number;
}): Promise<ReadableStream> {
  const body = {
    text: params.text,
    synthesis_param: {
      model: models.tts,
      voice: params.voice,
      format: params.format || "MP3_16000HZ_MONO_128KBPS",
      volume: params.volume ?? 80,
      speechRate: params.speechRate ?? 1.0,
      pitchRate: params.pitchRate ?? 1.0,
    },
  };

  const res = await fetch(apiConfig.ttsStream, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    throw new Error(`TTS stream failed: ${res.status}`);
  }

  return res.body;
}

export async function chatCompletion(params: {
  model?: string;
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const res = await fetch(`${apiConfig.llmBase}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: params.model || models.llmFast,
      messages: [
        { role: "system", content: params.systemPrompt },
        { role: "user", content: params.userMessage },
      ],
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 4096,
    }),
  });

  if (!res.ok) {
    throw new Error(`LLM call failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}

export async function polishScript(script: string): Promise<string> {
  return chatCompletion({
    systemPrompt:
      "You are a professional short-video script editor for TikTok/Reels/YouTube Shorts. Rewrite the script to be conversational, with short punchy sentences. Add an engaging hook and a clear call-to-action. Output the polished script only.",
    userMessage: script,
    temperature: 0.8,
  });
}

export async function translateScript(
  script: string,
  targetLang: string
): Promise<string> {
  return chatCompletion({
    model: models.translate,
    systemPrompt: `Translate the following script into ${targetLang}. Keep the same energy and emotional tone. Adapt idioms naturally. Keep sentences short and speakable. Output translation only.`,
    userMessage: script,
    temperature: 0.3,
  });
}

export async function analyzePdf(
  text: string,
  action: "summarize" | "keypoints" | "qa",
  question?: string
): Promise<string> {
  const prompts: Record<string, string> = {
    summarize:
      "Summarize the following document in 3-5 sentences. Output only the summary.",
    keypoints:
      "Extract 5-10 key points from the following document. Output a bullet list.",
    qa: `Answer the following question based on the document content: ${question}`,
  };

  return chatCompletion({
    model: models.llmPro,
    systemPrompt: prompts[action],
    userMessage: text,
    temperature: 0.3,
    maxTokens: 8192,
  });
}

export async function uploadVoiceClone(
  audioFile: File,
  promptText: string,
  voiceName: string
): Promise<{ voiceId: string }> {
  const formData = new FormData();
  formData.append("audio_file", audioFile);
  formData.append(
    "tts_speaker_voice_generate_req",
    JSON.stringify({
      model: models.tts,
      name: voiceName,
      prompt_text: promptText,
    })
  );

  const res = await fetch(apiConfig.voiceUpload, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Voice clone failed: ${res.status}`);
  }

  // Response from upload doesn't directly return voice_id.
  // After upload, the voice_name becomes the voice_id for synthesis.
  return { voiceId: voiceName };
}
