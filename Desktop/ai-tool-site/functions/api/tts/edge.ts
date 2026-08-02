// Edge TTS proxy → Railway Node.js server
// Cloudflare Workers don't support client WebSocket, so this proxies to a Node.js server

export async function onRequestPost(context: {
  request: Request;
  env: { EDGE_TTS_SERVER_URL?: string };
}): Promise<Response> {
  const serverUrl = context.env.EDGE_TTS_SERVER_URL;

  if (!serverUrl) {
    return Response.json(
      { error: "Edge TTS server not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await context.request.json() as {
      text: string;
      voice?: string;
      rate?: number;
      volume?: number;
    };

    const res = await fetch(`${serverUrl}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json(
        { error: `Edge TTS failed: ${err}` },
        { status: 502 }
      );
    }

    const audioBuffer = await res.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.byteLength),
      },
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Edge TTS failed" },
      { status: 500 }
    );
  }
}
