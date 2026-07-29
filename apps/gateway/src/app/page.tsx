import GatewayHomePage from "@/views/GatewayHome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview.AI | Dual-Interface AI Interview Platform",
  description:
    "The dual-interface platform for speech-driven mock interview practice for candidates and automated candidate screening & scheduling for recruiters.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Interview.AI | Candidate Cockpit & Recruiter Hiring Suite",
    description:
      "Speech-driven AI mock interviews for software engineering candidates & automated campaign scheduling for tech recruiters.",
    url: "https://interview.ai",
    siteName: "Interview.AI",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Interview.AI Platform Gateway",
      },
    ],
  },
};

export default function Page() {
  return <GatewayHomePage />;
}
