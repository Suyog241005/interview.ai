import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuitIcon, SparklesIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { userAtom } from "@/jotai/atoms";
import { useAtom } from "jotai";

export default function AuthPage() {
  const [_user, setUser] = useAtom(userAtom);
  const handleGoogleAuth = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth`,
        {
          name: data.user.displayName,
          email: data.user.email,
          photoUrl: data.user.photoURL,
        },
        { withCredentials: true },
      );
      if (response.status === 200) {
        const userData = response.data.user;
        setUser(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f3f3f3] px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1.05, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200">
          <CardHeader className="flex items-center justify-center gap-3 mb-6">
            <CardTitle className="text-4xl font-bold flex items-center justify-center gap-2">
              <span className="bg-black text-white p-2 rounded-lg">
                <BrainCircuitIcon />
              </span>
              <h2 className="font-semibold text-lg">Interview.AI</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
              Continue with{" "}
              <span className=" bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
                <SparklesIcon size={16} />
                AI Smart Interview
              </span>
            </div>
            <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8">
              Sign in to start AI-powered mock interviews, track progress and
              unlock detailed performance insights
            </p>
            <motion.button
              whileHover={{ scale: 1.02, opacity: 0.9 }}
              whileTap={{ scale: 0.98, opacity: 1 }}
              className="w-full rounded-full flex items-center justify-center gap-3 bg-black text-white py-3 shadow-md"
              onClick={handleGoogleAuth}
            >
              <FcGoogle size={20} />
              Continue with Google
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
