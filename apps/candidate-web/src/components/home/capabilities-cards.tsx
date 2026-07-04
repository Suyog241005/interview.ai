import { motion } from "motion/react";
import {
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import evalImg from "@/assets/ai-ans.png";
import historyImg from "@/assets/history.png";
import pdfImg from "@/assets/pdf.png";
import resumeImg from "@/assets/resume.png";

export const CapabilitiesCards = () => {
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
  return (
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
  );
};
