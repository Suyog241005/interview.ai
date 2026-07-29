"use client";

import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { motion } from "motion/react";
import { ShieldCheckIcon, LockIcon, FileTextIcon } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-zinc-950 p-8 sm:p-10 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 mb-3 text-[11px] font-mono tracking-tight uppercase text-[#007cf0] rounded-full">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            <span>privacy // data-governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Privacy Policy.
          </h1>
          <p className="text-xs font-mono text-slate-500 dark:text-zinc-500 mt-2">
            Last Updated: July 28, 2026 // Version 2.0
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-zinc-950 p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-8 font-sans text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed"
        >
          <div className="space-y-2 border-b border-slate-200 dark:border-zinc-800 pb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <LockIcon size={16} className="text-[#007cf0]" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-normal">
              When you use Interview.AI, we collect information necessary to provide and improve our mock interview services:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-zinc-400 font-normal">
              <li><strong>Account Profile:</strong> Name, email address, and profile image supplied via Google OAuth authentication.</li>
              <li><strong>Audio Transcripts:</strong> Real-time voice data processed via Web Speech Recognition API during active interview practice rounds.</li>
              <li><strong>Resume Content:</strong> PDF documents uploaded voluntarily to extract technical skills, job titles, and experience context.</li>
              <li><strong>Performance Metrics:</strong> System-generated diagnostic scores (correctness, confidence, communication) and interview history.</li>
            </ul>
          </div>

          <div className="space-y-2 border-b border-slate-200 dark:border-zinc-800 pb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileTextIcon size={16} className="text-[#7928ca]" />
              <span>2. How We Use Your Data</span>
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-normal">
              Your data is strictly used for the operational performance of the Interview.AI platform:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-zinc-400 font-normal">
              <li>To calibrate personalized technical and behavioral interview questions tailored to your background.</li>
              <li>To process audio transcripts and calculate real-time confidence scores and diagnostic reports.</li>
              <li>To store your practice history so you can monitor improvement trends over time.</li>
              <li>We <strong>do not sell</strong> your personal data, audio recordings, or resume contents to third-party advertisers or recruitment agencies.</li>
            </ul>
          </div>

          <div className="space-y-2 border-b border-slate-200 dark:border-zinc-800 pb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheckIcon size={16} className="text-emerald-500" />
              <span>3. Data Storage & Security</span>
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-normal">
              We employ enterprise-grade security protocols to protect your candidate data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-zinc-400 font-normal">
              <li>All API requests are encrypted in transit via SSL/TLS encryption.</li>
              <li>Resume uploads stored in cloud storage are secured using tokenized URL permissions.</li>
              <li>Authentication tokens and sessions are managed securely with Better-Auth session tokens.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              4. Contact Privacy Team
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-normal">
              If you have questions regarding data privacy or wish to request complete deletion of your interview history, contact our privacy team at <a href="mailto:privacy@interview.ai" className="text-[#007cf0] hover:underline font-mono">privacy@interview.ai</a>.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
