import InterviewPage from "@/views/Interview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Interview Cockpit | Interview.AI",
  description:
    "Live speech recognition AI mock interview cockpit for technical and behavioral assessments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <InterviewPage />;
}
