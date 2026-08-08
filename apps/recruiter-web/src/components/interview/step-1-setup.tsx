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
import { Card } from "@interview.ai/ui/card";
import { Input } from "@interview.ai/ui/input";
import { Field, FieldError, FieldGroup } from "@interview.ai/ui/field";
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

const formSchema = z.object({
  role: z.string().min(3, "Job title must be at least 3 characters"),
  experience: z.string(),
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

          <Card className="bg-transparent border-0 p-0 shadow-none space-y-5">
            <form
              id="setup-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FieldGroup className="space-y-4">
                {/* Role Input */}
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono tracking-tight text-slate-600 dark:text-zinc-400 block uppercase">
                          Target job role *
                        </label>
                        <div className="flex items-center gap-2 bg-slate-100/70 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus-within:border-slate-400 dark:focus-within:border-white transition-colors px-3 py-1 rounded-md">
                          <User2Icon className="text-slate-400 dark:text-zinc-500 shrink-0" size={16} />
                          <Input
                            {...field}
                            id="setup-form-job-title"
                            aria-invalid={fieldState.invalid}
                            placeholder="e.g. Senior Frontend Engineer"
                            autoComplete="off"
                            className="bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-xs focus:ring-0 rounded-none focus:outline-none w-full"
                          />
                        </div>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1 font-mono" />
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
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono tracking-tight text-[#1c69d4] dark:text-[#007cf0] block uppercase font-semibold">
                          Years of experience *
                        </label>
                        <div className="flex items-center gap-2 bg-slate-100/70 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus-within:border-slate-400 dark:focus-within:border-white transition-colors px-3 py-1 rounded-md">
                          <BriefcaseBusinessIcon className="text-slate-400 dark:text-zinc-500 shrink-0" size={16} />
                          <Input
                            {...field}
                            id="setup-form-experience"
                            type="text"
                            aria-invalid={fieldState.invalid}
                            placeholder="e.g. 4"
                            autoComplete="off"
                            className="bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-xs focus:ring-0 rounded-none focus:outline-none w-full"
                          />
                        </div>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1 font-mono" />
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
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono tracking-tight text-slate-600 dark:text-zinc-400 block uppercase">
                          Interview modality *
                        </label>
                        <Select
                          {...field}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full bg-slate-100/70 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-md text-xs font-mono tracking-tight h-10">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-md">
                            <SelectGroup>
                              <SelectItem value="TECHNICAL" className="text-xs font-mono uppercase focus:bg-slate-100 dark:focus:bg-zinc-900 focus:text-slate-900 dark:focus:text-white rounded-md">
                                Technical Interview
                              </SelectItem>
                              <SelectItem value="HR" className="text-xs font-mono uppercase focus:bg-slate-100 dark:focus:bg-zinc-900 focus:text-slate-900 dark:focus:text-white rounded-md">
                                HR / Behavioral
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1 font-mono" />
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
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono tracking-tight text-slate-600 dark:text-zinc-400 block uppercase">
                          Resume PDF (Optional context)
                        </label>

                        {isAnalyzingResume ? (
                          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-zinc-900 border border-blue-200 dark:border-[#007cf0] rounded-md text-slate-800 dark:text-zinc-200 text-xs font-mono">
                            <Loader2Icon className="animate-spin h-4 w-4 text-[#007cf0] shrink-0" />
                            <span>Uploading & analyzing PDF with AI...</span>
                          </div>
                        ) : resumeFileField ? (
                          <div className="flex items-center justify-between gap-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-4 py-2.5 rounded-md w-full">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileTextIcon className="text-[#007cf0] shrink-0 h-4 w-4" />
                              <div className="flex flex-col min-w-0 font-mono text-left">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                                  {resumeFileField.name}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-zinc-500">
                                  {(resumeFileField.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setResumeFileField(null);
                                form.setValue("resume", undefined, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                              className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full h-6 w-6 p-0 cursor-pointer"
                            >
                              <XIcon size={14} />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-slate-100/70 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus-within:border-slate-400 dark:focus-within:border-white transition-colors px-3 py-1 rounded-md">
                            <FileTextIcon className="text-slate-400 dark:text-zinc-500 shrink-0" size={16} />
                            <Input
                              {...field}
                              id="setup-form-resume"
                              type="file"
                              aria-invalid={fieldState.invalid}
                              accept=".pdf"
                              value={""}
                              className="bg-transparent border-0 text-slate-900 dark:text-white text-xs focus:ring-0 rounded-none focus:outline-none w-full file:bg-slate-200 dark:file:bg-zinc-800 file:text-slate-900 dark:file:text-white file:border-0 file:text-xs file:font-mono file:px-2 file:py-1 file:mr-2 file:rounded-md cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                field.onChange(file);
                                setResumeFileField(file);
                                setIsAnalyzingResume(true);
                                try {
                                  let uploadedUrl = "";
                                  try {
                                    uploadedUrl = await uploadToCloudinary(file);
                                  } catch (err: any) {
                                    console.error("Cloudinary upload failed:", err);
                                    alert(
                                      err?.message ||
                                        "Failed to upload resume to Cloudinary.",
                                    );
                                    setIsAnalyzingResume(false);
                                    return;
                                  }

                                  const { resume } =
                                    await createResumeMutation.mutateAsync({
                                      name: file.name,
                                      resumeUrl: uploadedUrl,
                                    });

                                  const { resumeAnalysis } =
                                    await analyzeResumeMutation.mutateAsync({
                                      resumeId: resume.id,
                                    });

                                  if (resumeAnalysis) {
                                    const suggestedRole =
                                      resumeAnalysis.suggestedRoles?.[0] || "";
                                    const expYears = String(
                                      resumeAnalysis.experienceyears || "",
                                    );
                                    form.setValue("role", suggestedRole, {
                                      shouldDirty: true,
                                    });
                                    form.setValue("experience", expYears, {
                                      shouldDirty: true,
                                    });
                                    setResumeAnalysis(resumeAnalysis as any);
                                  }
                                } catch (error) {
                                  console.error("Resume analysis error:", error);
                                } finally {
                                  setIsAnalyzingResume(false);
                                }
                              }}
                            />
                          </div>
                        )}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1 font-mono" />
                        )}
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>

            <div className="pt-2">
              <Button
                className="w-full bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 font-medium text-xs tracking-tight py-3.5 rounded-full cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md font-sans"
                type="submit"
                form="setup-form"
                disabled={isAnalyzingResume}
              >
                <MicIcon size={16} />
                <span>Generate Questions & Start →</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
