import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — PDFLens",
  description:
    "PDFLens terms of service — free to use, as-is, no warranties.",
};

export default function TermsPage() {
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
        <h1 className="mb-2 text-3xl font-bold text-white">
          Terms of Service
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          Last updated: August 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By using PDFLens (&quot;the Service&quot;), you agree to these
              Terms of Service. If you do not agree, please do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              2. Description of Service
            </h2>
            <p>
              PDFLens is a free, client-side web application that provides
              AI-powered PDF summarization directly in your browser. All
              processing happens locally on your device. No documents are
              uploaded to any server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                You are responsible for the documents you process through the
                Service.
              </li>
              <li>
                Do not use the Service for any unlawful purpose or in violation
                of any applicable laws.
              </li>
              <li>
                The Service is intended for personal and professional use. You
                may not resell or redistribute the Service itself.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              4. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as
              available,&quot; without warranty of any kind, express or implied.
              We do not guarantee the accuracy, completeness, or usefulness of
              any AI-generated summaries. AI outputs may contain errors or
              omissions — always verify important information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              5. Limitation of Liability
            </h2>
            <p>
              In no event shall PDFLens or its maintainers be liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising out of or relating to your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              6. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes
              will be effective immediately upon posting. Your continued use of
              the Service constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Contact</h2>
            <p>
              For questions about these Terms, contact{" "}
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
