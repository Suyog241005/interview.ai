import PrivacyPage from "@/pages/Privacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Interview.AI",
  description:
    "Read the Interview.AI privacy policy covering candidate data protection, transcript handling, PDF resume security, and account governance.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function Page() {
  return <PrivacyPage />;
}
