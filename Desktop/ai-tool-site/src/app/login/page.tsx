import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Voiceover AI to access your Pro features, dashboard, and usage history.",
  alternates: { canonical: "https://voiceover.getfitai.io/login" },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
        <p className="mt-2 text-sm text-gray-500">
          Access your Pro features and dashboard.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-xs text-gray-400">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-gray-600">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-gray-600">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
