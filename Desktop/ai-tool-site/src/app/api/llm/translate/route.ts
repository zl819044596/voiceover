import { NextRequest, NextResponse } from "next/server";
import { translateScript } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { script, targetLang } = body as { script: string; targetLang: string };

    if (!script || !targetLang) {
      return NextResponse.json(
        { error: "script and targetLang are required" },
        { status: 400 }
      );
    }

    const translated = await translateScript(script, targetLang);
    return NextResponse.json({ translated, lang: targetLang });
  } catch (err) {
    console.error("Translate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
