import { motion } from "motion/react";
import {
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import evalImg from "@/assets/ai-ans.png";
import historyImg from "@/assets/history.png";
import pdfImg from "@/assets/pdf.png";
import resumeImg from "@/assets/resume.png";

export const CapabilitiesCards = () => {
  const capabilities = [
    {
      image: evalImg,
      icon: <BsBarChart size={16} className="text-slate-900 dark:text-white" />,
      title: "AI answer evaluation & metrics",
      desc: "Evaluates sentence delivery, technical depth, confidence index, and answer correctness with instant score breakdowns.",
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText size={16} className="text-slate-900 dark:text-white" />,
      title: "Resume context parsing",
      desc: "Upload your PDF resume to extract projects, tech stacks, and domain experience for personalized question generation.",
    },
    {
      image: pdfImg,
      icon: <BsFileEarmarkText size={16} className="text-slate-900 dark:text-white" />,
      title: "Exportable evaluation reports",
      desc: "Generate comprehensive diagnostic reports highlighting detailed question feedback, strengths, and targeted improvement tips.",
    },
    {
      image: historyImg,
      icon: <BsBarChart size={16} className="text-slate-900 dark:text-white" />,
      title: "Historical performance tracking",
      desc: "Track score trends, difficulty progression, and historical interview sessions over time inside your candidate dashboard.",
    },
  ];

  return (
    <div className="my-28">
      <div className="text-center mb-14">
        <span className="text-xs font-mono text-[#007cf0] uppercase tracking-tight block font-semibold mb-1">
          capabilities // core-platform
        </span>
        <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-[-1.28px] font-sans">
          Advanced AI-powered interview platform.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {capabilities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 p-6 rounded-lg shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-250"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Image Thumbnail Frame */}
              <div className="w-full sm:w-2/5 shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md h-40 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
              </div>

              {/* Text Description */}
              <div className="w-full sm:w-3/5 flex flex-col justify-between h-full">
                <div>
                  <div className="p-2 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md w-fit mb-3">
                    {item.icon}
                  </div>
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
