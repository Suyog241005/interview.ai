"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@interview.ai/better-auth/client";
import { trpc } from "@interview.ai/api/client";
import { Card } from "@interview.ai/ui/card";
import { Button } from "@interview.ai/ui/button";
import { PageShell, Spinner } from "@/components/shell";

function AcceptInvite() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const { data: session, isPending } = useSession();
  const accept = trpc.recruiterAuth.acceptInvitation.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(`/auth?next=${encodeURIComponent(`/accept-invite?token=${token}`)}`);
    }
  }, [isPending, session?.user, router, token]);

  const onAccept = async () => {
    await accept.mutateAsync({ token });
    await utils.company.getCompany.invalidate();
    router.replace("/dashboard");
  };

  if (isPending || !session?.user) return <Spinner />;

  return (
    <Card className="max-w-md mx-auto p-8 space-y-4 text-center">
      <h1 className="text-xl font-semibold tracking-tight">Join your team</h1>
      <p className="text-xs text-slate-500 dark:text-zinc-400">
        Signed in as <span className="font-mono">{session.user.email}</span>. The
        invite must have been sent to this address.
      </p>
      {!token && <p className="text-xs text-rose-500">Missing invite token in the URL.</p>}
      {accept.error && <p className="text-xs text-rose-500">{accept.error.message}</p>}
      <Button onClick={onAccept} disabled={!token || accept.isPending} className="rounded-full">
        {accept.isPending ? "Joining…" : "Accept invitation"}
      </Button>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <PageShell>
      <Suspense fallback={<Spinner />}>
        <AcceptInvite />
      </Suspense>
    </PageShell>
  );
}
