import AboutPage from "@/pages/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Interview.AI",
  description:
    "Interview.AI is an intelligent assessment platform built to help software engineers, product managers, and technical candidates master technical & behavioral interviews.",
  alternates: {
    canonical: "/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
