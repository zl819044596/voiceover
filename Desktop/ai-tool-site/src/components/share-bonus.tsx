"use client";

import { useState, useCallback } from "react";
import { addShareBonus, getBonusCredits } from "@/lib/usage-tracker";
import { Share2, Check, Gift } from "lucide-react";

export function ShareBonus() {
  const [toast, setToast] = useState<string | null>(null);
  const bonus = getBonusCredits();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleShare = useCallback(async () => {
    const text = "🎙️ Turn text into natural AI voiceovers for free! No signup needed. https://voiceover.getfitai.io";

    if (navigator.share) {
      try {
        await navigator.share({ title: "Voiceover AI", text });
        addShareBonus();
        showToast("+3 free credits!");
        return;
      } catch {
        // user cancelled share dialog
        return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      addShareBonus();
      showToast("Link copied! +3 free credits!");
    } catch {
      showToast("Could not share. Try again.");
    }
  }, [showToast]);

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Share & Get Free Credits
        <Gift className="h-4 w-4 text-purple-400" />
      </button>

      {bonus > 0 && (
        <p className="mt-1 text-xs text-purple-400">
          +{bonus} bonus credits from sharing
        </p>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-full left-0 right-0 mb-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-fade-in">
            <Check className="h-3.5 w-3.5" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}