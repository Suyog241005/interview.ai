import TermsPage from "@/pages/Terms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Interview.AI",
  description:
    "Review the Terms & Conditions governing your usage of the Interview.AI candidate mock interview platform, practice credits, and AI evaluation engine.",
  alternates: {
    canonical: "/terms",
  },
};

export default function Page() {
  return <TermsPage />;
}
