import { useAtom } from "jotai";
import { motion } from "motion/react";
import { Navbar } from "@/components/home/navbar";
import { userAtom } from "@/jotai/atoms";
import { SparklesIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useNavigate } from "react-router";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmark,
  BsFileEarmarkText,
} from "react-icons/bs";
import evalImg from "@/assets/ai-ans.png";
import confiImg from "@/assets/confi.png";
import creditImg from "@/assets/credit.png";
import historyImg from "@/assets/history.png";
import hrImg from "@/assets/HR.png";
import img1Img from "@/assets/img1.png";
import mmImg from "@/assets/MM.png";
import pdfImg from "@/assets/pdf.png";
import resumeImg from "@/assets/resume.png";
import techImg from "@/assets/tech.png";
import { Footer } from "@/components/home/footer";

export default function HomePage() {
  const [user, setUser] = useAtom(userAtom);
  const steps = [
    {
      icon: <BsRobot size={24} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      description:
        "Select your target job role and years of experience - AI will customize the interview accordingly",
    },
    {
      icon: <BsMic size={24} />,
      step: "STEP 2",
      title: "Real-Time Voice Interview",
      description:
        "AI asks questions based on your selected role and listens to your answers in real-time",
    },
    {
      icon: <BsClock size={24} />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      description:
        "AI gives you time limits to answer each question to simulate real interview conditions",
    },
  ];

  const capabilities = [
    {
      image: evalImg,
      icon: <BsBarChart size={20} />,
      title: "AI Answer Evaluation",
      desc: "Scores communication, technical accuracy and confidence",
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Resume Based Interview",
      desc: "AI will ask questions based on your resume",
    },
    {
      image: pdfImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Downloadable PDF Report of Interview",
      desc: "Get a detailed PDF report of your interview",
    },
    {
      image: historyImg,
      icon: <BsBarChart size={20} />,
      title: "Interview History",
      desc: "Scores communication, technical accuracy and confidence",
    },
  ];

  const interviewModes = [
    {
      image: hrImg,
      title: "HR Interview Mode",
      desc: "Behavioral AI interview based on your resume",
    },
    {
      image: techImg,
      title: "Technical AI Interview Mode",
      desc: "Technical AI interview based on your resume",
    },
    {
      image: confiImg,
      title: "Confidence Detection",
      desc: "Detects your confidence level and provides feedback",
    },
    {
      image: creditImg,
      title: "Credit System",
      desc: "Unlock premium interview sessions easily",
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />
      <div className="flex-1 px-6 py-20 max-w-6xl mx-auto">
        <div className="flex justify-center mb-6 ">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-gray-100 text-gray-900 text-sm px-4 py-2 rounded-full flex items-center gap-2"
          >
            <SparklesIcon
              size={18}
              className="bg-gray-100 text-gray-900 rounded-full p-0.5"
            />{" "}
            Get ready for your next AI interview!
          </motion.div>
        </div>
        <div className="text-center mb-20 ">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto mt-6"
          >
            AI-Powered Interview Practice
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto"
          >
            Enhance your interview skills with realistic AI conversations and
            get instant feedback to land your dream job.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {user ? (
              <motion.button
                whileHover={{ opacity: 0.9, scale: 1.05 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                onClick={() => navigate("/interview")}
                className="px-8 py-4 bg-black text-white rounded-full hover:opacity-90 transition shadow-lg cursor-pointer"
              >
                Start Interview
              </motion.button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ opacity: 0.9, scale: 1.05 }}
                    whileTap={{ opacity: 1, scale: 0.98 }}
                    className="px-8 py-4 bg-black text-white rounded-full hover:opacity-90 transition shadow-lg cursor-pointer"
                  >
                    Start Interview
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <AuthDialog />
                </DialogContent>
              </Dialog>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-semibold border border-gray-200 bg-gray-50 cursor-pointer"
            >
              View History
            </motion.button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
          {steps.map((item, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className={`relative bg-white rounded-3xl border-2 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300 
                ${index === 0 ? "rotate-[-4deg] shadow-xl" : ""} 
                ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""} 
                ${index === 2 ? "rotate-[4deg] shadow-xl" : ""}`}
              >
                <div className="space-y-2">
                  <div className="bg-gray-100 p-1 rounded-2xl w-fit">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      {item.step}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-4xl font-semibold mb-16"
          >
            Advance AI-Powered Interview Platform
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10">
            {capabilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3">
                    <div className="w-full h-40 bg-gray-100 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <div className="bg-gray-100 p-2 m-5 rounded-full w-fit">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-4xl font-semibold mb-16"
          >
            Advance AI-Powered Interview Platform
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10">
            {interviewModes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3">
                    <div className="w-full h-40 bg-gray-100 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
