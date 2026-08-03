/**
 * Model configuration for PDFLens.
 *
 * MODEL_ID can be changed to any compatible text-generation model
 * on HuggingFace that has ONNX weights available.
 *
 * Size reference:
 * - SmolLM2-360M-Instruct q4: ~200MB
 * - SmolLM2-360M-Instruct fp32: ~1.4GB
 */

export const MODEL_ID = "onnx-community/Qwen2.5-0.5B-Instruct";

/**
 * Quantization dtype — "q4" (~750MB), "q4f16" (~460MB), "q8" (~700MB), "fp32" (full).
 * q4f16 is the best quality/size balance and is publicly downloadable (no gated access).
 */
export const MODEL_DTYPE = "q4f16" as const;

/** Default generation parameters */
export const GENERATION_DEFAULTS = {
  max_new_tokens: 256,
  temperature: 0.7,
  do_sample: true,
  top_p: 0.9,
} as const;
