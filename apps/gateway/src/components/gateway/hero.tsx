"use client";

import { motion } from "motion/react";
import {
  BrainCircuitIcon,
  Building2Icon,
  MicIcon,
  FileTextIcon,
  BarChart3Icon,
  UsersIcon,
  MailCheckIcon,
  AwardIcon,
  ArrowUpRightIcon,
} from "lucide-react";

export const GatewayHero = () => {
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
    <section id="portals" className="pt-12 pb-20 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono tracking-tight text-slate-700 dark:text-zinc-300 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-wider">GATEWAY // DUAL-INTERFACE ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] font-sans">
            One AI Engine. <br className="hidden sm:inline" />
            Two Specialized Interfaces.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto font-sans">
            Simulate high-stakes technical mock interviews as a candidate or schedule automated interview loops as a recruiter. Interview.AI provides speech-driven intelligence for both sides.
          </p>
        </motion.div>

        {/* Dual Portal Cards - Clean Stark Cards matching candidate-web & DESIGN.md */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Candidate Cockpit */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white">
                  <BrainCircuitIcon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono tracking-tight text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2.5 py-1 rounded-md uppercase font-semibold">
                  for candidates & job seekers
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
                  Candidate Practice Cockpit
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed font-sans">
                  Simulate live technical, system design, and HR interviews with real-time speech recognition, PDF resume question tailoring, and diagnostic scoring metrics.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3 font-sans text-xs pt-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg text-slate-700 dark:text-zinc-300">
                  <MicIcon className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Real-Time Speech-to-Text Voice Transcribing</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg text-slate-700 dark:text-zinc-300">
                  <FileTextIcon className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>PDF Resume Parsing & Tech Stack Tailoring</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg text-slate-700 dark:text-zinc-300">
                  <BarChart3Icon className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>10-Point Diagnostic Performance Scoring</span>
                </div>
              </div>
            </div>

            {/* Launch Candidate Action */}
            <div className="pt-8 border-t border-slate-200 dark:border-zinc-800/80 mt-8">
              <a
                href={candidateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-semibold text-xs sm:text-sm tracking-tight transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 group/btn"
              >
                <span>Launch Candidate Cockpit</span>
                <ArrowUpRightIcon className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Recruiter Suite */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white">
                  <Building2Icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono tracking-tight text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2.5 py-1 rounded-md uppercase font-semibold">
                  for recruiters & founders
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
                  Recruiter & Founder Suite
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed font-sans">
                  Schedule customized AI interview loops for specific job openings, dispatch candidate invitations, and evaluate candidates with automated AI rubrics.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3 font-sans text-xs pt-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg text-slate-700 dark:text-zinc-300">
                  <UsersIcon className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Job Campaign Setup & Custom Evaluation Rubrics</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg text-slate-700 dark:text-zinc-300">
                  <MailCheckIcon className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Automated Candidate Email Invites & Magic Links</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg text-slate-700 dark:text-zinc-300">
                  <AwardIcon className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Automated Performance Leaderboards & Transcripts</span>
                </div>
              </div>
            </div>

            {/* Launch Recruiter Action */}
            <div className="pt-8 border-t border-slate-200 dark:border-zinc-800/80 mt-8">
              <a
                href={recruiterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-semibold text-xs sm:text-sm tracking-tight transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 group/btn"
              >
                <span>Enter Recruiter Hiring Portal</span>
                <ArrowUpRightIcon className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
