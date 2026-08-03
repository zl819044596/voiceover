/**
 * Split text into sentences using regex that matches sentence boundaries.
 * Matches: sequences ending with . ! ? followed by whitespace or newline.
 */
function splitSentences(text: string): string[] {
  const sentences: string[] = [];
  // Match sentences: content followed by sentence-ending punctuation
  const regex = /[^.!?\n]+[.!?\n]?/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const s = match[0].trim();
    if (s.length > 0) sentences.push(s);
  }
  return sentences;
}

/**
 * Chunk text into blocks of roughly maxChars characters,
 * trying to break on sentence boundaries.
 */
export function chunkText(text: string, maxChars: number = 2500): string[] {
  const sentences = splitSentences(text);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length + 1 <= maxChars) {
      current += (current ? " " : "") + sentence;
    } else {
      if (current) chunks.push(current.trim());
      // If a single sentence exceeds maxChars, break it further
      if (sentence.length > maxChars) {
        let remaining = sentence;
        while (remaining.length > maxChars) {
          chunks.push(remaining.slice(0, maxChars).trim());
          remaining = remaining.slice(maxChars);
        }
        current = remaining;
      } else {
        current = sentence;
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks;
}
