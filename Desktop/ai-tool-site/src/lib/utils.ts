export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function estimateChars(text: string): number {
  // Chinese chars count as 2, others count as 1 (matching CosyVoice limit)
  let count = 0;
  for (const char of text) {
    count += /[一-鿿㐀-䶿]/.test(char) ? 2 : 1;
  }
  return count;
}

export function classNames(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// Build SSML text with emotion-specific prosody
// CosyVoice-V2 supports SSML on _v2 voices with enable_ssml flag
export function buildSsml(
  text: string,
  options: { rate?: number; pitch?: number }
): string {
  const rate = options.rate ?? 1.0;
  const pitch = options.pitch ?? 0;
  const pitchStr = `${pitch >= 0 ? "+" : ""}${Math.round(pitch)}%`;

  // Add natural pauses at punctuation
  const withBreaks = text
    .replace(/\.\s*/g, '. <break time="300ms"/>')
    .replace(/!\s*/g, '! <break time="400ms"/>')
    .replace(/\?\s*/g, '? <break time="350ms"/>')
    .replace(/,\s*/g, ', <break time="150ms"/>')
    .replace(/\n\n/g, '<break time="600ms"/>')
    .replace(/\n/g, '<break time="300ms"/>');

  return `<speak><prosody rate="${rate}" pitch="${pitchStr}">${withBreaks}</prosody></speak>`;
}

// Emotion tag → SSML prosody mapping
const emotionSsmilMap: Record<string, { rate: number; pitch: number }> = {
  happy: { rate: 1.1, pitch: 15 },
  excited: { rate: 1.25, pitch: 25 },
  serious: { rate: 0.9, pitch: -10 },
  warm: { rate: 1.0, pitch: 5 },
  dramatic: { rate: 0.85, pitch: -5 },
  urgent: { rate: 1.3, pitch: 20 },
  calm: { rate: 0.95, pitch: 0 },
  sad: { rate: 0.88, pitch: -8 },
};

// Parse MiniMax M2.7 emotion-tagged output into SSML
// Input: "[happy]Welcome to my channel![/happy] [serious]Today we discuss AI.[/serious]"
// Output: <speak><prosody rate="1.1" pitch="+15%">Welcome...</prosody>...</speak>
export function parseEmotionTags(taggedText: string): string {
  const parts: string[] = [];

  // Split by emotion tags like [happy]...[/happy] or [serious]...[/serious]
  const regex = /\[(\w+)\](.*?)\[\/\1\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(taggedText)) !== null) {
    // Add any text before this match
    if (match.index > lastIndex) {
      const plain = taggedText.slice(lastIndex, match.index).trim();
      if (plain) parts.push(plain);
    }

    const emotion = match[1].toLowerCase();
    const content = match[2].trim();
    const ssml = emotionSsmilMap[emotion];

    if (ssml && content) {
      const pitchStr = `${ssml.pitch >= 0 ? "+" : ""}${ssml.pitch}%`;
      parts.push(
        `<prosody rate="${ssml.rate}" pitch="${pitchStr}">${content}</prosody>`
      );
    } else if (content) {
      parts.push(content);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < taggedText.length) {
    const remaining = taggedText.slice(lastIndex).trim();
    if (remaining) parts.push(remaining);
  }

  // If no emotion tags found, return wrapped in neutral prosody
  if (parts.length === 0) {
    parts.push(taggedText);
  }

  return `<speak>${parts.join(" ")}</speak>`;
}
