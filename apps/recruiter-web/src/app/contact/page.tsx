import ContactPage from "@/views/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Interview.AI",
  description:
    "Get in touch with the Interview.AI support and engineering team for assistance, feedback, or enterprise inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}
