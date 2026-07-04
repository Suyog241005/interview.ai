import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BrainCircuitIcon, SparklesIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAtom } from "jotai";
import { userAtom } from "@/jotai/atoms";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useLogin } from "@interview.ai/query";

export const AuthDialog = () => {
  const [_user, setUser] = useAtom(userAtom);
  const handleGoogleAuth = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const { mutateAsync } = useLogin();

      if (data && data.user && data.user.displayName && data.user.email) {
        await mutateAsync(
          {
            name: data.user.displayName,
            email: data.user.email,
            photoUrl: data.user.photoURL || '',
          },
          {
            onSuccess: ({ data }) => {
              setUser(data?.user);
            },
            onError: () => {
              alert("Something went wrong");
            },
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full max-w-md">
      <Card className="w-full max-w-md p-8 rounded-3xl">
        <CardHeader className="flex items-center justify-center gap-3 mb-6">
          <CardTitle className="text-4xl font-bold flex items-center justify-center gap-2">
            <span className="bg-black text-white p-2 rounded-lg">
              <BrainCircuitIcon />
            </span>
            <h2 className="font-semibold text-lg">Interview.AI</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-xl font-semibold text-center leading-snug mb-4">
            Continue with{" "}
            <span className=" px-3 py-1 rounded-full inline-flex items-center gap-2">
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
    </div>
  );
};
