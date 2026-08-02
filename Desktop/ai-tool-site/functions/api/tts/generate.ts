const TTS_URL = "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/synthesize-audio";

export async function onRequestPost(context: { request: Request; env: { FASTMODELS_API_KEY: string } }): Promise<Response> {
  const body = await context.request.json() as {
    text: string[];
    voice: string;
    speed?: number;
    volume?: number;
    format?: string;
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
      synthesis_param: {
        model: "cosyvoice-v2",
        voice: body.voice,
        format: body.format || "MP3_16000HZ_MONO_128KBPS",
        volume: body.volume ?? 80,
        speechRate: body.speed ?? 1.0,
        pitchRate: 1.0,
      },
    }),
  });

  if (!res.ok) {
    return Response.json({ error: `TTS failed: ${res.status}` }, { status: 500 });
  }

  const audioBuffer = await res.arrayBuffer();
  return new Response(audioBuffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
