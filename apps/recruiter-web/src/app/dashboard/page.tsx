"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Card } from "@interview.ai/ui/card";
import { Badge } from "@interview.ai/ui/badge";
import { Button } from "@interview.ai/ui/button";
import { PageShell, RequireRecruiter } from "@/components/shell";

export default function DashboardPage() {
  return (
    <PageShell>
      <RequireRecruiter>
        {(company) => (
          <div className="space-y-8">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[11px] font-mono text-[#007cf0]">{company.name}</p>
                <h1 className="text-2xl font-semibold tracking-tight">Job openings</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  {company.jobs.length} jobs · {company.recruiters.length} recruiters
                </p>
              </div>
              <Button asChild className="rounded-full">
                <Link href="/jobs/new">
                  <PlusIcon size={14} /> New job
                </Link>
              </Button>
            </div>

            {company.jobs.length === 0 ? (
              <Card className="p-10 text-center text-sm text-slate-500 dark:text-zinc-400">
                No jobs yet. Create one to generate an interview and invite candidates.
              </Card>
            ) : (
              <ul className="grid gap-3">
                {company.jobs.map((job) => (
                  <li key={job.id}>
                    <Link href={`/jobs/${job.id}`}>
                      <Card className="p-5 flex flex-row items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="min-w-0">
                          <h2 className="font-medium truncate">{job.title}</h2>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                            {job.minExperienceYears}
                            {job.maxExperienceYears ? `–${job.maxExperienceYears}` : "+"} yrs ·{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={job.status === "OPEN" ? "default" : "outline"}>
                          {job.status}
                        </Badge>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </RequireRecruiter>
    </PageShell>
  );
}
