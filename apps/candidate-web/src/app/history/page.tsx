import InterviewHistoryPage from "@/pages/InterviewHistory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment History | Interview.AI",
  description:
    "Review your historical practice mock evaluations, speech metrics, and question-by-question AI feedback.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <InterviewHistoryPage />;
}
