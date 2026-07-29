import AuthPage from "@/pages/Auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Sign In | Interview.AI",
  description:
    "Sign in to your candidate account to access AI mock interviews, performance history, and diagnostic reports.",
  alternates: {
    canonical: "/auth",
  },
};

export default function Page() {
  return <AuthPage />;
}
