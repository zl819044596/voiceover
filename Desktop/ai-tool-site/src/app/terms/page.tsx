import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Voiceover AI Terms of Service — your agreement for using our AI-powered voiceover service.",
  alternates: { canonical: "https://voiceover.getfitai.io/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing or using Voiceover AI (&ldquo;the Service&rdquo;), you agree to be
            bound by these Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Description of Service</h2>
          <p className="mt-2">
            Voiceover AI provides AI-powered text-to-speech voiceover generation with
            AI script polish, voice cloning, and multi-language support. The Service is
            provided on an &ldquo;as is&rdquo; basis.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. User Accounts</h2>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your account
            credentials. You agree to notify us immediately of any unauthorized use of
            your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Payment and Refunds</h2>
          <p className="mt-2">
            Paid subscriptions are billed in advance. Refund requests are handled on a
            case-by-case basis. Contact zl18672545321@gmail.com for refund inquiries.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Acceptable Use</h2>
          <p className="mt-2">
            You agree not to use the Service to generate harmful, illegal, or
            infringing content. We reserve the right to suspend accounts that violate
            these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Limitation of Liability</h2>
          <p className="mt-2">
            Voiceover AI shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Contact</h2>
          <p className="mt-2">
            Questions? Reach out at{" "}
            <a href="mailto:zl18672545321@gmail.com" className="text-purple-600 hover:underline">
              zl18672545321@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
