"use client";

import type { SummaryResults } from "@/lib/types";

interface ResultsProps {
  results: SummaryResults;
  fileName: string | null;
}

export default function Results({ results, fileName }: ResultsProps) {
  return (
    <div className="mx-auto mt-10 max-w-3xl px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white">Summary Results</h2>
        {fileName && (
          <p className="mt-1 text-sm text-gray-500">{fileName}</p>
        )}
      </div>

      {/* Main Summary */}
      <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-violet-400">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Summary
        </h3>
        <p className="leading-relaxed text-gray-300">{results.mainSummary}</p>
      </section>

      {/* Key Points */}
      {results.keyPoints.length > 0 && (
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-violet-400">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Key Points
          </h3>
          <ul className="space-y-2">
            {results.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                {point}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Section Summaries */}
      {results.sectionSummaries.length > 0 && (
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-violet-400">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Section Analysis
          </h3>
          <div className="space-y-4">
            {results.sectionSummaries.map((s) => (
              <div
                key={s.section}
                className="rounded-lg border border-gray-800/50 bg-gray-950/50 p-4"
              >
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-violet-400">
                  Section {s.section}
                </h4>
                <p className="text-sm leading-relaxed text-gray-400">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
