import express from "express";
import { EdgeTTS } from "edge-tts-universal";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "edge-tts-server" });
});

// TTS synthesis endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice, rate, volume } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Edge TTS uses format like "+10%" for rate, "+0%" for volume
    const rateStr = rate ? formatPercent(rate) : "+0%";
    const volStr = volume != null ? formatPercent(volume - 50) : "+0%";

    const tts = new EdgeTTS(
      String(text),
      voice || "en-US-EmmaMultilingualNeural",
      { rate: rateStr, volume: volStr }
    );

    const result = await tts.synthesize();
    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error("Edge TTS error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Edge TTS failed",
    });
  }
});

function formatPercent(num) {
  return `${num >= 0 ? "+" : ""}${Math.round(num)}%`;
}

app.listen(PORT, () => {
  console.log(`Edge TTS server running on port ${PORT}`);
});
