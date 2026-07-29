"use client";

import { BsClock, BsMic, BsRobot } from "react-icons/bs";
import { motion } from "motion/react";

export const StepsCards = () => {
  const steps = [
    {
      icon: <BsRobot size={18} className="text-slate-900 dark:text-white" />,
      step: "01 // setup",
      title: "Role & experience configuration",
      description:
        "Select your targeted job role, seniority level, and upload your resume to calibrate customized question prompts.",
    },
    {
      icon: <BsMic size={18} className="text-slate-900 dark:text-white" />,
      step: "02 // assessment",
      title: "Real-time voice interview",
      description:
        "Engage with AI speech recognition to answer live technical, HR, and situational questions under realistic conditions.",
    },
    {
      icon: <BsClock size={18} className="text-slate-900 dark:text-white" />,
      step: "03 // simulation",
      title: "Timer-based score analysis",
      description:
        "Receive precise difficulty-based timer constraints and instant comprehensive scoring metrics across key competencies.",
    },
  ];

  return (
    <div className="my-24">
      <div className="text-center mb-12">
        <span className="text-xs font-mono text-[#007cf0] uppercase tracking-tight block font-semibold mb-1">
          workflow // engine
        </span>
        <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-[-1.28px] font-sans">
          How the assessment works.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {steps.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 p-7 rounded-lg shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-250 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md">
                  {item.icon}
                </div>
                <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
                  {item.step}
                </span>
              </div>

              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight mb-2 font-sans">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal leading-relaxed font-sans">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors">
              <span>step_0{index + 1}</span>
              <span>Ready →</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
