import PrivacyPage from "@/views/Privacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Interview.AI",
  description:
    "Review our candidate privacy, audio transcript processing, resume encryption, and data governance practices.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function Page() {
  return <PrivacyPage />;
}
