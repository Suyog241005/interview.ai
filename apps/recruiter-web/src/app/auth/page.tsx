import AuthPage from "@/views/Auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Authentication | Interview.AI",
  description:
    "Sign in to your candidate account with Google OAuth to access mock interviews and voice feedback.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AuthPage />;
}
