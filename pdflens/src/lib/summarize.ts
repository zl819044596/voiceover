import { pipeline, TextGenerationPipeline } from "@huggingface/transformers";
import { MODEL_ID, MODEL_DTYPE, GENERATION_DEFAULTS } from "./model";
import { chunkText } from "./chunk";
import type { SummaryResults, DownloadProgress } from "./types";

// ---- Prompt templates ----

function buildPrompt(instruction: string, context: string): string {
  return `<|im_start|>system
You are a precise document summarizer. Always respond in clear English. Be concise and factual. Only output the requested summary, no extra commentary.<|im_end|>
<|im_start|>user
${instruction}

Text:
${context}<|im_end|>
<|im_start|>assistant
`;
}

const MAIN_SUMMARY_INSTRUCTION =
  "Write a comprehensive summary of the above document in 3-5 sentences. Cover the main topic, key arguments, and conclusion.";

const KEY_POINTS_INSTRUCTION =
  "Extract 5-10 key bullet points from the above document. Format each as a single line starting with '- '.";

function sectionInstruction(sectionNum: number): string {
  return `Summarize section ${sectionNum} of the document in 80-120 words. Focus on the main ideas presented in this section.`;
}

// ---- Generator singleton ----

let generatorPromise: Promise<TextGenerationPipeline> | null = null;
let generatorInstance: TextGenerationPipeline | null = null;

/**
 * Load (or return cached) text-generation pipeline.
 * `onProgress` is called with download progress in bytes.
 */
export async function loadGenerator(
  device: "webgpu" | "wasm",
  onProgress?: (info: DownloadProgress) => void
): Promise<TextGenerationPipeline> {
  if (generatorInstance) return generatorInstance;
  if (generatorPromise) return generatorPromise;

  generatorPromise = (async () => {
    const gen = await pipeline("text-generation", MODEL_ID, {
      device,
      dtype: MODEL_DTYPE,
      progress_callback: (info) => {
        // Only forward download progress (loaded/total exist)
        if ("loaded" in info && "total" in info) {
          onProgress?.({
            loaded: info.loaded as number,
            total: info.total as number,
          });
        }
      },
    });
    generatorInstance = gen;
    return gen;
  })();

  return generatorPromise;
}

/**
 * Get already-loaded generator (throws if not loaded yet).
 */
export function getGenerator(): TextGenerationPipeline {
  if (!generatorInstance) {
    throw new Error("Model not loaded yet. Call loadGenerator() first.");
  }
  return generatorInstance;
}

/**
 * Generate text from a prompt.
 */
async function generate(prompt: string, maxTokens?: number): Promise<string> {
  const gen = getGenerator();
  const result = await gen(prompt, {
    ...GENERATION_DEFAULTS,
    max_new_tokens: maxTokens ?? GENERATION_DEFAULTS.max_new_tokens,
  });

  // result is an array of { generated_text: string }
  const output = Array.isArray(result) ? result[0] : result;
  const fullText: string = (output as { generated_text: string }).generated_text;

  // Strip the prompt from the output to get only the model's response
  const response = fullText.slice(prompt.length).trim();
  return response;
}

/**
 * Parse key points from model output. Expects lines starting with "- ".
 */
function parseKeyPoints(text: string): string[] {
  const lines = text.split("\n").filter((l) => l.trim().startsWith("-"));
  return lines.map((l) => l.replace(/^-\s*/, "").trim()).filter(Boolean);
}

// ---- Main summarization entry point ----

/**
 * Run the full summarization pipeline on extracted PDF text.
 * Returns main summary, key points, and per-section summaries.
 */
export async function summarizeText(
  fullText: string
): Promise<SummaryResults> {
  // 1. Main summary (use first chunk or full text if short)
  const mainChunk = fullText.slice(0, 3000);
  const mainPrompt = buildPrompt(MAIN_SUMMARY_INSTRUCTION, mainChunk);
  const mainSummaryRaw = await generate(mainPrompt, 300);
  const mainSummary = mainSummaryRaw || "Summary could not be generated.";

  // 2. Key points (use first ~3000 chars)
  const kpPrompt = buildPrompt(KEY_POINTS_INSTRUCTION, mainChunk);
  const kpRaw = await generate(kpPrompt, 300);
  const keyPoints = parseKeyPoints(kpRaw);

  // 3. Section summaries: chunk full text, summarize first 5 chunks
  const chunks = chunkText(fullText, 2500);
  const sectionChunks = chunks.slice(0, 5);
  const sectionSummaries = [];

  for (let i = 0; i < sectionChunks.length; i++) {
    const instruction = sectionInstruction(i + 1);
    const prompt = buildPrompt(instruction, sectionChunks[i]);
    const raw = await generate(prompt, 200);
    sectionSummaries.push({
      section: i + 1,
      text: raw || `Section ${i + 1} summary unavailable.`,
    });
  }

  return { mainSummary, keyPoints, sectionSummaries };
}
