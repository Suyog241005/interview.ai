"use client";

import { useEffect, useState } from "react";
import { Step1Setup } from "@/components/interview/step-1-setup";
import { Step2Interview } from "@/components/interview/step-2-interview";
import { Step3Report } from "@/components/interview/step-3-report";
import { trpc, type PracticeInterviewWithQuestion } from "@interview.ai/api/client";

export default function InterviewPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [interviewData, setInterviewData] =
    useState<null | PracticeInterviewWithQuestion>(null);

  const start = trpc.practice.startPracticeInterview.useMutation();
  const submit = trpc.practice.submitAnswer.useMutation();
  const finish = trpc.practice.generatePracticeInterviewReport.useMutation();

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
          interviewId={interviewData.id}
          questions={interviewData.questions}
          role={interviewData.role}
          interviewMode={interviewData.interviewMode}
          onStart={() => start.mutateAsync({ practiceinterviewId: interviewData.id })}
          onSubmit={(questionId, userAnswer) =>
            submit.mutateAsync({ interviewId: interviewData.id, questionId, userAnswer })
          }
          onFinish={async () => {
            const { practiceInterview } = await finish.mutateAsync({
              practiceinterviewId: interviewData.id,
            });
            setInterviewData(practiceInterview);
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
