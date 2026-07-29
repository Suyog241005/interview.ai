"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCheckIcon, MoonIcon, SunIcon, ArrowRightIcon, BriefcaseIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export const GatewayNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const candidateUrl =
    process.env.NEXT_PUBLIC_CANDIDATE_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5173"
      : "https://interview-ai-client-umber.vercel.app");

  const recruiterUrl =
    process.env.NEXT_PUBLIC_RECRUITER_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5174"
      : "https://interview-ai-recruiter.vercel.app");

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
          <div className="p-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 group-hover:border-slate-300 dark:group-hover:border-zinc-700 transition-colors">
            <img src="/icon.png" alt="Interview.AI Logo" className="w-5 h-5 object-contain" />
          </div>
          <h2 className="font-semibold text-base tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-1">
            Interview<span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">.ai</span>
          </h2>
        </Link>

        {/* Middle Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-zinc-900/60 p-1 rounded-full border border-slate-200/80 dark:border-zinc-800/80 text-xs font-medium">
          <a
            href="#portals"
            className="px-3.5 py-1.5 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Portals
          </a>
          <a
            href="#showcase"
            className="px-3.5 py-1.5 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Architecture
          </a>
          <a
            href="#faq"
            className="px-3.5 py-1.5 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right Section CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? <SunIcon size={14} className="text-amber-400" /> : <MoonIcon size={14} />}
            </button>
          )}

          {/* Candidate Portal Button */}
          <a
            href={candidateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-medium tracking-tight transition-all cursor-pointer shadow-xs"
          >
            <BriefcaseIcon size={13} />
            <span>Candidate Cockpit</span>
          </a>

          {/* Recruiter Portal Button */}
          <a
            href={recruiterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 text-xs font-semibold tracking-tight transition-all shadow-xs cursor-pointer"
          >
            <UserCheckIcon size={13} />
            <span>Recruiter Suite</span>
            <ArrowRightIcon size={12} />
          </a>
        </div>
      </div>
    </header>
  );
};
