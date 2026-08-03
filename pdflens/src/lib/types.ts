export type ProcessState =
  | "idle"
  | "extracting"
  | "downloading"
  | "ready"
  | "summarizing"
  | "done"
  | "error";

export type WebGPUSupport = "webgpu" | "wasm" | "unknown";

export interface DownloadProgress {
  loaded: number;
  total: number;
}

export interface SummaryResults {
  mainSummary: string;
  keyPoints: string[];
  sectionSummaries: SectionSummary[];
}

export interface SectionSummary {
  section: number;
  text: string;
}

export interface AppState {
  processState: ProcessState;
  webgpuSupport: WebGPUSupport;
  progress: DownloadProgress | null;
  results: SummaryResults | null;
  error: string | null;
  fileName: string | null;
}
