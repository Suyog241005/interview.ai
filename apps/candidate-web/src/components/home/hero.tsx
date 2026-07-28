import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Dialog, DialogContent, DialogTrigger } from "@interview.ai/ui/dialog";
import { AuthDialog } from "../auth/auth-dialog";
import { useSession } from "@interview.ai/better-auth/client";

export const Hero = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const navigate = useNavigate();

  return (
    <div className="relative pt-16 pb-24 overflow-hidden">
      {/* Vercel Atmospheric Multi-Color Mesh Gradient Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-[#007cf0]/20 via-[#7928ca]/25 to-[#ff0080]/20 dark:from-[#007cf0]/15 dark:via-[#7928ca]/20 dark:to-[#ff0080]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-30 pointer-events-none -z-10" />

      {/* Top Technical Eyebrow Badge */}
      <div className="flex justify-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-300 px-4 py-1.5 rounded-full text-xs font-mono tracking-tight shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#007cf0] animate-pulse" />
          <span>ai-engine // mock-assessment-v2.0</span>
        </motion.div>
      </div>

      {/* Main Headline Block */}
      <div className="text-center max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-slate-900 dark:text-white tracking-[-2px] sm:tracking-[-2.4px] leading-[1.08] font-sans"
        >
          Engineer your interview performance with real-time AI.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 mt-6 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Simulate high-stakes technical, behavioral, and HR interviews with speech-driven AI models, custom role prompts, and instant diagnostic feedback.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          {user ? (
            <button
              onClick={() => navigate("/interview")}
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#171717] dark:bg-white text-white dark:text-black font-medium text-sm rounded-full hover:bg-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
            >
              <span>Start Interview Session</span>
              <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <button className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#171717] dark:bg-white text-white dark:text-black font-medium text-sm rounded-full hover:bg-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-lg">
                  <span>Start Interview Session</span>
                  <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl p-0">
                <AuthDialog />
              </DialogContent>
            </Dialog>
          )}

          {user && (
            <button
              onClick={() => navigate("/history")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 text-sm font-medium rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <span>View Past History</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Technical Metric Cards Band */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-20 px-4"
      >
        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-5 rounded-lg font-mono shadow-xs">
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 block uppercase font-mono">latency</span>
          <span className="text-xl font-semibold text-slate-900 dark:text-white mt-1 block tracking-tight font-sans">&lt; 200 ms</span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 block font-sans">Real-time Speech Recognition</span>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-5 rounded-lg font-mono shadow-xs">
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 block uppercase font-mono">evaluation</span>
          <span className="text-xl font-semibold text-slate-900 dark:text-white mt-1 block tracking-tight font-sans">100% Spec</span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 block font-sans">Automated Scoring Breakdown</span>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-5 rounded-lg font-mono shadow-xs">
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 block uppercase font-mono">modalities</span>
          <span className="text-xl font-semibold text-slate-900 dark:text-white mt-1 block tracking-tight font-sans">Tech + HR</span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 block font-sans">Custom Role Adaptation</span>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-5 rounded-lg font-mono shadow-xs">
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 block uppercase font-mono">resume-ai</span>
          <span className="text-xl font-semibold text-slate-900 dark:text-white mt-1 block tracking-tight font-sans">PDF Parse</span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 block font-sans">Contextual Prompt Extraction</span>
        </div>
      </motion.div>
    </div>
  );
};
