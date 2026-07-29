"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuitIcon,
  Building2Icon,
  SparklesIcon,
  SlidersIcon,
  MicIcon,
  BarChart2Icon,
  FolderPlusIcon,
  SendIcon,
  TrophyIcon,
} from "lucide-react";

export const PortalShowcase = () => {
  const [activeTab, setActiveTab] = useState<"candidate" | "recruiter">("candidate");

  return (
    <section id="showcase" className="py-16 border-t border-slate-200/80 dark:border-zinc-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono tracking-tight uppercase text-slate-700 dark:text-zinc-300 rounded-full">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>PLATFORM CAPABILITIES // LIVE SHOWCASE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Designed for Candidates & Recruiters.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-sans">
            Select an interface tab below to explore how Interview.AI transforms mock practice for candidates and hiring workflows for recruiters.
          </p>
        </motion.div>

        {/* Tab Toggle Control */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("candidate")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all cursor-pointer ${
                activeTab === "candidate"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BrainCircuitIcon size={15} />
              <span>Candidate Experience</span>
            </button>

            <button
              onClick={() => setActiveTab("recruiter")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all cursor-pointer ${
                activeTab === "recruiter"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2Icon size={15} />
              <span>Recruiter Experience</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === "candidate" ? (
            <motion.div
              key="candidate"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans"
            >
              {/* Step 1 */}
              <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 w-fit">
                  <SlidersIcon size={18} />
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold block">STEP 01</span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Custom Role Setup</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Select your target job role (Frontend, Backend, System Design, Behavioral) and upload your PDF resume to extract personalized interview questions.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 w-fit">
                  <MicIcon size={18} />
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold block">STEP 02</span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Interactive Voice Cockpit</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Engage in a live voice conversation with our speech-driven AI interviewer. Real-time speech recognition captures your spoken answer instantly.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 w-fit">
                  <BarChart2Icon size={18} />
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold block">STEP 03</span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Diagnostic Scoring Report</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Inspect question-by-question technical evaluations, speech pace metrics, and actionable recommendations to refine your performance.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recruiter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans"
            >
              {/* Step 1 */}
              <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 w-fit">
                  <FolderPlusIcon size={18} />
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold block">
                  STEP 01
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Create Job Campaign</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Define job requisitions (Senior React Dev, DevOps Engineer), set required skill rubrics, and customize evaluation criteria.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 w-fit">
                  <SendIcon size={18} />
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold block">
                  STEP 02
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Dispatch Magic Invites</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Send automated email invitations or share custom magic links so candidates complete AI interviews at their convenience.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 w-fit">
                  <TrophyIcon size={18} />
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase font-semibold block">
                  STEP 03
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Evaluate Leaderboards</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Review AI-screened candidate rankings, inspect full video transcripts, and fast-track top engineering talent.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
