const TTS_URL = "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/synthesize-audio";

export async function onRequestPost(context: { request: Request; env: { FASTMODELS_API_KEY: string } }): Promise<Response> {
  const body = await context.request.json() as {
    text: string[];
    voice: string;
    speed?: number;
    volume?: number;
    pitch?: number;
    format?: string;
    enableSsml?: boolean;
  };

  if (!body.text || !Array.isArray(body.text) || body.text.length === 0) {
    return Response.json({ error: "Text array is required" }, { status: 400 });
  }
  if (!body.voice) {
    return Response.json({ error: "Voice is required" }, { status: 400 });
  }

  const res = await fetch(TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.env.FASTMODELS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: body.text,
      enable_ssml: body.enableSsml ?? false,
      synthesis_param: {
        model: "cosyvoice-v2",
        voice: body.voice,
        format: body.format || "MP3_16000HZ_MONO_128KBPS",
        volume: body.volume ?? 80,
        speechRate: body.speed ?? 1.0,
        pitchRate: body.pitch ?? 1.0,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: `TTS failed: ${res.status} — ${errText}` }, { status: 500 });
  }

  const audioBuffer = await res.arrayBuffer();
  return new Response(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(audioBuffer.byteLength),
    },
  });
}
