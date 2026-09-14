"use client";

import Link from "next/link";
import { Card } from "@interview.ai/ui/card";
import { Badge } from "@interview.ai/ui/badge";
import { trpc } from "@interview.ai/api/client";
import { PageShell, RequireRecruiter, Spinner } from "@/components/shell";

export default function InterviewsPage() {
  const interviews = trpc.company.getAllCompanyInterviews.useQuery();

  return (
    <PageShell>
      <RequireRecruiter>
        {() => {
          if (!interviews.data) return <Spinner />;
          // Candidate-less rows are per-job templates, not assessments
          const list = interviews.data.interviews
            .filter((i) => i.candidate)
            .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));

          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Candidate interviews</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  {list.length} assessments across all jobs
                </p>
              </div>

              {list.length === 0 ? (
                <Card className="p-10 text-center text-sm text-slate-500 dark:text-zinc-400">
                  No candidate has redeemed an invite yet.
                </Card>
              ) : (
                <ul className="grid gap-3">
                  {list.map((i) => (
                    <li key={i.id}>
                      <Link href={`/interviews/${i.id}`}>
                        <Card className="p-5 flex flex-row items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                          <div className="min-w-0">
                            <h2 className="font-medium truncate">
                              {i.candidate!.user.name || i.candidate!.user.email}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono truncate">
                              {i.candidate!.user.email} · {i.job?.title ?? "—"} ·{" "}
                              {new Date(i.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={i.status === "COMPLETED" ? "default" : "outline"}>
                            {i.status.replace("_", " ")}
                          </Badge>
                        </Card>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }}
      </RequireRecruiter>
    </PageShell>
  );
}
