import { useState } from "react";
import { useGetInterviewHistory } from "@interview.ai/query";
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
import { useNavigate } from "react-router";

export default function InterviewHistoryPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetInterviewHistory();
  const [expandedInterviewId, setExpandedInterviewId] = useState<string | null>(
    null,
  );

  const toggleExpand = (id: string) => {
    setExpandedInterviewId(expandedInterviewId === id ? null : id);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toUpperCase()) {
      case "EASY":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "HARD":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  } as const;

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 mb-3 text-xs font-semibold text-slate-800">
            <BrainCircuitIcon className="h-3.5 w-3.5 text-slate-800" />
            Performance Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Interview History
          </h1>
          <p className="text-slate-500 mt-2">
            Review your past mock assessments, AI feedback, and detailed
            performance metrics.
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2Icon className="animate-spin text-slate-900 h-10 w-10" />
            <p className="text-sm font-semibold text-slate-500">
              Loading your history...
            </p>
          </div>
        )}

        {isError && (
          <Card className="bg-white p-8 border border-gray-200 rounded-3xl text-center shadow-sm max-w-lg mx-auto mt-10">
            <CardContent className="pt-6 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Failed to load history
              </h3>
              <p className="text-sm text-gray-500">
                There was a problem retrieving your past interviews. Please try
                again.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-4 py-2 font-bold cursor-pointer"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && (!data || data.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 border border-gray-200 rounded-3xl text-center shadow-sm max-w-lg mx-auto mt-10"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-center text-slate-400 mb-6">
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              No interviews recorded
            </h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Start your first AI-powered interview practice session to track
              your history and get detailed score evaluations.
            </p>
            <Button
              onClick={() => navigate("/interview")}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 py-5 font-bold cursor-pointer inline-flex items-center gap-2 shadow-sm text-sm"
            >
              Start Interview
            </Button>
          </motion.div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {data.map((interview) => {
              const isExpanded = expandedInterviewId === interview.id;
              const formattedDate = new Date(
                interview.createdAt,
              ).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
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
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Card Header clickable area */}
                  <div
                    onClick={() => toggleExpand(interview.id)}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-zinc-600 uppercase tracking-wider">
                          {interview.interviewMode.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <CalendarIcon className="h-3 w-3" />
                          {formattedDate}
                        </div>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BriefcaseIcon className="h-4 w-4 text-slate-500 shrink-0" />
                        {interview.role}
                      </h2>
                      <p className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded w-fit">
                        {interview.experience} Experience
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-semibold">
                          Evaluation Score
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-gray-900">
                            {averageScore}
                          </span>
                          <span className="text-xs text-slate-400">/ 10</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable detailed view */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 bg-slate-50/50"
                      >
                        <div className="p-5 sm:p-6 space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="text-center sm:text-left">
                              <span className="text-xs text-slate-400 font-semibold block">
                                Total Questions
                              </span>
                              <span className="text-lg font-bold text-slate-800">
                                {interview.questions.length}
                              </span>
                            </div>
                            <div className="text-center sm:text-left">
                              <span className="text-xs text-slate-400 font-semibold block">
                                Correctness Score
                              </span>
                              <span className="text-lg font-bold text-slate-800">
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
                            <div className="text-center sm:text-left">
                              <span className="text-xs text-slate-400 font-semibold block">
                                Confidence Score
                              </span>
                              <span className="text-lg font-bold text-slate-800">
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
                            <div className="text-center sm:text-left">
                              <span className="text-xs text-slate-400 font-semibold block">
                                Communication
                              </span>
                              <span className="text-lg font-bold text-slate-800">
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
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                              <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                              Question Evaluation Details
                            </h3>

                            <div className="space-y-3">
                              {interview.questions.map((q, idx) => (
                                <div
                                  key={q.id}
                                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                      Q{idx + 1}
                                    </span>
                                    <span
                                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getDifficultyColor(q.difficulty)}`}
                                    >
                                      {q.difficulty}
                                    </span>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                                    {q.questionText}
                                  </p>

                                  {q.userAnswer ? (
                                    <div className="pt-2 border-t border-slate-50 space-y-2">
                                      <div className="text-xs">
                                        <span className="font-bold text-slate-500 block">
                                          Your Answer:
                                        </span>
                                        <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                                          {q.userAnswer}
                                        </p>
                                      </div>

                                      {q.aiFeedback && (
                                        <div className="text-xs">
                                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                                            <MessageSquareIcon className="h-3 w-3" />
                                            AI Evaluation & Feedback:
                                          </span>
                                          <p className="text-slate-600 bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-100/50 mt-1">
                                            {q.aiFeedback}
                                          </p>
                                        </div>
                                      )}

                                      <div className="flex gap-4 pt-1 text-[11px] font-semibold text-slate-500">
                                        <span>
                                          Score:{" "}
                                          <strong className="text-slate-800">
                                            {q.questionScore}/10
                                          </strong>
                                        </span>
                                        <span>
                                          Correctness:{" "}
                                          <strong className="text-slate-800">
                                            {q.correctnessScore}/10
                                          </strong>
                                        </span>
                                        <span>
                                          Confidence:{" "}
                                          <strong className="text-slate-800">
                                            {q.confidenceScore}/10
                                          </strong>
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-xs italic text-slate-400">
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
        )}
      </main>

      <Footer />
    </div>
  );
}
