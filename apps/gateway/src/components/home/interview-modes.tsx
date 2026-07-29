"use client";

import confiImg from "@/assets/confi.png";
import creditImg from "@/assets/credit.png";
import hrImg from "@/assets/HR.png";
import techImg from "@/assets/tech.png";
import { motion } from "motion/react";

export const InterviewModes = () => {
  const interviewModes = [
    {
      image: techImg,
      badge: "mode // technical",
      title: "Technical interview mode",
      desc: "Simulates deep coding, system design, algorithm, and domain-specific engineering questions customized to your experience level.",
    },
    {
      image: hrImg,
      badge: "mode // behavioral",
      title: "HR & situational mode",
      desc: "Tests communication skills, leadership scenarios, STAR technique responses, and culture-fit situational questions.",
    },
    {
      image: confiImg,
      badge: "analytics // confidence",
      title: "Confidence & voice detection",
      desc: "Analyzes sentence pacing, clarity, hesitation markers, and vocal delivery confidence in real-time.",
    },
    {
      image: creditImg,
      badge: "system // access",
      title: "On-demand credit engine",
      desc: "Seamless credit management for initiating specialized mock practice rounds and generating PDF evaluations.",
    },
  ];

  return (
    <div className="my-28">
      <div className="text-center mb-14">
        <span className="text-xs font-mono text-[#007cf0] uppercase tracking-tight block font-semibold mb-1">
          modalities // evaluation-track
        </span>
        <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-[-1.28px] font-sans">
          Specialized assessment modalities.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {interviewModes.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 p-6 rounded-lg shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-250"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Thumbnail Container */}
              <div className="w-full sm:w-2/5 shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md h-40 relative">
                <img
                  src={typeof item.image === "string" ? item.image : (item.image as any)?.src || item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
              </div>

              {/* Information Stack */}
              <div className="w-full sm:w-3/5 flex flex-col justify-between h-full">
                <div>
                  <span className="text-[11px] font-mono text-[#007cf0] block mb-1.5 font-semibold">
                    {item.badge}
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight mb-1.5 font-sans">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
