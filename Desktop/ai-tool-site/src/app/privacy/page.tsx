import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Voiceover AI Privacy Policy — how we collect, use, and protect your personal data when you use our services.",
  alternates: { canonical: "https://voiceover.getfitai.io/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Information We Collect</h2>
          <p className="mt-2">
            <strong>Account Information:</strong> When you create an account, we collect
            your email address and name from your chosen login provider (Google, GitHub,
            or email).
          </p>
          <p className="mt-2">
            <strong>Usage Data:</strong> We collect anonymous usage data including voiceover
            character counts and feature usage statistics to improve the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Voiceover Data</h2>
          <p className="mt-2">
            Text you submit for voiceover generation is sent to our AI provider for
            speech synthesis. Audio files are temporarily stored for download and
            playback. Pro users&apos; voiceover history is saved for convenience.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Cookies</h2>
          <p className="mt-2">
            We use essential cookies for authentication and session management. We do
            not use tracking cookies or third-party analytics that collect personal data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Your Rights (GDPR)</h2>
          <p className="mt-2">
            You have the right to access, correct, or delete your personal data. See our
            GDPR page for details, or contact us at{" "}
            <a href="mailto:zl18672545321@gmail.com" className="text-purple-600 hover:underline">
              zl18672545321@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Contact</h2>
          <p className="mt-2">
            For privacy-related inquiries:{" "}
            <a href="mailto:zl18672545321@gmail.com" className="text-purple-600 hover:underline">
              zl18672545321@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
