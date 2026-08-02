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
