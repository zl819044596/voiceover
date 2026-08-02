import { NextRequest, NextResponse } from "next/server";
import { polishScript } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { script } = body as { script: string };

    if (!script) {
      return NextResponse.json({ error: "script is required" }, { status: 400 });
    }

    const polished = await polishScript(script);
    return NextResponse.json({ polished });
  } catch (err) {
    console.error("Polish error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
