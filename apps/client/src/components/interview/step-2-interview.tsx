import { type Question } from "@interview.ai/types";
import { useEffect } from "react";

export const Step2Interview = ({
  interviewData,
  onComplete,
}: {
  interviewData: Question[];
  onComplete: (report: any) => void;
}) => {
  useEffect(() => {
    console.log(interviewData);
  }, [interviewData]);

  return <div>Step 2</div>;
};
