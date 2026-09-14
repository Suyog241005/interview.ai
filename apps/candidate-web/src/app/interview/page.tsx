import InterviewPage from "@/views/Interview";
import CompanyInterviewPage from "@/views/CompanyInterview";
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return token ? <CompanyInterviewPage token={token} /> : <InterviewPage />;
}
