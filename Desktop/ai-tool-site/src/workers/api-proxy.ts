// Cloudflare Worker: API proxy layer
// Routes all AI requests through this worker to hide the Fastmodels API key.
// Deploy with: npx wrangler deploy

interface Env {
  FASTMODELS_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Route: TTS generation
    if (url.pathname === "/api/tts/generate" && request.method === "POST") {
      const body = await request.json() as {
        text: string[];
        voice: string;
        speed?: number;
        volume?: number;
        format?: string;
      };

      const res = await fetch(
        "https://maas.wing-ray.cn/api/open-apis/projects/easyllms/voice/synthesize-audio",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.FASTMODELS_API_KEY}`,
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
        }
      );

      const audioBuffer = await res.arrayBuffer();
      return new Response(audioBuffer, {
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/mpeg",
        },
      });
    }

    // Route: LLM calls
    if (url.pathname === "/api/llm" && request.method === "POST") {
      const body = await request.json() as {
        model?: string;
        systemPrompt: string;
        userMessage: string;
        temperature?: number;
        maxTokens?: number;
      };

      const res = await fetch(
        "https://maas.wing-ray.cn/api/open-apis/v1/chat/completions",
        {
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
        }
      );

      const data = await res.json() as {
        choices: { message: { content: string } }[];
      };
      return Response.json(
        { content: data.choices?.[0]?.message?.content ?? "" },
        { headers: corsHeaders }
      );
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
