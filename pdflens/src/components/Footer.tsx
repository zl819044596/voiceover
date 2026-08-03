import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-800/50 bg-gray-950/80">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-gray-500">
          PDFLens — Private PDF AI
        </p>
        <nav className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-gray-500 transition-colors hover:text-gray-300"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-500 transition-colors hover:text-gray-300"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-500 transition-colors hover:text-gray-300"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
