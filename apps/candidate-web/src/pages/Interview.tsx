import { Step1Setup } from "@/components/interview/step-1-setup";
import { Step2Interview } from "@/components/interview/step-2-interview";
import { Step3Report } from "@/components/interview/step-3-report";
import {
  type InterviewWithQuestion,
} from "@interview.ai/types";
import { useState } from "react";

export default function InterviewPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [interviewData, setInterviewData] =
    useState<null | InterviewWithQuestion>(null);

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
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
      {step === 3 && interviewData &&(
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
