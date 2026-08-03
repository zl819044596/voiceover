import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — PDFLens",
  description:
    "PDFLens privacy policy — your files never leave your device. No tracking, no data collection.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-4">
          <Link href="/" className="text-lg font-bold text-white">
            ← PDFLens
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mb-8 text-sm text-gray-500">
          Last updated: August 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white">Our Promise</h2>
            <p>
              PDFLens is designed from the ground up to be private. We believe
              your documents are yours alone, and you should never have to trust
              a third party with your sensitive information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              No Data Collection
            </h2>
            <p>
              PDFLens does not collect, store, or transmit any of your data.
              Everything happens inside your browser:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                PDF files are parsed entirely on your device using a local PDF
                engine.
              </li>
              <li>
                Text extraction and AI processing run locally via WebGPU or
                WASM — no text ever leaves your browser.
              </li>
              <li>
                We do not use cookies, analytics trackers, or any form of
                telemetry.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">AI Model</h2>
            <p>
              The AI model is downloaded once from HuggingFace CDN and cached in
              your browser. Subsequent uses load instantly from cache. No
              inference requests are ever sent to any server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Hosting</h2>
            <p>
              PDFLens is hosted as a static website. The hosting provider may
              collect standard server logs (IP address, user agent) as part of
              serving web traffic. These logs are not used by PDFLens for any
              purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p>
              If you have questions about this privacy policy, please reach out
              at{" "}
              <a
                href="mailto:support@pdflens.ai"
                className="text-violet-400 hover:text-violet-300"
              >
                support@pdflens.ai
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
