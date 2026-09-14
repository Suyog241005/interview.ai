"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@interview.ai/api/client";
import { CreateJobSchema, UpsertInterviewConfigSchema } from "@interview.ai/types/job";
import { Card } from "@interview.ai/ui/card";
import { Input } from "@interview.ai/ui/input";
import { Button } from "@interview.ai/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@interview.ai/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@interview.ai/ui/select";
import { PageShell, RequireRecruiter } from "@/components/shell";

const formSchema = CreateJobSchema.extend(
  UpsertInterviewConfigSchema.omit({ jobId: true }).shape,
);
type FormValues = z.input<typeof formSchema>;

const textareaClass =
  "w-full min-h-32 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function NewJobPage() {
  const router = useRouter();
  const createJob = trpc.company.createJob.useMutation();
  const upsertConfig = trpc.company.upsertInterviewConfig.useMutation();
  const utils = trpc.useUtils();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "OPEN",
      minExperienceYears: 0,
      maxExperienceYears: undefined,
      questionCount: 5,
      interviewMode: "TECHNICAL",
      durationMinutes: 30,
      prompt: "",
    },
  });

  const onSubmit = async (raw: FormValues) => {
    const values = formSchema.parse(raw);
    const { job } = await createJob.mutateAsync({
      title: values.title,
      description: values.description,
      status: values.status,
      minExperienceYears: values.minExperienceYears,
      maxExperienceYears: values.maxExperienceYears,
    });
    await upsertConfig.mutateAsync({
      jobId: job.id,
      questionCount: values.questionCount,
      interviewMode: values.interviewMode,
      durationMinutes: values.durationMinutes,
      prompt: values.prompt || undefined,
    });
    await utils.company.getCompany.invalidate();
    router.push(`/jobs/${job.id}`);
  };

  const err = form.formState.errors;
  const busy = createJob.isPending || upsertConfig.isPending;

  return (
    <PageShell>
      <RequireRecruiter>
        {() => (
          <Card className="max-w-2xl mx-auto p-8">
            <h1 className="text-xl font-semibold tracking-tight mb-6">New job opening</h1>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input id="title" placeholder="Senior Backend Engineer" {...form.register("title")} />
                  <FieldError errors={[err.title]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <textarea
                    id="description"
                    className={textareaClass}
                    placeholder="Responsibilities, stack, what you're looking for…"
                    {...form.register("description")}
                  />
                  <FieldError errors={[err.description]} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="minExperienceYears">Min experience (yrs)</FieldLabel>
                    <Input
                      id="minExperienceYears"
                      type="number"
                      min={0}
                      {...form.register("minExperienceYears", { valueAsNumber: true })}
                    />
                    <FieldError errors={[err.minExperienceYears]} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="maxExperienceYears">Max experience (optional)</FieldLabel>
                    <Input
                      id="maxExperienceYears"
                      type="number"
                      min={0}
                      {...form.register("maxExperienceYears", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                      })}
                    />
                    <FieldError errors={[err.maxExperienceYears]} />
                  </Field>
                </div>

                <h2 className="text-sm font-semibold pt-4 border-t border-slate-200 dark:border-zinc-800">
                  Interview configuration
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel>Track</FieldLabel>
                    <Controller
                      control={form.control}
                      name="interviewMode"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TECHNICAL">Technical</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="questionCount">Questions</FieldLabel>
                    <Input
                      id="questionCount"
                      type="number"
                      min={1}
                      max={20}
                      {...form.register("questionCount", { valueAsNumber: true })}
                    />
                    <FieldError errors={[err.questionCount]} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="durationMinutes">Duration (min)</FieldLabel>
                    <Input
                      id="durationMinutes"
                      type="number"
                      min={5}
                      max={120}
                      {...form.register("durationMinutes", { valueAsNumber: true })}
                    />
                    <FieldError errors={[err.durationMinutes]} />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="prompt">Extra instructions for the AI (optional)</FieldLabel>
                  <textarea
                    id="prompt"
                    className={textareaClass}
                    placeholder="Focus on distributed systems and on-call experience…"
                    {...form.register("prompt")}
                  />
                </Field>

                {(createJob.error || upsertConfig.error) && (
                  <p className="text-xs text-rose-500">
                    {createJob.error?.message ?? upsertConfig.error?.message}
                  </p>
                )}
                <Button type="submit" disabled={busy} className="rounded-full">
                  {busy ? "Creating…" : "Create job"}
                </Button>
              </FieldGroup>
            </form>
          </Card>
        )}
      </RequireRecruiter>
    </PageShell>
  );
}
