import ContactPage from "@/pages/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Interview.AI",
  description:
    "Get in touch with the Interview.AI support team for candidate inquiries, practice credit assistance, or platform feedback.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}
