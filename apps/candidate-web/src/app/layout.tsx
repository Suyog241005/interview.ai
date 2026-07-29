import "@interview.ai/ui/global.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";

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
    default: "Interview.AI | AI Mock Interview Platform",
    template: "%s | Interview.AI",
  },
  description:
    "Simulate high-stakes technical, behavioral, and HR interviews with speech-driven AI models, custom role prompts, and instant diagnostic feedback.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://interview.ai",
    siteName: "Interview.AI",
    title: "Interview.AI | AI Mock Interview Platform",
    description:
      "Engineer your interview performance with real-time speech evaluation & diagnostic feedback.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Interview.AI Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview.AI | AI Mock Interview Platform",
    description:
      "Engineer your interview performance with real-time speech evaluation & diagnostic feedback.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-zinc-800 selection:text-white transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
