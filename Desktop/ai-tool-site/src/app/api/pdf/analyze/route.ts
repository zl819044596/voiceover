import { NextRequest, NextResponse } from "next/server";
import { analyzePdf } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, action, question } = body as {
      text: string;
      action: "summarize" | "keypoints" | "qa";
      question?: string;
    };

    if (!text || !action) {
      return NextResponse.json(
        { error: "text and action are required" },
        { status: 400 }
      );
    }

    if (!["summarize", "keypoints", "qa"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await analyzePdf(text, action, question);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("PDF analysis error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
