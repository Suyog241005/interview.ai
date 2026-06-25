import type { InterviewSession } from "@interview.ai/types";

export const Step3Report = ({
  report,
  onRetake,
}: {
  report: InterviewSession;
  onRetake: () => void;
}) => {
  return <div>{JSON.stringify(report.questions[0], null, 2)}</div>;
};
