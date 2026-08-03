import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — PDFLens",
  description:
    "Get in touch with the PDFLens team. Questions, feedback, or support.",
};

export default function ContactPage() {
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
        <h1 className="mb-2 text-3xl font-bold text-white">Contact Us</h1>
        <p className="mb-8 text-gray-400">
          Questions, feedback, or need help? We&apos;d love to hear from you.
        </p>

        <div className="space-y-6 text-gray-300">
          <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Email</h2>
            <p className="mb-1">
              For general inquiries and support:
            </p>
            <a
              href="mailto:support@pdflens.ai"
              className="text-violet-400 hover:text-violet-300 text-lg font-medium"
            >
              support@pdflens.ai
            </a>
          </section>

          <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">
              Feature Requests &amp; Bug Reports
            </h2>
            <p>
              PDFLens is open source. Found a bug or have a feature idea? Open
              an issue on our GitHub repository:
            </p>
            <a
              href="https://github.com/pdflens/pdflens"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-violet-400 hover:text-violet-300"
            >
              github.com/pdflens/pdflens →
            </a>
          </section>

          <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">
              Response Time
            </h2>
            <p>
              We aim to respond to all inquiries within 2 business days. For
              urgent matters, please include &quot;URGENT&quot; in your email
              subject line.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
