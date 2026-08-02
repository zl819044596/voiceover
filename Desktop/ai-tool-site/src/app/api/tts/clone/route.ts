import { NextRequest, NextResponse } from "next/server";
import { uploadVoiceClone } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio_file") as File;
    const promptText = formData.get("prompt_text") as string;
    const voiceName = formData.get("voice_name") as string;

    if (!audioFile || !promptText) {
      return NextResponse.json(
        { error: "audio_file and prompt_text are required" },
        { status: 400 }
      );
    }

    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Audio file must be under 10MB" },
        { status: 400 }
      );
    }

    const result = await uploadVoiceClone(
      audioFile,
      promptText,
      voiceName || `clone_${Date.now()}`
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Voice clone error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
