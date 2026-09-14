"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "@interview.ai/better-auth/client";
import { trpc } from "@interview.ai/api/client";
import { CreateCompanySchema } from "@interview.ai/types/company";
import { Card } from "@interview.ai/ui/card";
import { Input } from "@interview.ai/ui/input";
import { Button } from "@interview.ai/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@interview.ai/ui/field";
import { PageShell, Spinner } from "@/components/shell";

type FormValues = z.infer<typeof CreateCompanySchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const existing = trpc.company.getCompany.useQuery(undefined, {
    enabled: !!session?.user,
    retry: false,
  });
  const create = trpc.company.createCompany.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/auth");
    if (existing.data) router.replace("/dashboard");
  }, [isPending, session?.user, existing.data, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: { companyName: "", website: undefined, logoUrl: undefined },
  });

  const onSubmit = async (values: FormValues) => {
    // Empty optional URL fields must be undefined, not "", to pass z.url()
    await create.mutateAsync({
      companyName: values.companyName,
      website: values.website || undefined,
      logoUrl: values.logoUrl || undefined,
    });
    await utils.company.getCompany.invalidate();
    router.replace("/dashboard");
  };

  if (isPending || existing.isLoading) {
    return (
      <PageShell>
        <Spinner />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Card className="max-w-lg mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Create your company</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            You become the owner and first recruiter. Invite teammates later.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="companyName">Company name</FieldLabel>
              <Input id="companyName" placeholder="Acme Inc." {...form.register("companyName")} />
              <FieldError errors={[form.formState.errors.companyName]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="website">Website (optional)</FieldLabel>
              <Input id="website" placeholder="https://acme.com" {...form.register("website")} />
              <FieldError errors={[form.formState.errors.website]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="logoUrl">Logo URL (optional)</FieldLabel>
              <Input id="logoUrl" placeholder="https://acme.com/logo.png" {...form.register("logoUrl")} />
              <FieldError errors={[form.formState.errors.logoUrl]} />
            </Field>
            {create.error && <p className="text-xs text-rose-500">{create.error.message}</p>}
            <Button type="submit" disabled={create.isPending} className="rounded-full">
              {create.isPending ? "Creating…" : "Create company"}
            </Button>
          </FieldGroup>
        </form>
      </Card>
    </PageShell>
  );
}
