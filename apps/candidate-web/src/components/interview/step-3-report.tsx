import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HomeIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  MessageSquareIcon,
} from "lucide-react";
import { Button } from "@interview.ai/ui/button";
import { useNavigate } from "react-router";
import type { PracticeInterviewWithQuestion } from "@interview.ai/api/client";
import type { PracticeQuestion } from "@interview.ai/types/db";

export const Step3Report = ({
  report,
  onRetake,
}: {
  report: PracticeInterviewWithQuestion;
  onRetake: () => void;
}) => {
  const navigate = useNavigate();
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    report.questions[0]?.id || null,
  );

  const toggleQuestion = (id: string) => {
    setActiveQuestionId(activeQuestionId === id ? null : id);
  };

  const calculateAverage = (key: keyof PracticeQuestion) => {
    if (!report.questions.length) return 0;
    const sum = report.questions.reduce((acc, q) => {
      const val = q[key];
      return acc + (typeof val === "number" ? val : 0);
    }, 0);
    return Math.round((sum / report.questions.length) * 10) / 10;
  };

  const avgScore = calculateAverage("questionScore");
  const avgConfidence = calculateAverage("confidenceScore");
  const avgCommunication = calculateAverage("communicationScore");
  const avgCorrectness = calculateAverage("correctnessScore");

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toUpperCase()) {
      case "EASY":
        return "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "MEDIUM":
        return "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "HARD":
        return "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800";
      default:
        return "bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl space-y-8"
      >
        {/* Header Block */}
        <div className="relative bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Vercel Mesh Gradient Top Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono tracking-tight text-[#007cf0] uppercase font-semibold block">
              evaluation // diagnostic report
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
              Assessment evaluation dashboard.
            </h1>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal">
              Detailed performance diagnostic, question-by-question breakdown, and AI feedback analysis.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={onRetake}
              className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-900 dark:text-white font-mono text-xs uppercase tracking-tight gap-2 cursor-pointer transition-all shadow-xs"
            >
              <RefreshCwIcon className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
              <span>New Interview</span>
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-full bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 font-medium text-xs tracking-tight gap-2 cursor-pointer transition-all shadow-md font-sans"
            >
              <HomeIcon className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Button>
          </div>
        </div>

        {/* Diagnostic Score Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overall Rating */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400">
                OVERALL RATING
              </span>
              <AwardIcon className="h-5 w-5 text-[#007cf0]" />
            </div>
            <div className="my-4 font-mono">
              <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white font-sans">
                {avgScore}
              </span>
              <span className="text-slate-400 dark:text-zinc-500 font-normal text-base">/10</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full w-fit">
              ASSESSMENT COMPLETE
            </div>
          </motion.div>

          {/* Technical Correctness */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400">
                CORRECTNESS
              </span>
              <CheckCircle2Icon className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="my-4 font-mono">
              <span className="text-4xl font-semibold text-slate-900 dark:text-white font-sans tracking-tight">
                {avgCorrectness * 10}%
              </span>
            </div>
            <div className="space-y-1.5 font-mono">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${avgCorrectness * 10}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 block">
                Technical Accuracy
              </span>
            </div>
          </motion.div>

          {/* Delivery Confidence */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400">
                CONFIDENCE
              </span>
              <TrendingUpIcon className="h-5 w-5 text-[#007cf0]" />
            </div>
            <div className="my-4 font-mono">
              <span className="text-4xl font-semibold text-slate-900 dark:text-white font-sans tracking-tight">
                {avgConfidence * 10}%
              </span>
            </div>
            <div className="space-y-1.5 font-mono">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#007cf0]"
                  style={{ width: `${avgConfidence * 10}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 block">
                Pacing & Voice Stability
              </span>
            </div>
          </motion.div>

          {/* Speech Communication */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-zinc-400">
                COMMUNICATION
              </span>
              <MessageSquareIcon className="h-5 w-5 text-purple-500" />
            </div>
            <div className="my-4 font-mono">
              <span className="text-4xl font-semibold text-slate-900 dark:text-white font-sans tracking-tight">
                {avgCommunication * 10}%
              </span>
            </div>
            <div className="space-y-1.5 font-mono">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${avgCommunication * 10}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 block">
                Clarity & Structure
              </span>
            </div>
          </motion.div>
        </div>

        {/* Detailed Question Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-tight text-slate-700 dark:text-zinc-300">
              question-by-question // diagnostic-breakdown
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
              {report.questions.length} TOTAL QUESTIONS
            </span>
          </div>

          <div className="space-y-3">
            {report.questions.map((q, index) => {
              const isOpen = activeQuestionId === q.id;

              return (
                <motion.div
                  key={q.id}
                  layout
                  className="bg-white dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden"
                >
                  {/* Collapsible Header */}
                  <div
                    onClick={() => toggleQuestion(q.id)}
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition duration-200 select-none"
                  >
                    <div className="space-y-2 flex-1 pr-4">
                      <div className="flex flex-wrap items-center gap-2 font-mono">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                          question_0{index + 1}
                        </span>
                        <span className="text-[10px] font-mono text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2 py-0.5 rounded-md">
                          {q.category || "GENERAL"}
                        </span>
                        <span
                          className={`text-[10px] font-mono border px-2 py-0.5 rounded-md ${getDifficultyBadge(
                            q.difficulty,
                          )}`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug font-sans tracking-tight">
                        {q.questionText}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end font-mono">
                        <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-semibold uppercase">
                          score
                        </span>
                        <span className="text-base font-semibold text-slate-900 dark:text-white font-sans">
                          {q.questionScore || 0}
                          <span className="text-slate-400 dark:text-zinc-500 text-xs font-normal">
                            /10
                          </span>
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUpIcon className="h-5 w-5 text-slate-400 dark:text-zinc-400 shrink-0" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-slate-400 dark:text-zinc-400 shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Collapsible Details */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40 p-6 space-y-6"
                      >
                        {/* Transcribed Candidate Answer */}
                        <div className="space-y-2 font-mono">
                          <h4 className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-tight">
                            transcribed candidate response
                          </h4>
                          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 text-xs text-slate-800 dark:text-zinc-300 leading-relaxed italic shadow-xs rounded-md">
                            "{q.userAnswer || "No answer recorded for this prompt."}"
                          </div>
                        </div>

                        {/* Metric Bars */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-mono">
                          <div className="bg-white dark:bg-zinc-950 p-4 rounded-md border border-slate-200 dark:border-zinc-800 space-y-2">
                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400 uppercase">
                              <span>Correctness</span>
                              <span className="text-slate-900 dark:text-white font-semibold">{q.correctnessScore}/10</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${q.correctnessScore * 10}%` }}
                              />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-zinc-950 p-4 rounded-md border border-slate-200 dark:border-zinc-800 space-y-2">
                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400 uppercase">
                              <span>Confidence</span>
                              <span className="text-slate-900 dark:text-white font-semibold">{q.confidenceScore}/10</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#007cf0]"
                                style={{ width: `${q.confidenceScore * 10}%` }}
                              />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-zinc-950 p-4 rounded-md border border-slate-200 dark:border-zinc-800 space-y-2">
                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400 uppercase">
                              <span>Communication</span>
                              <span className="text-slate-900 dark:text-white font-semibold">{q.communicationScore}/10</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500"
                                style={{ width: `${q.communicationScore * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* AI Feedback */}
                        <div className="bg-blue-50/70 dark:bg-zinc-950 border border-blue-200 dark:border-zinc-800 p-4 rounded-md flex gap-3 text-slate-900 dark:text-zinc-200">
                          <MessageSquareIcon className="h-5 w-5 text-[#007cf0] shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h5 className="text-xs font-mono font-semibold uppercase tracking-tight text-slate-900 dark:text-white">
                              AI EVALUATOR FEEDBACK
                            </h5>
                            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-sans font-normal">
                              {q.aiFeedback ||
                                "Detailed feedback not generated. Ensure response audio was audible."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
