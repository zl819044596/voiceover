import { NextRequest, NextResponse } from "next/server";
import { generateTts } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice, speed, volume, format } = body as {
      text: string[];
      voice: string;
      speed?: number;
      volume?: number;
      format?: string;
    };

    if (!text || !Array.isArray(text) || text.length === 0) {
      return NextResponse.json({ error: "Text array is required" }, { status: 400 });
    }
    if (!voice) {
      return NextResponse.json({ error: "Voice is required" }, { status: 400 });
    }

    const audioBuffer = await generateTts({
      text,
      voice,
      speechRate: speed ?? 1.0,
      volume: volume ?? 80,
      format: format || "MP3_16000HZ_MONO_128KBPS",
    });

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error("TTS generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
