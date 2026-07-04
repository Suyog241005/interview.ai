import { BsClock, BsMic, BsRobot } from "react-icons/bs";
import { motion } from "motion/react";

export const StepsCards = () => {
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

  return (
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
  );
};
