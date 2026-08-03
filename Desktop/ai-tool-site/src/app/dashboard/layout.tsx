import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Voiceover AI account, view usage statistics, and access Pro features.",
  alternates: { canonical: "https://voiceover-ai.pages.dev/dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
