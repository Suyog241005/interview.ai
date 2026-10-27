"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@interview.ai/ui/card";
import { SparklesIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import { signIn, signUp } from "@interview.ai/better-auth/client";
import { AuthDivider, EmailAuthForm } from "@interview.ai/ui/components/email-auth-form";

export const AuthDialog = () => {
  const handleGoogleAuth = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.href,
      });
    } catch (error) {
      console.error("Google authentication error:", error);
    }
  };

  return (
    <div className="w-full">
      <Card className="ring-0 w-full p-6 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white relative overflow-hidden shadow-xl">
        {/* Vercel Mesh Gradient Top Hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

        <CardHeader className="flex items-center justify-center gap-3 mb-4 p-0 pt-2">
          <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
            <div className="p-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <img
                src="/icon.png"
                alt="Interview.AI Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white font-sans">
              Interview<span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">.ai</span>
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono tracking-tight text-[#007cf0] rounded-full mb-2">
              <SparklesIcon size={12} />
              <span>authentication // required</span>
            </span>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
              Sign in to begin session.
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal mt-1.5 leading-relaxed font-sans">
              Sign in to initiate AI-powered mock interviews, track performance, and generate evaluation reports.
            </p>
          </div>

          <EmailAuthForm
            onSignIn={(v) => signIn.email(v)}
            onSignUp={(v) => signUp.email(v)}
          />

          <div className="my-5">
            <AuthDivider />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
              className="w-full h-11 rounded-full flex items-center justify-center gap-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-white px-4 font-medium text-sm tracking-tight hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all cursor-pointer font-sans"
            onClick={handleGoogleAuth}
          >
            <FcGoogle size={18} />
            <span>Continue with Google</span>
          </motion.button>
        </CardContent>
      </Card>
    </div>
  );
};
