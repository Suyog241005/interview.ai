"use client";

import Link from "next/link";
import { useSession } from "@interview.ai/better-auth/client";
import { Button } from "@interview.ai/ui/button";
import { PageShell } from "@/components/shell";

export default function Page() {
  const { data: session } = useSession();

  return (
    <PageShell>
      <section className="py-20 text-center space-y-6">
        <span className="inline-flex px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono tracking-tight text-[#007cf0] rounded-full">
          recruiter // suite
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Screen candidates with AI voice interviews.
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-600 dark:text-zinc-400">
          Post a job, generate a tailored question set with Gemini, send a
          tokenized invite, and review scored transcripts when candidates finish.
        </p>
        <Button asChild className="rounded-full bg-[#171717] dark:bg-white text-white dark:text-black px-6">
          <Link href={session?.user ? "/dashboard" : "/auth"}>
            {session?.user ? "Go to dashboard" : "Sign in to get started"}
          </Link>
        </Button>
      </section>
    </PageShell>
  );
}
