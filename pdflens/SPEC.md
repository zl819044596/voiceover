# PDFLens 重建 Spec（voiceover 仓库）

## 目标
在 `/Volumes/Data/GitHub/voiceover/` 仓库下新建 `pdflens/` 目录，重建一个与 trycloudflare 隧道版功能一致的纯本地 PDF AI 摘要站，并修复原版的 3 个已知 bug。完成后 push 到 GitHub。

## 背景（逆向自原站）

原站（species-cut-keyboard-planet.trycloudflare.com）是一个 Next.js 16 静态站，纯前端、无任何后端 API。核心卖点：**100% Private / On-Device AI**——PDF 在浏览器用 pdfjs 解析，文本用 transformers.js + WebGPU 加载 ~200MB 量化 LLM 在本地生成摘要。原版有一个致命 bug：pdfjs worker 引用 `cdnjs.../pdf.js/6.2.108/pdf.worker.min.mjs`，而 cdnjs 上最新只有 6.1.200，导致 404、PDF 上传即失败。

## 技术栈（必须一致）
- Next.js 16（`output: "export"`，静态导出）+ TypeScript + Tailwind CSS v4
- `pdfjs-dist`（npm 装，但 worker 必须**本地托管**，见修复项 1）
- `@huggingface/transformers`（transformers.js v3）+ WebGPU 推理（`device: "webgpu"`，无 WebGPU 时降级 wasm）
- 模型：text-generation 量化模型，约 200MB 级别（如 `onnx-community/SmolLM2-360M-Instruct` q4 或等价模型；模型 ID 定义为常量 `MODEL_ID`，便于更换）。加载用 `progress_callback` 显示下载进度
- 禁止任何 API route / serverless function——纯静态

## 页面结构（单页应用，src/app/page.tsx 为主，另加 3 个静态页面）

### 首页（深色主题，violet 强调色）
- 顶部导航：品牌 "PDFLens" + 两个徽章：`WebGPU (Fast)`、`100% Private`
- Hero 区：小字 `No Signup • No Upload • 100% Private`，H1 `AI-Powered PDF Summaries Right In Your Browser`，副文案 "Your PDF never leaves your device. Get instant summaries, key points, and answers — all processed locally with on-device AI."
- 上传区（拖拽 + 点击）："Drop your PDF here, or click to browse"，限制 `Up to 25MB • PDF only`，accept=".pdf,application/pdf"
- 三张卖点卡：`100% Private`（Everything stays on your device. We never see your files.）/ `Instant Results`（No upload wait. Process and analyze right in your browser tab.）/ `On-Device AI`（Runs locally via WebGPU (Fast). No server, no API calls.）
- 页脚："PDFLens — Private PDF AI" + Privacy / Terms / Contact 链接

### 处理流程与状态机
上传 PDF 后依次显示状态：
1. `extracting` — 解析 PDF（pdfjs）
2. `downloading` — 首次加载下载模型，显示 "Downloading AI model... X MB / Y MB"（progress_callback 换算 MB），完成后 "Model ready!"
3. `summarizing` — "AI is summarizing"（加载动画）
4. 结果区 — 见下

首次加载提示："First load downloads ~200MB model. Subsequent uses are instant."

### 结果区
- 主摘要（整体）
- 关键点列表（Key Points，bullet）
- 分章节摘要：把全文按 ~2500 字符分块（按句子边界），前 5 块各出一段摘要，标注 "Section 1"…"Section 5"

### 摘要逻辑
- 分块：`chunkText(text, 2500)`——按 `[^.!?\n]+[.!?\n]?` 句子切分后合并成 ≤2500 字符的块
- 主块摘要 prompt：给 chunk 生成 3-5 句总结；关键点 prompt：提取 5-10 条 bullet
- 各块摘要 prompt：80-120 词内总结该块

## 修复项（P0 必须）
1. **P0 pdf worker 本地托管**：不要引用任何 CDN。把 pdfjs-dist 的 worker 文件（`pdf.worker.min.mjs`）复制到 `public/`（如 `public/pdf.worker.min.mjs`），代码里 `GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"`。npm 包 `node_modules/pdfjs-dist/build/pdf.worker.min.mjs` 直接拷贝。这同时规避 6.2.108 在 cdnjs 404 的问题
2. **P1 补全 3 个静态页**：`/privacy`、`/terms`、`/contact`（英文，深色主题一致，内容真实可用：contact 给 mailto 链接 mailto:support@pdflens.ai 之类的占位邮箱）
3. **P2 SEO 基础**：`public/robots.txt` + `public/sitemap.xml`（站点 URL 先用占位 `https://pdflens.pages.dev`，注释说明部署后替换）；layout 里完整 metadata（title/description/OG）

## 工程质量要求
- TypeScript 严格模式，无 any（合理处除外）
- 无 eslint 报错，`next build` 必须通过
- 移动端响应式
- 处理好异常：非 PDF 文件、超大文件（>25MB 提示）、扫描件/无文本 PDF（提示 "This PDF appears to be image-based. Text extraction failed."）、WebGPU 不可用降级 wasm 并提示 "Using WASM fallback (slower)"
- 模型加载失败给用户可理解的错误信息
- 拖拽区 hover 态、loading 态、结果区 UI 完整

## 交付
- 代码在 `/Volumes/Data/GitHub/voiceover/pdflens/`（独立子目录，不碰 `Desktop/ai-tool-site/`）
- `npm run build` 通过，`npx serve out` 或本地预览正常
- 完成后 git add/commit/push 到 origin/main（仓库已有远端，直接 push）
