// Cloudflare Worker: API proxy for ai-tool-site
// Handles all AI API routes (TTS, LLM polish/translate, PDF analysis)
// Deploy with: npx wrangler deploy

interface Env {
  FASTMODELS_API_KEY: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const LLM_BASE = "https://maas.wing-ray.cn/api/open-apis/v1/chat/completions";
const TTS_URL = "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/synthesize-audio";
const CLONE_URL = "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/upload";

async function ttsGenerate(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as {
    text: string[];
    voice: string;
    speed?: number;
    volume?: number;
    pitch?: number;
    format?: string;
    enableSsml?: boolean;
  };

  if (!body.text || !Array.isArray(body.text) || body.text.length === 0) {
    return Response.json({ error: "Text array is required" }, { status: 400, headers: corsHeaders });
  }
  if (!body.voice) {
    return Response.json({ error: "Voice is required" }, { status: 400, headers: corsHeaders });
  }

  // Process text: if SSML enabled, wrap in <speak> tags
  let processedText = body.text;
  if (body.enableSsml) {
    processedText = body.text.map((t) => `<speak>${t}</speak>`);
  }

  const res = await fetch(TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTMODELS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: processedText,
      synthesis_param: {
        model: "cosyvoice-v2",
        voice: body.voice,
        format: body.format || "MP3_24000HZ_MONO_128KBPS",
        volume: body.volume ?? 80,
        speechRate: body.speed ?? 1.0,
        pitchRate: body.pitch ?? 1.0,
      },
    }),
  });

  if (!res.ok) {
    return Response.json({ error: `TTS failed: ${res.status}` }, { status: 500, headers: corsHeaders });
  }

  const audioBuffer = await res.arrayBuffer();
  return new Response(audioBuffer, {
    headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
  });
}

async function ttsClone(request: Request, env: Env): Promise<Response> {
  const formData = await request.formData();
  const audioFile = formData.get("audio_file") as File | null;
  const promptText = formData.get("prompt_text") as string;
  const voiceName = formData.get("voice_name") as string;

  if (!audioFile || !promptText || !voiceName) {
    return Response.json(
      { error: "audio_file, prompt_text, and voice_name are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (audioFile.size > 10 * 1024 * 1024) {
    return Response.json(
      { error: "Audio file must be under 10MB" },
      { status: 400, headers: corsHeaders }
    );
  }

  const upstream = new FormData();
  upstream.append("audio_file", audioFile);
  upstream.append(
    "tts_speaker_voice_generate_req",
    JSON.stringify({
      model: "cosyvoice-v2",
      name: voiceName,
      prompt_text: promptText,
    })
  );

  const res = await fetch(CLONE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.FASTMODELS_API_KEY}` },
    body: upstream,
  });

  if (!res.ok) {
    return Response.json({ error: `Voice clone failed: ${res.status}` }, { status: 500, headers: corsHeaders });
  }

  return Response.json({ voiceId: voiceName }, { headers: corsHeaders });
}

async function llmCall(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as {
    model?: string;
    systemPrompt: string;
    userMessage: string;
    temperature?: number;
    maxTokens?: number;
  };

  const res = await fetch(LLM_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FASTMODELS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || "DeepSeek-V4-Flash",
      messages: [
        { role: "system", content: body.systemPrompt },
        { role: "user", content: body.userMessage },
      ],
      temperature: body.temperature ?? 0.7,
      max_tokens: body.maxTokens ?? 4096,
    }),
  });

  if (!res.ok) {
    return Response.json({ error: `LLM call failed: ${res.status}` }, { status: 500, headers: corsHeaders });
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  return Response.json(
    { content: data.choices?.[0]?.message?.content ?? "" },
    { headers: corsHeaders }
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    // TTS generate
    if (url.pathname === "/api/tts/generate" && request.method === "POST") {
      return ttsGenerate(request, env);
    }

    // Voice clone
    if (url.pathname === "/api/tts/clone" && request.method === "POST") {
      return ttsClone(request, env);
    }

    // LLM calls (polish, translate, pdf analyze)
    if (url.pathname === "/api/llm" && request.method === "POST") {
      return llmCall(request, env);
    }

    return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
  },
};
