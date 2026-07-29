"use client";

import { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import femaleVideo from "@/assets/Videos/female-ai.mp4";
import { Button } from "@interview.ai/ui/button";
import { speak } from "@/lib/speech-synthesis";
import {
  BriefcaseIcon,
  HelpCircleIcon,
  Mic2Icon,
  PlayIcon,
  ShieldAlertIcon,
  Volume2Icon,
} from "lucide-react";
import {
  trpc,
  type PracticeInterviewWithQuestion,
} from "@interview.ai/api/client";

declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    SpeechRecognition: unknown;
  }
}

const LiveInterviewContent = ({
  interviewData,
  onComplete,
}: {
  interviewData: PracticeInterviewWithQuestion;
  onComplete: (report: PracticeInterviewWithQuestion) => void;
}) => {
  const { id, questions } = interviewData;
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(
    questions[currentQIndex].timeLimitSeconds,
  );
  const [interviewStarted, setInterviewStarted] = useState(false);
  const recognitionRef = useRef<unknown>(null);
  const transcriptRef = useRef("");
  const [liveTranscript, setLiveTranscript] = useState("");

  const { data: fetchedInterviewData } =
    trpc.practice.getPracticeInterview.useQuery({ id });
  const interview = fetchedInterviewData?.practiceInterview ?? null;

  const startInterviewMutation =
    trpc.practice.startPracticeInterview.useMutation();
  const submitAnswerMutation = trpc.practice.submitAnswer.useMutation();
  const generateReportMutation =
    trpc.practice.generatePracticeInterviewReport.useMutation();

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser");
      return;
    }

    if (recognitionRef.current) {
      try {
        (recognitionRef.current as { abort: () => void }).abort();
      } catch (e) {
        console.error("Failed to abort previous recognition:", e);
      }
    }

    const recognition = new (SpeechRecognition as any)();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    transcriptRef.current = "";
    setLiveTranscript("");

    recognition.onresult = (event: any) => {
      let finalTranscript = " ";

      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }

      transcriptRef.current = finalTranscript;
      setLiveTranscript(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        return;
      }
      console.warn("Speech recognition event:", event.error);
    };

    recognition.start();

    recognitionRef.current = recognition;
  };

  const stopRecognition = () => {
    const recognition = recognitionRef.current as { stop: () => void } | null;

    if (recognition) {
      recognition.stop();
    }

    return transcriptRef.current;
  };

  const submitAnswer = async ({
    transcript,
    questionId,
  }: {
    transcript: string;
    questionId: string;
  }) => {
    try {
      await submitAnswerMutation.mutateAsync({
        interviewId: id,
        questionId,
        userAnswer: transcript,
      });
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const handleNextQuestion = async () => {
    try {
      const question = questions[currentQIndex];
      const transcript = stopRecognition();

      await submitAnswer({
        transcript,
        questionId: question.id,
      });

      if (currentQIndex < questions.length - 1) {
        const nextIndex = currentQIndex + 1;
        setCurrentQIndex(nextIndex);
        setTimeLeft(questions[nextIndex].timeLimitSeconds);
      } else {
        const result = await generateReportMutation.mutateAsync({
          practiceinterviewId: id,
        });

        if (result?.practiceInterview) {
          onComplete(result.practiceInterview as any);
        }
      }
    } catch (error) {
      console.error("Failed to process answer:", error);
    }
  };

  useEffect(() => {
    if (interviewStarted) {
      setTimeout(() => {
        speak(questions[currentQIndex].questionText || "", () => {
          startRecognition();
        });
      }, 1000);
    }
  }, [currentQIndex, interviewStarted, questions]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          (recognitionRef.current as { abort: () => void }).abort();
        } catch (_err) {
          // ignore cleanup error
        }
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <div className="w-full max-w-7xl min-h-[85vh] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl flex flex-col lg:flex-row overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080] z-20" />

        <div className="w-full lg:w-[35%] bg-slate-100/70 dark:bg-zinc-900/60 p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-zinc-800/80">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <span className="text-[11px] font-mono tracking-tight text-[#007cf0] font-semibold">
                cockpit // stream
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                online
              </span>
            </div>

            <div className="w-full max-w-xs bg-slate-900 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-md overflow-hidden shadow-xl relative group">
              <video
                src={femaleVideo}
                className="w-full h-auto object-cover opacity-90"
                autoPlay={interviewStarted}
                muted
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 border border-zinc-800 text-[10px] font-mono text-zinc-300 rounded-sm">
                ai-interviewer // active
              </div>
            </div>
          </div>

          {interviewStarted ? (
            <div className="w-full max-w-xs bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-5 rounded-md mt-6 shadow-xs">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase">status</span>
                <span className="text-xs font-mono text-[#007cf0] font-semibold flex items-center gap-1">
                  <Volume2Icon size={12} className="animate-pulse" />
                  audio active
                </span>
              </div>

              <div className="flex justify-center py-4">
                <CountdownCircleTimer
                  key={currentQIndex}
                  isPlaying={interviewStarted}
                  duration={timeLeft}
                  colors={["#007cf0", "#f5a623", "#ee0000"]}
                  colorsTime={[10, 3, 0]}
                  size={110}
                  strokeWidth={6}
                  trailColor="#e2e8f0"
                  onComplete={() => {
                    handleNextQuestion();
                    return { shouldRepeat: false };
                  }}
                >
                  {({ remainingTime }) => (
                    <div className="text-center font-mono">
                      <span className="text-2xl font-semibold text-slate-900 dark:text-white block tracking-tight font-sans">{remainingTime}</span>
                      <span className="text-[9px] text-slate-500 dark:text-zinc-500 uppercase tracking-tight block">sec</span>
                    </div>
                  )}
                </CountdownCircleTimer>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mt-4 border-t border-slate-200 dark:border-zinc-800 pt-3 font-mono">
                <div>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white block tracking-tight font-sans">{currentQIndex + 1}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase">question</span>
                </div>
                <div>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white block tracking-tight font-sans">{questions.length}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase">total</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-xs bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 rounded-md flex items-center gap-3 mt-6 shadow-xs">
              <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-md">
                <Mic2Icon className="h-4 w-4 text-[#007cf0] animate-pulse" />
              </div>
              <div className="font-mono">
                <span className="block text-[10px] uppercase tracking-tight text-slate-500 dark:text-zinc-500">
                  hardware status
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Microphone online
                </span>
              </div>
            </div>
          )}
        </div>

        {interviewStarted ? (
          <div className="flex-1 flex flex-col p-6 sm:p-10 justify-between bg-white dark:bg-zinc-950 relative">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-tight text-[#007cf0] uppercase font-semibold block">
                    interview session // in-progress
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
                    Question {currentQIndex + 1} of {questions.length}
                  </h2>
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-300 rounded-full">
                  {questions[currentQIndex].difficulty || "MEDIUM"}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 p-6 rounded-lg mb-6 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-500 block mb-2">prompt</span>
                <h3 className="text-base sm:text-xl font-semibold text-slate-900 dark:text-white leading-relaxed font-sans tracking-tight">
                  {questions[currentQIndex].questionText}
                </h3>
              </div>

              <div className="bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 p-6 rounded-lg min-h-[140px]">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-500 block mb-2">live transcript // speech-recognition</span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 font-mono leading-relaxed italic">
                  {liveTranscript || "Listening for candidate response..."}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex justify-end mt-8">
              <Button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#171717] dark:bg-white text-white dark:text-black font-medium text-xs tracking-tight hover:bg-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 font-sans"
              >
                <span>{currentQIndex < questions.length - 1 ? "Submit & Next Question →" : "Submit & Generate Report →"}</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-6 sm:p-10 justify-between bg-white dark:bg-zinc-950">
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-mono tracking-tight text-[#007cf0] uppercase font-semibold block">
                  lobby // ready-state
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans mt-1">
                  AI Smart Interview Lobby.
                </h1>
                <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal mt-2 leading-relaxed">
                  Review session parameters and operational rules before initiating the AI assessment coordinator.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 font-mono shadow-xs">
                  <BriefcaseIcon className="h-5 w-5 text-slate-500 dark:text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight">
                      Target track profile
                    </h4>
                    <p className="text-xs text-slate-800 dark:text-zinc-300 mt-1 font-semibold font-sans">
                      {interview?.role ? interview.role : "SOFTWARE ENGINEER"}
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-300 mt-2 rounded-md">
                      {interview?.interviewMode ? interview.interviewMode : "TECHNICAL"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/60 font-mono shadow-xs">
                  <HelpCircleIcon className="h-5 w-5 text-slate-500 dark:text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight">
                      Interview breakdown
                    </h4>
                    <p className="text-xs text-slate-800 dark:text-zinc-300 mt-1 font-sans">
                      {questions.length} Generated Questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-amber-50/80 dark:bg-zinc-900/90 border border-amber-200 dark:border-zinc-800 font-mono space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-tight">
                  <ShieldAlertIcon size={16} />
                  <span>OPERATIONAL ENVIRONMENT RULES</span>
                </div>
                <ul className="text-xs text-amber-800/90 dark:text-zinc-400 list-disc pl-5 space-y-1 font-normal font-sans">
                  <li>Ensure a quiet environment with browser microphone access granted.</li>
                  <li>Do not reload or minimize the assessment window during active questions.</li>
                  <li>Automated scoring starts immediately upon clicking start.</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex justify-end mt-8">
              <Button
                onClick={async () => {
                  try {
                    setInterviewStarted(true);
                    await startInterviewMutation.mutateAsync({
                      practiceinterviewId: id,
                    });
                  } catch (error) {
                    setInterviewStarted(false);
                    console.error("Failed to start interview:", error);
                    alert("Failed to start interview");
                  }
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#171717] dark:bg-white text-white dark:text-black font-medium text-xs tracking-tight hover:bg-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2.5 font-sans"
              >
                <PlayIcon className="h-4 w-4 fill-current" />
                <span>Start AI Interview Cockpit →</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Step2Interview = (props: {
  interviewData: PracticeInterviewWithQuestion;
  onComplete: (report: PracticeInterviewWithQuestion) => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center">
        <span className="text-xs font-mono text-slate-500">Loading interview cockpit...</span>
      </div>
    );
  }

  return <LiveInterviewContent {...props} />;
};
