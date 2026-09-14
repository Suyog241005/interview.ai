"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CheckIcon, CopyIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import { trpc, type RouterOutputs } from "@interview.ai/api/client";
import { Card } from "@interview.ai/ui/card";
import { Badge } from "@interview.ai/ui/badge";
import { Button } from "@interview.ai/ui/button";
import { Input } from "@interview.ai/ui/input";
import { PageShell, RequireRecruiter, Spinner } from "@/components/shell";

const CANDIDATE_URL =
  (process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_CANDIDATE_URL
    : process.env.NEXT_PUBLIC_CANDIDATE_URL) ?? "http://localhost:5173";

type Question = RouterOutputs["company"]["getQuestions"]["questions"][number];

export default function JobPage() {
  const { id: jobId } = useParams<{ id: string }>();
  const job = trpc.company.getJob.useQuery({ jobId });
  // ponytail: no per-job interview query exists; filter the company-wide list client-side
  const interviews = trpc.company.getAllCompanyInterviews.useQuery();
  const template = interviews.data?.interviews.find(
    (i) => i.jobId === jobId && !i.candidateId,
  );

  return (
    <PageShell>
      <RequireRecruiter>
        {() =>
          !job.data || !interviews.data ? (
            <Spinner />
          ) : (
            <div className="space-y-8">
              <header>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">{job.data.job.title}</h1>
                  <Badge variant="outline">{job.data.job.status}</Badge>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-zinc-400 mt-1">
                  {job.data.job.interviewConfig
                    ? `${job.data.job.interviewConfig.interviewMode} · ${job.data.job.interviewConfig.questionCount} questions · ${job.data.job.interviewConfig.durationMinutes} min`
                    : "No interview config"}
                </p>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mt-4 whitespace-pre-wrap">
                  {job.data.job.description}
                </p>
              </header>

              {template ? (
                <>
                  <Questions interviewId={template.id} />
                  <Invite jobId={jobId} interviewId={template.id} />
                </>
              ) : (
                <CreateInterview jobId={jobId} />
              )}
            </div>
          )
        }
      </RequireRecruiter>
    </PageShell>
  );
}

function CreateInterview({ jobId }: { jobId: string }) {
  const utils = trpc.useUtils();
  const create = trpc.company.createInterview.useMutation({
    onSuccess: () => utils.company.getAllCompanyInterviews.invalidate(),
  });
  return (
    <Card className="p-8 text-center space-y-3">
      <p className="text-sm text-slate-600 dark:text-zinc-400">
        Set up the interview for this job to generate questions and invite candidates.
      </p>
      {create.error && <p className="text-xs text-rose-500">{create.error.message}</p>}
      <Button onClick={() => create.mutate({ jobId })} disabled={create.isPending} className="rounded-full">
        {create.isPending ? "Creating…" : "Set up interview"}
      </Button>
    </Card>
  );
}

function Questions({ interviewId }: { interviewId: string }) {
  const utils = trpc.useUtils();
  const invalidate = () => utils.company.getQuestions.invalidate({ interviewId });
  const questions = trpc.company.getQuestions.useQuery({ interviewId });
  const generate = trpc.company.generateAiQuestions.useMutation({ onSuccess: invalidate });
  const remove = trpc.company.deleteQuestion.useMutation({ onSuccess: invalidate });
  const update = trpc.company.updateQuestion.useMutation({ onSuccess: invalidate });
  const add = trpc.company.createQuestion.useMutation({ onSuccess: invalidate });
  const [draft, setDraft] = useState("");

  const list = questions.data?.questions ?? [];

  const onGenerate = () => {
    if (list.length && !confirm("Regenerating replaces all existing questions. Continue?")) return;
    generate.mutate({ interviewId });
  };

  const onAdd = () => {
    if (!draft.trim()) return;
    add.mutate({
      interviewId,
      questionText: draft.trim(),
      difficulty: "MEDIUM",
      timeLimitSeconds: 90,
      displayOrder: list.length + 1,
    });
    setDraft("");
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold">Questions ({list.length})</h2>
        <Button onClick={onGenerate} disabled={generate.isPending} size="sm" className="rounded-full">
          <SparklesIcon size={14} />
          {generate.isPending ? "Generating…" : list.length ? "Regenerate with AI" : "Generate with AI"}
        </Button>
      </div>
      {generate.error && <p className="text-xs text-rose-500">{generate.error.message}</p>}

      {questions.isLoading ? (
        <Spinner />
      ) : (
        <ol className="space-y-2">
          {list.map((q) => (
            <QuestionRow
              key={q.id}
              q={q}
              onSave={(questionText) => update.mutate({ questionId: q.id, questionText })}
              onDelete={() => remove.mutate({ questionId: q.id })}
            />
          ))}
        </ol>
      )}

      <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
        <Input
          placeholder="Add a question manually…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
        <Button variant="outline" onClick={onAdd} disabled={add.isPending || !draft.trim()}>
          Add
        </Button>
      </div>
    </Card>
  );
}

function QuestionRow({
  q,
  onSave,
  onDelete,
}: {
  q: Question;
  onSave: (text: string) => void;
  onDelete: () => void;
}) {
  const [text, setText] = useState(q.questionText);
  return (
    <li className="flex items-start gap-3 rounded-md border border-slate-200 dark:border-zinc-800 p-3">
      <span className="text-[11px] font-mono text-slate-400 pt-1 w-5 shrink-0">{q.displayOrder}</span>
      <div className="flex-1 min-w-0 space-y-1">
        <textarea
          className="w-full bg-transparent text-sm resize-none focus:outline-none"
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => text !== q.questionText && onSave(text)}
        />
        <p className="text-[11px] font-mono text-slate-400">
          {q.difficulty} · {q.timeLimitSeconds}s{q.category ? ` · ${q.category}` : ""}
        </p>
      </div>
      <button onClick={onDelete} className="text-slate-400 hover:text-rose-500 cursor-pointer" aria-label="Delete question">
        <Trash2Icon size={14} />
      </button>
    </li>
  );
}

function Invite({ jobId, interviewId }: { jobId: string; interviewId: string }) {
  const invite = trpc.company.inviteCandidate.useMutation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  // ponytail: no list-invitations procedure; links live in component state for this session only
  const [links, setLinks] = useState<{ email: string; url: string }[]>([]);

  const onInvite = async () => {
    const { invitation } = await invite.mutateAsync({
      jobId,
      interviewId,
      candidateEmail: email,
      candidateName: name || undefined,
    });
    setLinks((l) => [{ email, url: `${CANDIDATE_URL}/interview?token=${invitation.token}` }, ...l]);
    setEmail("");
    setName("");
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-semibold">Invite a candidate</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input type="email" placeholder="candidate@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={onInvite} disabled={invite.isPending || !email} className="rounded-full shrink-0">
          {invite.isPending ? "Creating…" : "Create invite link"}
        </Button>
      </div>
      {invite.error && <p className="text-xs text-rose-500">{invite.error.message}</p>}
      {links.length > 0 && (
        <ul className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
          {links.map((l) => (
            <li key={l.url} className="flex items-center gap-2 text-xs">
              <span className="font-mono text-slate-500 w-48 truncate shrink-0">{l.email}</span>
              <code className="flex-1 truncate text-slate-700 dark:text-zinc-300">{l.url}</code>
              <CopyButton value={l.url} />
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-slate-400">Links expire in 7 days. Send them to the candidate yourself; email delivery is not wired up yet.</p>
    </Card>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button variant="outline" size="icon" onClick={copy} className="w-7 h-7 shrink-0" aria-label="Copy link">
      {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
    </Button>
  );
}
