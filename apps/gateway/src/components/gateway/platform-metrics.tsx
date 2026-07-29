"use client";

import { motion } from "motion/react";
import { ZapIcon, ShieldCheckIcon, CpuIcon, LayersIcon } from "lucide-react";

export const PlatformMetrics = () => {
  return (
    <section id="features" className="py-16 border-t border-slate-200/80 dark:border-zinc-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[11px] font-mono tracking-tight uppercase text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-3 py-1 rounded-full">
            SPECIFICATIONS // PLATFORM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Engineered for Low Latency & High Precision.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase">LATENCY</span>
              <ZapIcon className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono">&lt; 200ms</div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Low-latency Web Speech recognition & real-time audio transcribing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase">EVALUATION</span>
              <CpuIcon className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono">100% Spec</div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Automated scoring rubrics for technical correctness & speech pacing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase">MODALITIES</span>
              <LayersIcon className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono">Tech + HR</div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Covers System Design, Frontend, Backend, DevOps, and Leadership loops.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase">SECURITY</span>
              <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono">Encrypted</div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Bank-grade SSL data privacy for PDF resumes and audio transcripts.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
