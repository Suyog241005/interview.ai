import {
  BriefcaseBusinessIcon,
  ChartLineIcon,
  FileTextIcon,
  MicIcon,
  User2Icon,
  XIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Field, FieldError, FieldGroup } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import axios from "axios";
import type { ResumeAnalysis } from "@interview.ai/types";
import { useState } from "react";

const formSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
  experience: z.string(),
  mode: z.enum(["Technical", "HR"], {
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
  onStart: (data: FormType) => void;
}) => {
  const [resumeFileField, setResumeFileField] = useState<File | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(
    null,
  );
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      experience: "",
      mode: "Technical",
      resume: undefined,
    },
  });

  const onSubmit = async (values: FormType) => {
    try {
      console.log(values, resumeAnalysis);
      const questions = await axios.post(
        `${import.meta.env.VITE_API_URL}/interview/questions`,
        { values, resumeAnalysis },
        { withCredentials: true },
      );

      console.log(questions.data);
    } catch (error) {
      console.log(error);
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
                  name="jobTitle"
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
                  name="mode"
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
                              <SelectItem value="Technical">
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
                      {resumeFileField ? (
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
                              if (file) {
                                field.onChange(file);
                              }
                              const formData = new FormData();
                              formData.append("resume", file);
                              setResumeFileField(file);
                              const response = await axios.post(
                                `${import.meta.env.VITE_API_URL}/resume/analyze`,
                                formData,
                                {
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                  withCredentials: true,
                                },
                              );
                              const data: ResumeAnalysis = response.data;
                              console.log(data);
                              const jobTitle = data.suggestedRoles[0];
                              const experience = data.experience;
                              form.setValue("jobTitle", jobTitle, {
                                shouldDirty: true,
                              });
                              form.setValue("experience", experience, {
                                shouldDirty: true,
                              });
                              setResumeAnalysis(data);
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
                className="w-full bg-black text-white hover:bg-gray-800 gap-2 cursor-pointer"
                type="submit"
                form="setup-form"
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
