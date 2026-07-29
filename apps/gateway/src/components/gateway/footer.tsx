"use client";

import { ArrowUpRightIcon } from "lucide-react";

export const GatewayFooter = () => {
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
    <footer className="border-t border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-black font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <img src="/icon.png" alt="Interview.AI Logo" className="w-5 h-5 object-contain" />
              <span className="font-semibold text-base text-slate-900 dark:text-white tracking-tight">
                Interview<span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">.ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-md leading-relaxed">
              The dual-interface AI interview platform. Powering speech-driven mock practice for candidates and automated candidate evaluation for recruiters & founders.
            </p>
          </div>

          {/* Col 2: Candidate Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-900 dark:text-white tracking-tight">
              Candidate Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
              <li>
                <a
                  href={candidateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Candidate Cockpit</span>
                  <ArrowUpRightIcon size={12} />
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Voice Mock Practice
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Resume PDF Parsing
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Recruiter Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-900 dark:text-white tracking-tight">
              Recruiter Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
              <li>
                <a
                  href={recruiterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Recruiter Suite</span>
                  <ArrowUpRightIcon size={12} />
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Job Campaign Setup
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  AI Candidate Rubrics
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Interview.AI. All rights reserved.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>ENGINE // v2.4</span>
            <span>STATUS // OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
