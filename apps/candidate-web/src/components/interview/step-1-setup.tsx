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

      // 1. Create Practice Interview
      const interviewResult = await createInterviewMutation.mutateAsync({
        role: values.role,
        interviewMode: values.interviewMode,
        experienceYears: expYears,
      });

      if (!interviewResult.practiceInterview) {
        alert("Failed to create interview session");
        return;
      }

      // 2. Generate Practice Questions with AI
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

  const array = [
    {
      icon: <User2Icon />,
      text: "Choose Role and Experience",
    },
    {
      icon: <MicIcon />,
      text: "Smart AI Voice Interview",
    },
    {
      icon: <ChartLineIcon />,
      text: "Get Instant Feedback",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center px-4 bg-[#F3F3F3]"
    >
      <div className="w-full max-w-6xl bg-white rounded-4xl shadow-2xl grid md:grid-cols-2 overflow-hidden border-2 border-gray-200">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-linear-to-br from-gray-50 to-gray-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your AI Interview
          </h2>
          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powerded by AI. Improve
            communication, technical skills, and confidence
          </p>

          <div className="space-y-5">
            {array.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 }}
                className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm"
              >
                <div className="p-2 bg-gray-200 rounded-lg">{item.icon}</div>
                <span className="text-gray-700 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Interview Setup
          </h2>

          <Card className=" space-y-6 p-6 border-2">
            <form
              id="setup-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldGroup>
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      {/* <FieldLabel htmlFor="setup-form-job-title">
                        Job Title
                      </FieldLabel> */}
                      <div className="flex items-center gap-2">
                        <User2Icon className="text-gray-400" />
                        <Input
                          {...field}
                          id="setup-form-job-title"
                          aria-invalid={fieldState.invalid}
                          placeholder="Job Title"
                          autoComplete="off"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="experience"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      {/* <FieldLabel htmlFor="setup-form-job-title">
                        Job Title
                      </FieldLabel> */}
                      <div className="flex items-center gap-2">
                        <BriefcaseBusinessIcon className="text-gray-400" />
                        <Input
                          {...field}
                          id="setup-form-experience"
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Experience"
                          autoComplete="off"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="interviewMode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      {/* <FieldLabel htmlFor="setup-form-job-title">
                        Job Title
                      </FieldLabel> */}
                      <div className="flex items-center gap-2">
                        <User2Icon className="text-gray-400" />
                        <Select
                          {...field}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-30">
                            <SelectValue placeholder="Select a mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="TECHNICAL">
                                Technical
                              </SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="resume"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      {/* <FieldLabel htmlFor="setup-form-job-title">
                        Job Title
                      </FieldLabel> */}
                      {isAnalyzingResume ? (
                        <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-700 text-sm font-medium">
                          <Loader2Icon className="animate-spin h-4 w-4 text-blue-600" />
                          <span>Uploading resume & analyzing with AI...</span>
                        </div>
                      ) : resumeFileField ? (
                        <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2.5 rounded-2xl w-full shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileTextIcon className="text-gray-600 shrink-0 h-5 w-5" />
                            <div className="flex flex-col min-w-0 text-left">
                              <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-[280px]">
                                {resumeFileField.name}
                              </span>
                              <span className="text-[11px] text-gray-600 font-medium">
                                {(resumeFileField.size / (1024 * 1024)).toFixed(
                                  2,
                                )}{" "}
                                MB
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setResumeFileField(null);
                              form.setValue("resume", undefined, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 rounded-full transition-all cursor-pointer"
                          >
                            <XIcon />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FileTextIcon className="text-gray-400" />
                          <Input
                            {...field}
                            id="setup-form-resume"
                            type="file"
                            aria-invalid={fieldState.invalid}
                            placeholder="Upload Resume"
                            accept=".pdf"
                            value={""}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              field.onChange(file);
                              setResumeFileField(file);
                              setIsAnalyzingResume(true);
                              try {
                                // 1. Upload Resume File to Cloudinary
                                let uploadedUrl = "";
                                try {
                                  uploadedUrl = await uploadToCloudinary(file);
                                } catch (err: any) {
                                  console.error("Cloudinary upload failed:", err);
                                  alert(
                                    err?.message ||
                                      "Failed to upload resume to Cloudinary. Please ensure VITE_CLOUDINARY_CLOUD_NAME is properly set in apps/candidate-web/.env",
                                  );
                                  setIsAnalyzingResume(false);
                                  return;
                                }

                                // 2. Save Resume Record in DB with Cloudinary URL
                                const { resume } =
                                  await createResumeMutation.mutateAsync({
                                    name: file.name,
                                    resumeUrl: uploadedUrl,
                                  });
                                // 3. Trigger AI Resume Analysis
                                const { resumeAnalysis } =
                                  await analyzeResumeMutation.mutateAsync({
                                    resumeId: resume.id,
                                  });
                                // 4. Auto-fill form fields with AI suggestions
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
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            <Field orientation="horizontal">
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 gap-2 cursor-pointer disabled:opacity-50"
                type="submit"
                form="setup-form"
                disabled={isAnalyzingResume}
              >
                <MicIcon />
                Start Interview
              </Button>
            </Field>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
