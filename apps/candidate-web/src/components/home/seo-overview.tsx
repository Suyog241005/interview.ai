"use client";

import { motion } from "motion/react";
import {
  BrainCircuitIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ZapIcon,
  ShieldCheckIcon,
  TargetIcon,
} from "lucide-react";

export const SeoOverview = () => {
  return (
    <section
      id="online-interview-ai-overview"
      className="py-16 border-t border-slate-200/80 dark:border-zinc-800/80 font-sans"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Eyebrow & Main H2 Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center sm:text-left space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono tracking-tight uppercase text-[#007cf0] rounded-full">
            <SparklesIcon className="h-3.5 w-3.5 text-[#007cf0]" />
            <span>SEO OVERVIEW // ONLINE INTERVIEW AI</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Master Technical & Behavioral Loops with <span className="bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">Online Interview AI</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            Discover how our <strong>online interview ai tool</strong> transforms career preparation for software engineers, product managers, and technical candidates worldwide.
          </p>
        </motion.div>

        {/* Section 1: Comprehensive SEO Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-sans">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">
                <BrainCircuitIcon className="h-5 w-5 text-[#007cf0]" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                The Next Generation of Online AI Interview Simulation
              </h3>
            </div>
            <p>
              Navigating high-stakes technical interviews requires far more than passive memorization. Modern engineering candidates must clearly articulate complex architectural decisions, communicate trade-offs, and maintain voice confidence under pressure. That is why <strong>Online Interview AI</strong> was engineered from the ground up: to deliver a authentic, speech-driven mock environment that mirrors real-world hiring loops at top tech firms.
            </p>
            <p>
              By leveraging specialized AI language models and Web Speech recognition APIs, our <strong>online interview ai tool</strong> listens to your spoken answers in real time, evaluates technical correctness, and detects speech pacing. Whether you are preparing for system design, algorithms, or behavioral leadership questions, utilizing an <strong>online ai interview</strong> cockpit builds muscular memory and reduces anxiety before your actual interview day.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">
                <TargetIcon className="h-5 w-5 text-[#7928ca]" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                Why Free Online AI Interview Practice Matters
              </h3>
            </div>
            <p>
              Access to high-quality coaching should never be restricted by expensive private consulting fees. With our <strong>free online interview ai</strong> platform, candidates gain instant access to structured mock sessions without paywalls. Engaging in regular <strong>online ai interview practice free</strong> enables candidates from all backgrounds to hone their speaking abilities and technical clarity.
            </p>
            <p>
              Traditional preparation methods like self-recording or mock interviews with peers often suffer from scheduling conflicts and inconsistent feedback. By taking advantage of <strong>free online ai interview practice</strong>, you receive unbiased, instant scoring across every answer. The AI system identifies exact gaps in your answers, providing precise recommendations on how to structure responses using proven methodologies like the STAR method (Situation, Task, Action, Result).
            </p>
          </motion.div>
        </div>

        {/* Section 2: Detailed Workflow & Features */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-zinc-950 p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-6"
        >
          <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
            <span className="text-[10px] font-mono text-[#007cf0] uppercase tracking-tight block font-semibold mb-1">
              WORKFLOW // AI-ENGINE
            </span>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
              How Our Online AI Interview Practice Tool Works
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-sans">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>1. Role & Resume Customization</span>
              </div>
              <p>
                Configure your target position (e.g. Senior Frontend Engineer, DevOps Specialist, Product Manager) and experience level. Optionally upload your PDF resume so the <strong>online ai interview practice</strong> engine tailor-makes questions matching your real projects and tech stack.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                <ZapIcon className="h-4 w-4 text-[#007cf0] shrink-0" />
                <span>2. Speech Cockpit Simulation</span>
              </div>
              <p>
                Enter the interactive assessment cockpit. The AI interviewer presents scenario prompts dynamically. Speak naturally into your microphone while our <strong>online interview ai</strong> transcribes your answers in real time with low latency.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                <ShieldCheckIcon className="h-4 w-4 text-[#ff0080] shrink-0" />
                <span>3. Instant Diagnostic Scoring</span>
              </div>
              <p>
                Upon session completion, the <strong>online interview ai tool</strong> generates a detailed diagnostic report. Inspect technical correctness scores, confidence indexes, speech clarity, and actionable improvement recommendations for every question.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Summary SEO Highlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 bg-slate-100/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg font-sans space-y-4"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            Start Your Free Online AI Interview Practice Session Today
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Whether you are preparing for upcoming interviews at FAANG companies, fast-growing startups, or remote engineering teams, <strong>Online Interview AI</strong> gives you the competitive edge. Start using the premier <strong>free online ai interview practice</strong> platform today and transform your interview performance with speech-driven AI insights.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
            <span className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md">
              #online-interview-ai
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md">
              #free-online-interview-ai
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md">
              #online-ai-interview-practice
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md">
              #ai-mock-interview-tool
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
