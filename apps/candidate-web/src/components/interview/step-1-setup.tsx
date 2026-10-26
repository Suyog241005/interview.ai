"use client";

import {
  BriefcaseBusinessIcon,
  ChartLineIcon,
  FileTextIcon,
  Loader2Icon,
  MicIcon,
  User2Icon,
  XIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@interview.ai/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@interview.ai/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@interview.ai/ui/select";
import { Button } from "@interview.ai/ui/button";
import { useState } from "react";
import type { PracticeInterviewWithQuestion } from "@interview.ai/api/client";
import type { ResumeAnalysis } from "@interview.ai/types";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { trpc } from "@interview.ai/api/client";
import { cn } from "@/lib/utils";

// One control style for every field: same height, border, focus ring and invalid state.
const labelClass =
  "text-[11px] font-mono font-normal uppercase tracking-tight text-slate-600 dark:text-zinc-400 group-data-[invalid=true]/field:text-rose-500";
const shellClass =
  "flex h-11 w-full items-center gap-2.5 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-900 px-3 transition-colors focus-within:border-slate-400 dark:focus-within:border-zinc-500 focus-within:ring-3 focus-within:ring-slate-400/20 group-data-[invalid=true]/field:border-rose-400 group-data-[invalid=true]/field:focus-within:border-rose-400 group-data-[invalid=true]/field:focus-within:ring-rose-400/20";
const shellIconClass = "size-4 shrink-0 text-slate-400 dark:text-zinc-500";
const shellInputClass =
  "h-full flex-1 rounded-none border-0 bg-transparent dark:bg-transparent px-0 text-sm md:text-sm text-slate-900 dark:text-white shadow-none placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus-visible:ring-0 aria-invalid:ring-0";
const errorClass = "text-xs font-mono text-rose-500";

const formSchema = z.object({
  role: z.string().min(3, "Job title must be at least 3 characters"),
  experience: z
    .string()
    .trim()
    .regex(/^\d{1,2}$/, "Enter your years of experience as a whole number"),
  interviewMode: z.enum(["TECHNICAL", "HR"], {
    error: "Mode must be Technical or HR",
  }),
  resume: z
    .any()
    .refine((file) => file instanceof File, "Please upload your resume.")
    .refine(
      (file) => file?.size <= 1024 * 1024 * 5,
      "The PDF must be under 5MB.",
    )
    .refine(
      (file) => file?.type === "application/pdf",
      "Only PDF documents are supported.",
    )
    .optional(),
});
export type FormType = z.infer<typeof formSchema>;

export const Step1Setup = ({
  onStart,
}: {
  onStart: (data: PracticeInterviewWithQuestion) => void;
}) => {
  const [resumeFileField, setResumeFileField] = useState<File | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(
    null,
  );
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);

  const createInterviewMutation =
    trpc.practice.createPracticeInterview.useMutation();
  const createQuestionsMutation =
    trpc.practice.createPracticeInterviewQuestions.useMutation();
  const createResumeMutation = trpc.resume.createResume.useMutation();
  const analyzeResumeMutation = trpc.resume.analyzeResume.useMutation();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      experience: "",
      interviewMode: "TECHNICAL",
      resume: undefined,
    },
  });

  const onSubmit = async (values: FormType) => {
    try {
      const expYears = parseInt(values.experience, 10) || 0;

      const interviewResult = await createInterviewMutation.mutateAsync({
        role: values.role,
        interviewMode: values.interviewMode,
        experienceYears: expYears,
      });

      if (!interviewResult.practiceInterview) {
        alert("Failed to create interview session");
        return;
      }

      const questionsResult = await createQuestionsMutation.mutateAsync({
        practiceinterviewId: interviewResult.practiceInterview.id,
        resumeAnalysis,
        values: {
          role: values.role,
          interviewMode: values.interviewMode,
          experienceYears: expYears,
        },
      });

      if (questionsResult.practiceInterviewWithQuestions) {
        onStart(questionsResult.practiceInterviewWithQuestions);
      }
    } catch (error: any) {
      console.error(error);
      alert(
        `Something went wrong: ${error.message || "Failed to start interview"}`,
      );
    }
  };

  const handleResumeFile = async (file: File) => {
    setResumeFileField(file);
    setIsAnalyzingResume(true);
    try {
      let uploadedUrl = "";
      try {
        uploadedUrl = await uploadToCloudinary(file);
      } catch (err: any) {
        console.error("Cloudinary upload failed:", err);
        alert(err?.message || "Failed to upload resume to Cloudinary.");
        setIsAnalyzingResume(false);
        return;
      }

      const { resume } = await createResumeMutation.mutateAsync({
        name: file.name,
        resumeUrl: uploadedUrl,
      });

      const { resumeAnalysis } = await analyzeResumeMutation.mutateAsync({
        resumeId: resume.id,
      });

      if (resumeAnalysis) {
        const suggestedRole = resumeAnalysis.suggestedRoles?.[0] || "";
        const years = Number(resumeAnalysis.experienceyears);
        const expYears = Number.isFinite(years) && years > 0 ? String(Math.round(years)) : "";
        form.setValue("role", suggestedRole, { shouldDirty: true, shouldValidate: true });
        form.setValue("experience", expYears, { shouldDirty: true, shouldValidate: true });
        setResumeAnalysis(resumeAnalysis as any);
      }
    } catch (error) {
      console.error("Resume analysis error:", error);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  // Prevents a second click from creating a duplicate interview while questions generate
  const isGenerating =
    createInterviewMutation.isPending || createQuestionsMutation.isPending;

  const featureSteps = [
    {
      icon: <User2Icon size={16} className="text-slate-800 dark:text-white" />,
      title: "Role & experience parameters",
      subtitle: "Calibrates model difficulty and scenario depth",
    },
    {
      icon: <MicIcon size={16} className="text-slate-800 dark:text-white" />,
      title: "Speech recognition cockpit",
      subtitle: "Real-time AI voice listening and transcript evaluation",
    },
    {
      icon: <ChartLineIcon size={16} className="text-slate-800 dark:text-white" />,
      title: "Diagnostic metric report",
      subtitle: "Comprehensive score breakdown and improvement tips",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-slate-50 dark:bg-black font-sans selection:bg-zinc-800 selection:text-white transition-colors"
    >
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl grid md:grid-cols-2 overflow-hidden relative">
        {/* Vercel Mesh Gradient Top Hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080] z-20" />

        {/* Left Informational Sidebar */}
        <motion.div
          initial={{ x: -32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-slate-100/70 dark:bg-zinc-900/60 p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-zinc-800/80"
        >
          <div>
            <span className="text-[11px] font-mono tracking-tight text-[#007cf0] uppercase block mb-2 font-semibold">
              setup // step_01
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
              Initiate practice session.
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal mt-3 leading-relaxed font-sans">
              Configure target job position, seniority years, and optional resume document to launch speech-driven AI interview simulation.
            </p>

            <div className="space-y-4 mt-8">
              {featureSteps.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 p-4 rounded-md shadow-xs"
                >
                  <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight block font-sans">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal block">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500 tracking-tight">
            <span>engine // better-auth + trpc</span>
            <span>status // ready</span>
          </div>
        </motion.div>

        {/* Right Configuration Form */}
        <motion.div
          initial={{ x: 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-12 bg-white dark:bg-zinc-950 flex flex-col justify-center"
        >
          <div className="mb-6">
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-tight block">
              parameters // config
            </span>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
              Interview specifications.
            </h3>
          </div>

          <form
            id="setup-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FieldGroup>
              {/* Role Input */}
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="setup-form-job-title" className={labelClass}>
                      Target job role *
                    </FieldLabel>
                    <div className={shellClass}>
                      <User2Icon className={shellIconClass} size={16} aria-hidden />
                      <Input
                        {...field}
                        id="setup-form-job-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. Senior Frontend Engineer"
                        autoComplete="off"
                        className={shellInputClass}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className={errorClass} />
                    )}
                  </Field>
                )}
              />

              {/* Experience Years */}
              <Controller
                name="experience"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="setup-form-experience" className={labelClass}>
                      Years of experience *
                    </FieldLabel>
                    <div className={shellClass}>
                      <BriefcaseBusinessIcon className={shellIconClass} size={16} aria-hidden />
                      <Input
                        {...field}
                        id="setup-form-experience"
                        type="text"
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. 4"
                        autoComplete="off"
                        className={shellInputClass}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className={errorClass} />
                    )}
                  </Field>
                )}
              />

              {/* Interview Mode Selector */}
              <Controller
                name="interviewMode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="setup-form-mode" className={labelClass}>
                      Interview modality *
                    </FieldLabel>
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="setup-form-mode"
                        ref={field.ref}
                        onBlur={field.onBlur}
                        aria-invalid={fieldState.invalid}
                        className="w-full h-11 data-[size=default]:h-11 rounded-md border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-900 dark:hover:bg-zinc-900 px-3 text-sm text-slate-900 dark:text-white focus-visible:border-slate-400 focus-visible:ring-slate-400/20 dark:focus-visible:border-zinc-500"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <MicIcon className={shellIconClass} aria-hidden />
                          <SelectValue placeholder="Select mode" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-md">
                        <SelectGroup>
                          <SelectItem value="TECHNICAL" className="text-sm">
                            Technical Interview
                          </SelectItem>
                          <SelectItem value="HR" className="text-sm">
                            HR / Behavioral
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className={errorClass} />
                    )}
                  </Field>
                )}
              />

              {/* Resume Upload / PDF Parser */}
              <Controller
                name="resume"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="setup-form-resume" className={labelClass}>
                      Resume PDF (Optional context)
                    </FieldLabel>

                    {isAnalyzingResume ? (
                      <div role="status" className={cn(shellClass, "border-blue-200 dark:border-[#007cf0] bg-blue-50 dark:bg-zinc-900")}>
                        <Loader2Icon className="animate-spin size-4 text-[#007cf0] shrink-0" aria-hidden />
                        <span className="text-sm text-slate-800 dark:text-zinc-200 truncate">
                          Uploading & analyzing PDF with AI...
                        </span>
                      </div>
                    ) : resumeFileField ? (
                      <div className={cn(shellClass, "justify-between")}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileTextIcon className="text-[#007cf0] shrink-0 size-4" aria-hidden />
                          <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {resumeFileField.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-zinc-500 shrink-0">
                            {(resumeFileField.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Remove resume"
                          onClick={() => {
                            setResumeFileField(null);
                            setResumeAnalysis(null);
                            form.setValue("resume", undefined, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-full cursor-pointer"
                        >
                          <XIcon />
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="setup-form-resume" className={cn(shellClass, "cursor-pointer")}>
                        <FileTextIcon className={shellIconClass} size={16} aria-hidden />
                        <span className="flex-1 truncate text-sm text-slate-400 dark:text-zinc-500">
                          Upload a PDF to auto-fill role and experience
                        </span>
                        <span className="shrink-0 rounded-md bg-slate-200 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-slate-900 dark:text-white">
                          Browse
                        </span>
                        <input
                          ref={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          id="setup-form-resume"
                          type="file"
                          accept="application/pdf,.pdf"
                          aria-invalid={fieldState.invalid}
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (!file) return;
                            field.onChange(file);
                            handleResumeFile(file);
                          }}
                        />
                      </label>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className={errorClass} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              size="lg"
              disabled={isAnalyzingResume || isGenerating}
              className="w-full h-11 rounded-full bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 text-sm font-medium tracking-tight cursor-pointer shadow-md"
            >
              {isGenerating ? (
                <Loader2Icon data-icon="inline-start" className="animate-spin" />
              ) : (
                <MicIcon data-icon="inline-start" />
              )}
              <span>{isGenerating ? "Generating questions..." : "Generate Questions & Start →"}</span>
            </Button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};
