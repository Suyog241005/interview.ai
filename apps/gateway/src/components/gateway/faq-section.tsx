"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircleIcon, ChevronDownIcon, SparklesIcon } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export const gatewayFaqItems = [
  {
    question: "What is the difference between the Candidate Cockpit and Recruiter Suite?",
    answer:
      "The Candidate Cockpit is designed for job seekers and software engineers to practice self-paced AI mock interviews with real-time speech evaluation. The Recruiter Suite allows company founders, tech leads, and hiring managers to post job openings, dispatch candidate interview invites, and evaluate automated AI scoring rubrics.",
  },
  {
    question: "How do candidates access mock interviews?",
    answer:
      "Candidates can click 'Candidate Cockpit' on this gateway to launch the self-assessment portal. They can select their target tech stack, upload a PDF resume, and complete voice mock interviews instantly with free starter credits.",
  },
  {
    question: "How do recruiters invite candidates for job interviews?",
    answer:
      "Recruiters can log into the Recruiter Suite, create a job requisition (e.g. Senior Frontend Engineer), define skill rubrics, and send magic link email invitations directly to candidates. Candidates complete the interview asynchronously, and the AI evaluates their answers.",
  },
  {
    question: "Is candidate data and resume information confidential?",
    answer:
      "Yes. All audio transcripts, PDF resumes, and evaluation scores are encrypted in transit and securely stored. Candidate practice data is strictly isolated and never shared unless explicitly submitted for a company hiring campaign.",
  },
  {
    question: "Can companies customize interview questions for specific engineering roles?",
    answer:
      "Absolutely. Recruiter accounts can configure custom interview templates, add specific coding or system design questions, and set rubric weightings tailored to their company's tech stack.",
  },
];

export const gatewayFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: gatewayFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: `<p>${item.answer}</p>`,
    },
  })),
};

export const GatewayFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 border-t border-slate-200/80 dark:border-zinc-800/80 font-sans">
      <JsonLd data={gatewayFaqSchema} />

      <div className="max-w-4xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono tracking-tight uppercase text-slate-700 dark:text-zinc-300 rounded-full">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>GATEWAY // FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Frequently Asked Questions.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-sans">
            Everything you need to know about navigating our candidate practice cockpit and recruiter hiring suite.
          </p>
        </motion.div>

        <div className="space-y-4">
          {gatewayFaqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100 dark:bg-zinc-800" />
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <HelpCircleIcon className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>{item.question}</span>
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-slate-400 dark:text-zinc-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-slate-900 dark:text-white" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/40 dark:bg-zinc-900/20"
                    >
                      <div className="p-5 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-sans">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
