import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@interview.ai/ui/card";
import { SparklesIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import { signIn } from "@interview.ai/better-auth/client";

export default function AuthPage() {
  const handleGoogleAuth = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (error) {
      console.error("Google authentication error:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-black px-6 py-20 relative overflow-hidden font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      {/* Vercel Atmospheric Mesh Gradient Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#007cf0]/20 via-[#7928ca]/20 to-[#ff0080]/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 dark:opacity-30 pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="w-full max-w-md p-8 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
          {/* Vercel Mesh Gradient Top Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

          <CardHeader className="flex items-center justify-center gap-3 mb-6 p-0 pt-2">
            <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2.5">
              <div className="p-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <img
                  src="/icon.png"
                  alt="Interview.AI Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                Interview<span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">.ai</span>
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono tracking-tight text-[#007cf0] rounded-full mb-3">
                <SparklesIcon size={12} />
                <span>ai-assessment // authentication</span>
              </span>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
                Sign in to your candidate account.
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal mt-2 leading-relaxed font-sans">
                Access your personalized mock interviews, voice analysis, and historical performance insights.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full rounded-full flex items-center justify-center gap-3 bg-[#171717] dark:bg-white text-white dark:text-black py-3 px-4 font-medium text-xs tracking-tight hover:bg-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-md font-sans"
              onClick={handleGoogleAuth}
            >
              <FcGoogle size={18} />
              <span>Continue with Google</span>
            </motion.button>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800/80 text-center">
              <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-600 tracking-tight">
                Secure Authentication // Better-Auth
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
