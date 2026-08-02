import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/voiceover" className="text-sm text-gray-500 hover:text-gray-700">
                  Voiceover
                </Link>
              </li>
              <li>
                <Link href="/pdf" className="text-sm text-gray-500 hover:text-gray-700">
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-700">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/gdpr" className="text-sm text-gray-500 hover:text-gray-700">
                  GDPR
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="mailto:support@voiceoverai.com" className="text-sm text-gray-500 hover:text-gray-700">
                  support@voiceoverai.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Voiceover AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
