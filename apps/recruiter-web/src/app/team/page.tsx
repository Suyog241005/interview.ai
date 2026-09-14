"use client";

import { useState } from "react";
import { useSession } from "@interview.ai/better-auth/client";
import { trpc } from "@interview.ai/api/client";
import { Card } from "@interview.ai/ui/card";
import { Badge } from "@interview.ai/ui/badge";
import { Button } from "@interview.ai/ui/button";
import { Input } from "@interview.ai/ui/input";
import { CopyButton, PageShell, RequireRecruiter } from "@/components/shell";

export default function TeamPage() {
  const { data: session } = useSession();

  return (
    <PageShell>
      <RequireRecruiter>
        {(company) => (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {company.recruiters.length} recruiters at {company.name}
              </p>
            </div>

            <Card className="p-6">
              <ul className="divide-y divide-slate-200 dark:divide-zinc-800">
                {company.recruiters.map((r) => (
                  <li key={r.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.user.name || r.user.email}</p>
                      <p className="text-xs font-mono text-slate-500 truncate">{r.user.email}</p>
                    </div>
                    {r.userId === company.ownerId && <Badge variant="outline">owner</Badge>}
                  </li>
                ))}
              </ul>
            </Card>

            {company.ownerId === session?.user.id ? (
              <InviteRecruiter />
            ) : (
              <p className="text-xs text-slate-500">Only the company owner can invite recruiters.</p>
            )}
          </div>
        )}
      </RequireRecruiter>
    </PageShell>
  );
}

/** Owner only: the query and mutation both sit behind protectedCompanyOwnerProcedure. */
function InviteRecruiter() {
  const utils = trpc.useUtils();
  const pending = trpc.company.getRecruiterInvitations.useQuery();
  const invite = trpc.company.inviteRecruiter.useMutation({
    onSuccess: () => utils.company.getRecruiterInvitations.invalidate(),
  });
  const [email, setEmail] = useState("");

  const onInvite = async () => {
    await invite.mutateAsync({ email });
    setEmail("");
  };
  const links = pending.data?.invitations ?? [];

  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-semibold">Invite a recruiter</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && email && onInvite()}
        />
        <Button onClick={onInvite} disabled={invite.isPending || !email} className="rounded-full shrink-0">
          {invite.isPending ? "Creating…" : "Create invite link"}
        </Button>
      </div>
      {invite.error && <p className="text-xs text-rose-500">{invite.error.message}</p>}
      {links.length > 0 && (
        <ul className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
          {links.map((l) => {
            const url = `${window.location.origin}/accept-invite?token=${l.token}`;
            const expired = l.status === "PENDING" && new Date(l.expiresAt) < new Date();
            return (
              <li key={l.token} className="flex items-center gap-2 text-xs">
                <span className="font-mono text-slate-500 w-48 truncate shrink-0">{l.email}</span>
                <Badge variant="outline" className="shrink-0">
                  {expired ? "EXPIRED" : l.status}
                </Badge>
                <code className="flex-1 truncate text-slate-700 dark:text-zinc-300">{url}</code>
                <CopyButton value={url} />
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[11px] text-slate-400">
        Links expire in 7 days. The colleague must sign in with the invited email.
      </p>
    </Card>
  );
}
