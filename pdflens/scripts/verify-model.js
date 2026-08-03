// Verify the summarization pipeline end-to-end on this machine
// Uses the same code path as the browser (transformers.js + q4f16)
const { pipeline, env } = require("@huggingface/transformers");
// Use locally downloaded model files (cache_dir layout mirrors HF repo)
env.allowLocalModels = true;

async function main() {
  console.log("Loading local model from /tmp/qwen05/cache...");
  const gen = await pipeline("text-generation", "onnx-community/Qwen2.5-0.5B-Instruct", {
    dtype: "q4f16",
    device: "cpu", // Node has no webgpu/wasm backend; browser uses webgpu
    local_files_only: true,
    cache_dir: "/tmp/qwen05/cache",
  });
  console.log("Model loaded. Generating summary...");

  const prompt = `<|im_start|>system
You are a precise document summarizer. Always respond in clear English. Be concise and factual. Only output the requested summary, no extra commentary.<|im_end|>
<|im_start|>user
Write a comprehensive summary of the above document in 3-5 sentences. Cover the main topic, key arguments, and conclusion.

Text:
Artificial intelligence is transforming the world. Machine learning enables computers to learn from data. Deep learning uses neural networks with many layers. These technologies power voice assistants, recommendation systems, and self-driving cars. Companies invest billions in AI research. The future of AI depends on responsible development and regulation.<|im_end|>
<|im_start|>assistant
`;

  const result = await gen(prompt, {
    max_new_tokens: 200,
    temperature: 0.7,
    do_sample: true,
    top_p: 0.9,
  });
  const full = Array.isArray(result) ? result[0].generated_text : result.generated_text;
  const response = full.slice(prompt.length).trim();
  console.log("=== GENERATED SUMMARY ===");
  console.log(response);
  console.log("=== END ===");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
