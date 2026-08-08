"use client";

import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { motion } from "motion/react";
import {
  BrainCircuitIcon,
  SparklesIcon,
  TargetIcon,
  ZapIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@interview.ai/ui/button";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-16">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-zinc-950 p-8 sm:p-12 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden text-center sm:text-left"
        >
          {/* Vercel Mesh Gradient Top Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 mb-4 text-[11px] font-mono tracking-tight uppercase text-[#007cf0] rounded-full">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>about // mission & platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Engineering candidate success with AI.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 font-normal mt-4 max-w-2xl leading-relaxed font-sans">
            Interview.AI is an intelligent assessment platform built to help software engineers, product managers, and technical candidates master high-stakes technical and behavioral interviews.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => router.push("/interview")}
              className="px-6 py-3 rounded-full bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 font-medium text-xs tracking-tight cursor-pointer shadow-md font-sans"
            >
              Start Practice Session →
            </Button>
          </div>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3"
          >
            <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md w-fit">
              <BrainCircuitIcon className="h-5 w-5 text-[#007cf0]" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Real-time speech evaluation
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Our low-latency speech recognition engine analyzes answer structure, confidence, delivery pace, and technical accuracy in under 200 milliseconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3"
          >
            <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md w-fit">
              <TargetIcon className="h-5 w-5 text-[#7928ca]" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Role & resume adaptation
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Upload your PDF resume to extract projects, tech stacks, and domain experience to receive tailored questions that mimic real tech company loops.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3"
          >
            <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md w-fit">
              <ZapIcon className="h-5 w-5 text-[#ff0080]" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Actionable diagnostic feedback
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Every completed interview produces a diagnostic report breaking down technical correctness, voice stability, and specific improvement recommendations.
            </p>
          </motion.div>
        </div>

        {/* Company Core Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-zinc-950 p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-6"
        >
          <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
            <span className="text-[10px] font-mono text-[#007cf0] uppercase tracking-tight block font-semibold mb-1">
              architecture // core-values
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
              Our commitment to candidates.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shrink-0">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Privacy First Data Security
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal leading-relaxed">
                  Your audio recordings, transcripts, and uploaded resumes are stored securely and never shared with third-party recruiters without your consent.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shrink-0">
                <UsersIcon className="h-5 w-5 text-[#007cf0]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Democratizing Interview Prep
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal leading-relaxed">
                  We believe elite interview coaching should be accessible to developers everywhere, eliminating expensive $200/hr private coaching fees.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
