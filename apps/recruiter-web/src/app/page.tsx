import HomePage from "@/views/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Interview AI | Free Online AI Interview Practice Tool",
  description:
    "Accelerate your tech career with our online interview AI tool. Experience free online AI interview practice with speech-driven AI models, custom role prompts, and instant diagnostic feedback.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Online Interview AI | Free Online AI Interview Practice Tool",
    description:
      "Engineered for software engineers and candidates: Speech-driven online AI interview practice with real-time feedback and diagnostic scoring.",
    url: "https://interview.ai",
    siteName: "Interview.AI",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Online Interview AI Tool Preview",
      },
    ],
  },
};

export default function Page() {
  return <HomePage />;
}
