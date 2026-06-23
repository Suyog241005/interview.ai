import {
  type Interview,
  type InterviewSession,
  type Question,
} from "@interview.ai/types";
import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import maleVideo from "@/assets/Videos/male-ai.mp4";
import femaleVideo from "@/assets/Videos/female-ai.mp4";
import { Button } from "../ui/button";
import { speak } from "@/lib/speech-synthesis";
import {
  BriefcaseIcon,
  HelpCircleIcon,
  Mic2Icon,
  PlayIcon,
  ShieldAlertIcon,
} from "lucide-react";
import axios from "axios";
import { userAtom } from "@/jotai/atoms";
import { useAtom } from "jotai";

export const Step2Interview = ({
  interviewData,
  onComplete,
}: {
  interviewData: InterviewSession;
  onComplete: (report: any) => void;
}) => {
  const [user] = useAtom(userAtom);
  console.log(user);
  const { id, questions } = interviewData;
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const response = async () => {
      const interviewId = id;
      const userId = user.id;
      const interview = (
        await axios.get(
          `${import.meta.env.VITE_API_URL}/interview/get-interview/${interviewId}/${userId}`,
          {
            withCredentials: true,
          },
        )
      ).data;
      setInterview(interview);
      setTimeout(() => {
        console.log(interview);
      }, 5000);
    };
    response();
  }, []);

  // let utterance = new SpeechSynthesisUtterance(
  //   "Can you tell me about yourself and your background in software development?",
  // );
  // speechSynthesis.speak(utterance);

  // useEffect(() => {
  //   speak(
  //     "Can you tell me about yourself and your background in software development?",
  //   );
  // }, []);

  //Mount -> Load voice -> Intro Speak ->  Question Speak -> Mic On -> Timer running -> Submit -> Feedback Speak -> Next question
  // -> Repeat until all questions are answered -> Show report

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-7xl min-h-[80vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col lg:flex-row">
        {/* video section */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
          <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-xl">
            <video
              src={femaleVideo}
              className="w-full h-auto object-cover"
              autoPlay={interviewStarted}
              muted
            />
          </div>

          {/* subtitle area */}

          {/* timer area */}
          {interviewStarted ? (
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 ">Interview Status</span>
                <span className="text-sm text-emerald-600 font-semibold">
                  AI Speaking
                </span>
              </div>
              <div className="flex justify-center pt-6 border-t border-gray-200">
                <CountdownCircleTimer
                  isPlaying={interviewStarted}
                  duration={
                    interviewStarted
                      ? questions[currentQIndex].timeLimitSeconds
                      : null
                  }
                  colors={["#2563eb", "#eab308", "#dc2626"]} // Tailwind colors: Blue -> Yellow -> Red
                  colorsTime={[10, 3, 0]} // Transitions colors based on time remaining
                  size={100}
                  strokeWidth={8}
                  trailColor="#e2e8f0" // Matches shadcn's muted/border slate tracks
                >
                  {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center mt-4 border-t border-gray-200 py-3">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold"> 1</span>
                  <span className="text-xs"> Question</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold"> 5 </span>
                  <span className="text-xs"> Total Questions</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Mic2Icon className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Audio Check
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  Microphone connected
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Text Section */}

        {interviewStarted ? (
          <div className=" flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
            <h2 className=" text-xl sm:text-2xl font-bold text-gray-700 mb-8">
              AI Smart Interview
            </h2>
            <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className=" text-xs sm:text-sm text-gray-500">
                Question {currentQIndex + 1} of {questions.length}
              </p>
              <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                {questions[currentQIndex].questionText}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-6 sm:p-8 md:p-10 justify-between bg-white">
            <div className="space-y-8">
              {/* Heading Container */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  AI Smart Interview Lobby
                </h1>
                <p className="text-sm text-slate-400 mt-2">
                  Review your session rules below before initiating the AI
                  assessment coordinator.
                </p>
              </div>

              {/* Dynamic Information Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <BriefcaseIcon className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">
                      Target Track Profile
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {interview?.role ? interview.role : "Full Stack"}
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-200 rounded text-slate-700 mt-1.5">
                      {interview?.interviewMode
                        ? interview.interviewMode
                        : "TECHNICAL"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <HelpCircleIcon className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">
                      Interview Breakdown
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {questions.length} Questions
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance / Instructions Section */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex gap-3 text-amber-900">
                <ShieldAlertIcon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Important Environment Rules
                  </h5>
                  <ul className="text-xs text-amber-700/90 list-disc pl-4 space-y-1 font-medium">
                    <li>
                      Ensure you are in a quiet room with stable browser
                      microphonic access.
                    </li>
                    <li>
                      Do not leave, minimize, or reload this application window
                      tab once active.
                    </li>
                    <li>
                      The automated scoring metrics initialize immediately upon
                      pressing start.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Call to Action Trigger Button Block */}
            <div className="pt-8 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => setInterviewStarted(true)}
                className="w-full sm:w-auto px-4 py-6 rounded-xl bg-gray-800 text-white font-bold shadow-lg gap-2 text-base cursor-pointer"
              >
                <PlayIcon className="h-5 w-5 fill-white " />
                Start My AI Interview
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
