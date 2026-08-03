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

export const MODEL_ID = "onnx-community/SmolLM2-360M-Instruct";

/** Quantization dtype — "q4" for ~200MB, "q8" for ~400MB, "fp32" for full */
export const MODEL_DTYPE = "q4" as const;

/** Default generation parameters */
export const GENERATION_DEFAULTS = {
  max_new_tokens: 256,
  temperature: 0.7,
  do_sample: true,
  top_p: 0.9,
} as const;
