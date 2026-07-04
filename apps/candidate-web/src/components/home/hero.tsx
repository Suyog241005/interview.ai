import { SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { AuthDialog } from "../auth/auth-dialog";
import { userAtom } from "@/jotai/atoms";
import { useAtom } from "jotai";
export const Hero = () => {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  return (
    <>
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
          Enhance your interview skills with realistic AI conversations and get
          instant feedback to land your dream job.
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
    </>
  );
};
