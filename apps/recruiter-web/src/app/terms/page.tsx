import TermsPage from "@/views/Terms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Interview.AI",
  description:
    "Review the terms of service, practice credit usage policies, and candidate agreement for Interview.AI.",
  alternates: {
    canonical: "/terms",
  },
};

export default function Page() {
  return <TermsPage />;
}
