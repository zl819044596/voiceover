import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/voiceover" className="text-sm text-gray-500 hover:text-gray-800">
                  Voiceover
                </Link>
              </li>
              <li>
                <Link href="/voiceover/dialogue" className="text-sm text-gray-500 hover:text-gray-800">
                  Dialogue
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-800">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-800">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-800">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-800">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-sm text-gray-500 hover:text-gray-800">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="mailto:zl18672545321@gmail.com" className="text-sm text-gray-500 hover:text-gray-800">
                  zl18672545321@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Voiceover AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
