"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { motion, AnimatePresence } from "motion/react";
import {
  BriefcaseIcon,
  CalendarIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircle2Icon,
  MessageSquareIcon,
  BrainCircuitIcon,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@interview.ai/ui/button";
import { Card, CardContent } from "@interview.ai/ui/card";
import { useRouter } from "next/navigation";
import { trpc } from "@interview.ai/api/client";

const HistoryList = () => {
  const router = useRouter();
  const { data, isLoading, isError } =
    trpc.practice.getPracticeInterviewHistory.useQuery();
  const history = data?.history ?? [];
  const [expandedInterviewId, setExpandedInterviewId] = useState<string | null>(
    null,
  );

  const toggleExpand = (id: string) => {
    setExpandedInterviewId(expandedInterviewId === id ? null : id);
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  } as const;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2Icon className="animate-spin text-slate-900 dark:text-white h-8 w-8" />
        <p className="text-xs font-mono tracking-tight text-slate-500 dark:text-zinc-500">
          Retrieving assessment records...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white dark:bg-zinc-950 p-8 border border-slate-200 dark:border-zinc-800 rounded-lg text-center shadow-xl max-w-lg mx-auto mt-10 text-slate-900 dark:text-white">
        <CardContent className="pt-6 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
            ⚠️
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Failed to retrieve history.
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal">
            An issue occurred while fetching your candidate history records.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-2 bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 rounded-full px-6 py-2 font-medium text-xs tracking-tight cursor-pointer"
          >
            Retry Load
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-950 p-12 border border-slate-200 dark:border-zinc-800 rounded-lg text-center shadow-xl max-w-lg mx-auto mt-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />
        <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400 mb-6">
          <BookOpenIcon className="h-6 w-6 text-[#007cf0]" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
          No interview records found.
        </h3>
        <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal mt-2 mb-6 leading-relaxed font-sans">
          Launch your first AI-powered interview practice session to build your historical evaluation dashboard.
        </p>
        <Button
          onClick={() => router.push("/interview")}
          className="bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 rounded-full px-8 py-3.5 font-medium text-xs tracking-tight cursor-pointer inline-flex items-center gap-2 shadow-lg font-sans"
        >
          Start Mock Interview →
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {history.map((interview) => {
        const isExpanded = expandedInterviewId === interview.id;
        const formattedDate = new Date(interview.createdAt).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        );
        const averageScore = interview.questions.length
          ? Math.round(
              (interview.questions.reduce(
                (sum, q) => sum + q.questionScore,
                0,
              ) /
                interview.questions.length) *
                10,
            ) / 10
          : 0;

        return (
          <motion.div
            key={interview.id}
            variants={itemVariants}
            layout
            className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-250 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-200 dark:bg-zinc-800" />
            <div
              onClick={() => toggleExpand(interview.id)}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors"
            >
              <div className="space-y-1.5 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#007cf0] uppercase tracking-tight">
                    {interview.interviewMode.replace("_", " ")}
                  </span>
                  <span className="text-slate-400 dark:text-zinc-600">•</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4 text-slate-500 dark:text-zinc-400 shrink-0" />
                  <span>{interview.role}</span>
                </h2>
                <p className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2 py-0.5 rounded-md w-fit">
                  {interview.experienceYears} Years Experience
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-zinc-800/80">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-semibold">
                    score
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-slate-900 dark:text-white font-sans tracking-tight">
                      {averageScore}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500">/ 10</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUpIcon className="h-5 w-5 text-slate-400 dark:text-zinc-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-slate-400 dark:text-zinc-400" />
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-900/30"
                >
                  <div className="p-5 sm:p-6 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-zinc-950 p-4 rounded-md border border-slate-200 dark:border-zinc-800 font-mono shadow-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase block">
                          TOTAL QUESTIONS
                        </span>
                        <span className="text-base font-semibold text-slate-900 dark:text-white font-sans">
                          {interview.questions.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase block">
                          CORRECTNESS
                        </span>
                        <span className="text-base font-semibold text-slate-900 dark:text-white font-sans">
                          {interview.questions.length
                            ? Math.round(
                                (interview.questions.reduce(
                                  (sum, q) => sum + q.correctnessScore,
                                  0,
                                ) /
                                  interview.questions.length) *
                                  10,
                              ) / 10
                            : 0}{" "}
                          / 10
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase block">
                          CONFIDENCE
                        </span>
                        <span className="text-base font-semibold text-slate-900 dark:text-white font-sans">
                          {interview.questions.length
                            ? Math.round(
                                (interview.questions.reduce(
                                  (sum, q) => sum + q.confidenceScore,
                                  0,
                                ) /
                                  interview.questions.length) *
                                  10,
                              ) / 10
                            : 0}{" "}
                          / 10
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase block">
                          COMMUNICATION
                        </span>
                        <span className="text-base font-semibold text-slate-900 dark:text-white font-sans">
                          {interview.questions.length
                            ? Math.round(
                                (interview.questions.reduce(
                                  (sum, q) => sum + q.communicationScore,
                                  0,
                                ) /
                                  interview.questions.length) *
                                  10,
                              ) / 10
                            : 0}{" "}
                          / 10
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-tight flex items-center gap-1.5">
                        <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                        question evaluation details
                      </h3>

                      <div className="space-y-3">
                        {interview.questions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="bg-white dark:bg-zinc-950 p-4 rounded-md border border-slate-200 dark:border-zinc-800 space-y-3 font-mono shadow-xs"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2 py-0.5 rounded-md">
                                q0{idx + 1}
                              </span>
                              <span
                                className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md ${getDifficultyBadge(q.difficulty)}`}
                              >
                                {q.difficulty}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed font-sans tracking-tight">
                              {q.questionText}
                            </p>

                            {q.userAnswer ? (
                              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800/60 space-y-2">
                                <div className="text-xs">
                                  <span className="font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                                    TRANSCRIBED ANSWER:
                                  </span>
                                  <p className="text-slate-800 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-md border border-slate-200 dark:border-zinc-800 italic font-mono">
                                    "{q.userAnswer}"
                                  </p>
                                </div>

                                {q.aiFeedback && (
                                  <div className="text-xs">
                                    <span className="font-semibold text-[#007cf0] flex items-center gap-1 mb-1">
                                      <MessageSquareIcon className="h-3 w-3" />
                                      AI FEEDBACK & ANALYSIS:
                                    </span>
                                    <p className="text-slate-800 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-900/40 p-3 rounded-md border border-slate-200 dark:border-zinc-800 font-sans font-normal">
                                      {q.aiFeedback}
                                    </p>
                                  </div>
                                )}

                                <div className="flex gap-4 pt-1 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                  <span>
                                    SCORE: <strong className="text-slate-900 dark:text-white">{q.questionScore}/10</strong>
                                  </span>
                                  <span>
                                    CORRECTNESS: <strong className="text-slate-900 dark:text-white">{q.correctnessScore}/10</strong>
                                  </span>
                                  <span>
                                    CONFIDENCE: <strong className="text-slate-900 dark:text-white">{q.confidenceScore}/10</strong>
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs italic text-slate-400 dark:text-zinc-500">
                                Skipped or unanswered.
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default function InterviewHistoryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 mb-3 text-[11px] font-mono tracking-tight uppercase text-[#007cf0] rounded-full">
            <BrainCircuitIcon className="h-3.5 w-3.5 text-[#007cf0]" />
            <span>performance // history</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Interview assessment history.
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal mt-2 font-sans">
            Review past practice mock evaluations, voice performance metrics, and question-by-question AI feedback.
          </p>
        </motion.div>

        {mounted ? (
          <HistoryList />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2Icon className="animate-spin text-slate-900 dark:text-white h-8 w-8" />
            <p className="text-xs font-mono tracking-tight text-slate-500 dark:text-zinc-500">
              Loading assessment records...
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
