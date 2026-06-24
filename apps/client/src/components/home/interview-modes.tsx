import confiImg from "@/assets/confi.png";
import creditImg from "@/assets/credit.png";
import hrImg from "@/assets/HR.png";
import techImg from "@/assets/tech.png";
import { motion } from "motion/react";

export const InterviewModes = () => {
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
  );
};
