"use client";

import { useEffect, useState } from "react";
import { Step1Setup } from "@/components/interview/step-1-setup";
import { Step2Interview } from "@/components/interview/step-2-interview";
import { Step3Report } from "@/components/interview/step-3-report";
import type { PracticeInterviewWithQuestion } from "@interview.ai/api/client";

export default function InterviewPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [interviewData, setInterviewData] =
    useState<null | PracticeInterviewWithQuestion>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center font-sans">
        <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
          Loading AI interview cockpit...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      {step === 1 && (
        <Step1Setup
          onStart={(data) => {
            setInterviewData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && interviewData && (
        <Step2Interview
          interviewData={interviewData}
          onComplete={(report) => {
            setInterviewData(report);
            setStep(3);
          }}
        />
      )}
      {step === 3 && interviewData && (
        <Step3Report
          report={interviewData}
          onRetake={() => {
            setStep(1);
          }}
        />
      )}
    </div>
  );
}
