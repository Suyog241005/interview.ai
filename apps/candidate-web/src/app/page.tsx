import HomePage from "@/pages/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview.AI | Engineer Your Interview Performance",
  description:
    "Simulate high-stakes technical, behavioral, and HR interviews with speech-driven AI models, custom role prompts, and instant diagnostic feedback.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
