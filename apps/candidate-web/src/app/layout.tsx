import "@interview.ai/ui/global.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { JsonLd } from "@/components/seo/json-ld";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://interview.ai"),
  title: {
    default: "Online Interview AI | Free Online AI Interview Practice & Mock Tool",
    template: "%s | Online Interview AI",
  },
  description:
    "Master technical & behavioral loops with our free online interview AI tool. Experience speech-driven online AI interview practice, custom role prompts, and instant diagnostic feedback.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://interview.ai",
    siteName: "Interview.AI - Online Interview AI Tool",
    title: "Online Interview AI | Free Online AI Interview Practice Tool",
    description:
      "Practice software engineering, product, and HR mock interviews with our free online interview AI tool. Get instant speech analysis and score diagnostics.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Online Interview AI Platform Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Interview AI | Free Online AI Interview Practice Tool",
    description:
      "Engineered for candidates: Speech-driven online AI interview practice, custom resume parsing, and actionable evaluation metrics.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://interview.ai/#webapp",
      name: "Interview.AI - Online Interview AI Tool",
      url: "https://interview.ai",
      description:
        "Speech-driven online AI interview practice platform providing instant technical and behavioral feedback.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires Web Speech API & JavaScript support",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Real-Time Speech Recognition & Transcribing",
        "Custom Resume & Tech Stack Question Tailoring",
        "Instant Diagnostic Performance Scoring",
        "Free Online AI Interview Practice",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://interview.ai/#website",
      url: "https://interview.ai",
      name: "Online Interview AI",
      description: "Free online interview AI tool for technical candidates.",
    },
    {
      "@type": "Organization",
      "@id": "https://interview.ai/#organization",
      name: "Interview.AI",
      url: "https://interview.ai",
      logo: "https://interview.ai/icon.png",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-zinc-800 selection:text-white transition-colors">
        <JsonLd data={jsonLdData} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
