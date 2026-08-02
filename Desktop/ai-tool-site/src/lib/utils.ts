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
