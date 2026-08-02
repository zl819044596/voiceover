export default function GdprPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">GDPR Compliance</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Our Commitment</h2>
          <p className="mt-2">
            Voiceover AI is committed to protecting your personal data and respecting
            your privacy rights under the EU General Data Protection Regulation (GDPR).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Your GDPR Rights</h2>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li><strong>Right of Access</strong> — Request a copy of your personal data.</li>
            <li><strong>Right to Rectification</strong> — Correct inaccurate data.</li>
            <li><strong>Right to Erasure</strong> — Request deletion of your data.</li>
            <li><strong>Right to Restrict Processing</strong> — Limit how we use your data.</li>
            <li><strong>Right to Data Portability</strong> — Receive your data in a machine-readable format.</li>
            <li><strong>Right to Object</strong> — Object to processing of your personal data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Data Processing</h2>
          <p className="mt-2">
            We process minimal personal data: email address, name (from login provider),
            and usage statistics. Payment processing is handled by Stripe, a PCI-DSS
            compliant payment processor. AI processing is handled by our API provider.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Data Retention</h2>
          <p className="mt-2">
            Account data is retained while your account is active. Upon account deletion,
            all personal data is removed within 30 days. Voiceover audio files are
            deleted 7 days after generation for free users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Contact DPO</h2>
          <p className="mt-2">
            For GDPR-related requests, contact our Data Protection Officer at{" "}
            <a href="mailto:dpo@voiceoverai.com" className="text-purple-600 hover:underline">
              dpo@voiceoverai.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>
      </div>
    </div>
  );
}
