"use client";

import { MessageSquare } from "lucide-react";
import { SPEAKER_STYLE, type Speaker } from "@/components/voiceover/speaker-panel";
import { cn } from "@/lib/utils";

interface DialoguePreviewProps {
  speakers: Speaker[];
}

export function DialoguePreview({ speakers }: DialoguePreviewProps) {
  // Flatten speakers + their lines into a chronological stream of bubbles
  const bubbles = speakers
    .flatMap((speaker, speakerIndex) =>
      speaker.text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({ speaker, speakerIndex, line }))
    )
    .filter((b) => b.line.length > 0);

  const hasContent = bubbles.length > 0;

  return (
    <aside className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 rounded-t-xl border-b border-gray-200 bg-gray-50 px-4 py-3">
        <MessageSquare className="h-4 w-4 text-violet-600" />
        <h2 className="text-sm font-semibold text-gray-900">Dialogue Preview</h2>
        {hasContent && (
          <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
            {bubbles.length} lines
          </span>
        )}
      </div>

      <div className="h-full max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto p-4">
        {!hasContent ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-2xl">
              💬
            </div>
            <p className="text-sm font-medium text-gray-500">No dialogue yet</p>
            <p className="max-w-[200px] text-xs text-gray-500">
              Type dialogue for each speaker on the left, or use AI Auto-Generate.
            </p>
          </div>
        ) : (
          bubbles.map((bubble, i) => {
            const style = SPEAKER_STYLE[bubble.speaker.color];
            const alignRight = bubble.speakerIndex % 2 === 1;
            return (
              <div
                key={`${bubble.speaker.id}-${i}`}
                className={cn(
                  "flex items-end gap-2",
                  alignRight ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-white shadow-sm",
                    style.avatarBg
                  )}
                >
                  👤
                </div>

                {/* Bubble */}
                <div className={cn("max-w-[75%]", alignRight ? "text-right" : "text-left")}>
                  <div
                    className={cn(
                      "mb-1 text-[11px] font-semibold",
                      alignRight ? "text-right" : "text-left",
                      style.text
                    )}
                  >
                    {bubble.speaker.name || `Speaker ${bubble.speakerIndex + 1}`}
                  </div>
                  <div
                    className={cn(
                      "inline-block rounded-2xl border px-3.5 py-2 text-sm leading-relaxed text-gray-900 shadow-sm",
                      style.bubble,
                      style.bubbleBorder,
                      alignRight ? "rounded-br-md" : "rounded-bl-md"
                    )}
                  >
                    {bubble.line}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
