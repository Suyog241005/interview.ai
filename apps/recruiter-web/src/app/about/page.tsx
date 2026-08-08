import AboutPage from "@/views/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Interview.AI",
  description:
    "Learn about our mission to democratize technical and behavioral interview preparation through voice-driven AI feedback.",
  alternates: {
    canonical: "/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
