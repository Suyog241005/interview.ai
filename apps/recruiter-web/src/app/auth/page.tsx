import AuthPage from "@/views/Auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Authentication | Interview.AI",
  description:
    "Sign in with Google to access the recruiter suite.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AuthPage />;
}
