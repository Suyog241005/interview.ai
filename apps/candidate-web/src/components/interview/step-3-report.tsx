import type { InterviewWithQuestion, Question } from "@interview.ai/types";
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
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export const Step3Report = ({
  report,
  onRetake,
}: {
  report: InterviewWithQuestion;
  onRetake: () => void;
}) => {
  const navigate = useNavigate();
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    report.questions[0]?.id || null,
  );

  const toggleQuestion = (id: string) => {
    setActiveQuestionId(activeQuestionId === id ? null : id);
  };

  // Helper to calculate overall metric averages
  const calculateAverage = (key: keyof Question) => {
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

  return (
    <div className="min-h-screen bg-[#f3f3f3] py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl space-y-8"
      >
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-3xl border border-gray-200 shadow-sm gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">
              Assessment Completed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Interview Evaluation Report
            </h1>
            <p className="text-sm text-slate-400">
              Review your customized metrics and detailed question-by-question AI analysis below.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onRetake}
              className="px-4 py-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold gap-2 text-sm cursor-pointer shadow-sm"
            >
              <RefreshCwIcon className="h-4 w-4" />
              New Interview
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="px-4 py-5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold gap-2 text-sm cursor-pointer shadow-md"
            >
              <HomeIcon className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>

        {/* Evaluation Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Score Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Overall Rating
              </span>
              <AwardIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="my-4">
              <span className="text-5xl font-black tracking-tight text-gray-900">
                {avgScore}
              </span>
              <span className="text-gray-400 font-semibold text-lg">/10</span>
            </div>
            <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full w-fit">
              Ready for production
            </div>
          </motion.div>

          {/* Correctness Score */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Correctness
              </span>
              <CheckCircle2Icon className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-gray-850">
                {avgCorrectness * 10}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${avgCorrectness * 10}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 block font-medium">
                Accuracy & Tech Competency
              </span>
            </div>
          </motion.div>

          {/* Confidence Score */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Confidence
              </span>
              <TrendingUpIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-gray-850">
                {avgConfidence * 10}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${avgConfidence * 10}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 block font-medium">
                Speech flow and pacing
              </span>
            </div>
          </motion.div>

          {/* Communication Score */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Communication
              </span>
              <MessageSquareIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="my-4">
              <span className="text-4xl font-black text-gray-850">
                {avgCommunication * 10}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${avgCommunication * 10}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 block font-medium">
                Clarity and articulation
              </span>
            </div>
          </motion.div>
        </div>

        {/* Detailed Questions Feedback List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-1">
            Question-by-Question AI Analysis
          </h3>

          <div className="space-y-3">
            {report.questions.map((q, index) => {
              const isOpen = activeQuestionId === q.id;

              return (
                <motion.div
                  key={q.id}
                  layout
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Collapsible Header */}
                  <div
                    onClick={() => toggleQuestion(q.id)}
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 transition duration-250 select-none"
                  >
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">
                          Question {index + 1}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {q.category || "General"}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold border px-2 py-0.5 rounded ${getDifficultyColor(
                            q.difficulty,
                          )}`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-gray-800 leading-snug">
                        {q.questionText}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Score
                        </span>
                        <span className="text-base font-extrabold text-blue-600">
                          {q.questionScore || 0}
                          <span className="text-gray-400 text-xs font-bold">
                            /10
                          </span>
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Collapsible Body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 bg-slate-50/30 p-5 space-y-6">
                          {/* User's Answer Block */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Your Transcribed Answer
                            </h4>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed italic shadow-sm">
                              "{q.userAnswer || "No answer was recorded for this question."}"
                            </div>
                          </div>

                          {/* Question Specific Metrics */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                              <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase">
                                <span>Correctness</span>
                                <span className="text-gray-800">
                                  {q.correctnessScore}/10
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${q.correctnessScore * 10}%` }}
                                />
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                              <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase">
                                <span>Confidence</span>
                                <span className="text-gray-800">
                                  {q.confidenceScore}/10
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${q.confidenceScore * 10}%` }}
                                />
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                              <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase">
                                <span>Communication</span>
                                <span className="text-gray-800">
                                  {q.communicationScore}/10
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${q.communicationScore * 10}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* AI Recruiter Feedback Box */}
                          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-900">
                            <MessageSquareIcon className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                                AI Recruiter Feedback
                              </h5>
                              <p className="text-sm text-blue-850 leading-relaxed font-medium">
                                {q.aiFeedback ||
                                  "Constructive metrics not generated. Please ensure your response was properly audible."}
                              </p>
                            </div>
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
