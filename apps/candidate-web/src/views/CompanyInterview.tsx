"use client";

import { useState } from "react";
import { Building2Icon, Loader2Icon } from "lucide-react";
import { useSession } from "@interview.ai/better-auth/client";
import { trpc, type RouterOutputs } from "@interview.ai/api/client";
import { Button } from "@interview.ai/ui/button";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Step2Interview } from "@/components/interview/step-2-interview";
import { Step3Report } from "@/components/interview/step-3-report";

type Redeemed = RouterOutputs["companyInterview"]["redeemInvitation"];

const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-6 font-sans">
    <div className="w-full max-w-md">{children}</div>
  </div>
);

/** Candidate entry for a recruiter invitation: /interview?token=… */
export default function CompanyInterviewPage({ token }: { token: string }) {
  const { data: session, isPending } = useSession();
  const invitation = trpc.companyInterview.getInvitation.useQuery({ token }, { retry: false });
  const redeem = trpc.companyInterview.redeemInvitation.useMutation();
  const start = trpc.companyInterview.start.useMutation();
  const submit = trpc.companyInterview.submitAnswer.useMutation();
  const finish = trpc.companyInterview.generateReport.useMutation();
  const [redeemed, setRedeemed] = useState<Redeemed | null>(null);

  if (invitation.error) {
    return (
      <Centered>
        <p className="text-sm text-rose-500 text-center">{invitation.error.message}</p>
      </Centered>
    );
  }
  if (!invitation.data || isPending) {
    return (
      <Centered>
        <Loader2Icon className="animate-spin mx-auto text-slate-400" />
      </Centered>
    );
  }

  const inv = invitation.data.invitation;

  if (!session?.user) {
    return (
      <Centered>
        <InviteSummary inv={inv} />
        <AuthDialog />
      </Centered>
    );
  }

  if (!redeemed) {
    return (
      <Centered>
        <InviteSummary inv={inv} />
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-6 text-center space-y-3">
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Signed in as <span className="font-mono">{session.user.email}</span>
          </p>
          {redeem.error && <p className="text-xs text-rose-500">{redeem.error.message}</p>}
          <Button
            disabled={redeem.isPending}
            onClick={async () => setRedeemed(await redeem.mutateAsync({ token }))}
            className="rounded-full bg-[#171717] dark:bg-white text-white dark:text-black px-6"
          >
            {redeem.isPending ? "Preparing…" : "Continue to assessment"}
          </Button>
        </div>
      </Centered>
    );
  }

  const { interview, jobTitle, interviewMode } = redeemed;

  if (interview.status === "COMPLETED") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans">
        <Step3Report report={interview} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans">
      <Step2Interview
        interviewId={interview.id}
        questions={interview.questions}
        role={`${jobTitle} · ${inv.companyName}`}
        interviewMode={interviewMode}
        // A refresh mid-interview lands here with IN_PROGRESS; start only from PENDING
        onStart={() =>
          interview.status === "PENDING"
            ? start.mutateAsync({ interviewId: interview.id })
            : Promise.resolve()
        }
        onSubmit={(questionId, userAnswer) =>
          submit.mutateAsync({ interviewId: interview.id, questionId, userAnswer })
        }
        onFinish={async () => {
          const { interview: done } = await finish.mutateAsync({ interviewId: interview.id });
          setRedeemed({ ...redeemed, interview: done });
        }}
      />
    </div>
  );
}

function InviteSummary({
  inv,
}: {
  inv: RouterOutputs["companyInterview"]["getInvitation"]["invitation"];
}) {
  const expired = inv.status === "PENDING" && new Date(inv.expiresAt) < new Date();
  return (
    <div className="mb-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />
      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#007cf0] mb-2">
        <Building2Icon size={12} /> {inv.companyName}
      </span>
      <h1 className="text-lg font-semibold tracking-tight">{inv.jobTitle}</h1>
      <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-1">
        {inv.interviewMode} · {inv.questionCount} questions · invited as {inv.candidateEmail}
      </p>
      {expired && <p className="text-xs text-rose-500 mt-2">This invitation has expired.</p>}
      {inv.status === "ACCEPTED" && (
        <p className="text-xs text-slate-500 mt-2">Already started. Continue below.</p>
      )}
    </div>
  );
}
