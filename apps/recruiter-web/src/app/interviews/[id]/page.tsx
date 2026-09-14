"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Card } from "@interview.ai/ui/card";
import { Badge } from "@interview.ai/ui/badge";
import { trpc } from "@interview.ai/api/client";
import { PageShell, RequireRecruiter, Spinner } from "@/components/shell";

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const q = trpc.company.getCompanyInterviewById.useQuery({ interviewId: id });

  return (
    <PageShell>
      <RequireRecruiter>
        {() => {
          if (q.error) return <p className="text-sm text-rose-500">{q.error.message}</p>;
          if (!q.data) return <Spinner />;
          const i = q.data.interview;
          const questions = [...i.questions].sort((a, b) => a.displayOrder - b.displayOrder);

          return (
            <div className="space-y-6">
              <Link
                href="/interviews"
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeftIcon size={12} /> All interviews
              </Link>

              <header className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {i.candidate?.user.name || i.candidate?.user.email || "Template"}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-1">
                    {i.candidate?.user.email} · {i.job?.title ?? "—"}
                    {i.startedAt && ` · started ${new Date(i.startedAt).toLocaleString()}`}
                    {i.completedAt && ` · completed ${new Date(i.completedAt).toLocaleString()}`}
                  </p>
                </div>
                <Badge variant={i.status === "COMPLETED" ? "default" : "outline"}>
                  {i.status.replace("_", " ")}
                </Badge>
              </header>

              {i.report ? (
                <Card className="p-6 space-y-5">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-slate-500">overall</p>
                      <p className="text-4xl font-semibold tracking-tight">
                        {i.report.overallScore}
                        <span className="text-base text-slate-400">/100</span>
                      </p>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-zinc-300 flex-1">{i.report.summary}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ListBlock title="Strengths" items={i.report.strengths} tone="emerald" />
                    <ListBlock title="Weaknesses" items={i.report.weaknesses} tone="rose" />
                  </div>
                  {i.report.recommendation && (
                    <div className="pt-4 border-t border-slate-200 dark:border-zinc-800">
                      <p className="text-[10px] font-mono uppercase text-slate-500 mb-1">recommendation</p>
                      <p className="text-sm">{i.report.recommendation}</p>
                    </div>
                  )}
                </Card>
              ) : (
                <Card className="p-6 text-sm text-slate-500 dark:text-zinc-400">
                  No report yet. The candidate has not finished the assessment.
                </Card>
              )}

              <Card className="p-6 space-y-3">
                <h2 className="font-semibold">
                  Transcript ({questions.filter((x) => x.isAnswered).length}/{questions.length} answered)
                </h2>
                <ol className="space-y-3">
                  {questions.map((x) => (
                    <li key={x.id} className="rounded-md border border-slate-200 dark:border-zinc-800 p-4">
                      <p className="text-[11px] font-mono text-slate-400 mb-1">
                        {x.displayOrder} · {x.difficulty} · {x.timeLimitSeconds}s
                        {x.category ? ` · ${x.category}` : ""}
                      </p>
                      <p className="text-sm font-medium">{x.questionText}</p>
                      <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 whitespace-pre-wrap font-mono">
                        {x.userAnswer?.trim() || (x.isAnswered ? "(no speech captured)" : "(unanswered)")}
                      </p>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          );
        }}
      </RequireRecruiter>
    </PageShell>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "rose" }) {
  const color = tone === "emerald" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
  return (
    <div>
      <p className={`text-[10px] font-mono uppercase mb-1 ${color}`}>{title}</p>
      {items.length ? (
        <ul className="list-disc pl-4 text-sm space-y-1">
          {items.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-400">None listed</p>
      )}
    </div>
  );
}
