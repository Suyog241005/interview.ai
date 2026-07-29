import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { motion } from "motion/react";
import { ScaleIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-12">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-zinc-950 p-8 sm:p-10 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden"
        >
          {/* Vercel Mesh Gradient Top Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 mb-3 text-[11px] font-mono tracking-tight uppercase text-[#007cf0] rounded-full">
            <ScaleIcon className="h-3.5 w-3.5" />
            <span>terms // legal-agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Terms & Conditions.
          </h1>

          <p className="text-xs font-mono text-slate-500 dark:text-zinc-500 mt-2">
            Last Updated: July 28, 2026 // Version 2.0
          </p>
        </motion.div>

        {/* Content Body Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-zinc-950 p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-8 font-sans text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed"
        >
          {/* Section 1 */}
          <div className="space-y-2 border-b border-slate-200 dark:border-zinc-800 pb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2Icon size={16} className="text-[#007cf0]" />
              <span>1. Acceptance of Terms</span>
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-normal">
              By accessing or using the Interview.AI candidate portal, web application, or associated service endpoints, you agree to be bound by these Terms & Conditions. If you do not agree to all terms, you may not access or use the platform.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2 border-b border-slate-200 dark:border-zinc-800 pb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ScaleIcon size={16} className="text-[#7928ca]" />
              <span>2. Practice Credits & Account Usage</span>
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-normal">
              Interview practice sessions, speech recognition evaluation, and PDF report generation consume candidate credits:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-zinc-400 font-normal">
              <li>Credits are non-transferable between accounts.</li>
              <li>You are responsible for maintaining the confidentiality of your Google account sign-in credentials.</li>
              <li>Automated bot interactions or abusive scraping of AI questions are strictly prohibited.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2 border-b border-slate-200 dark:border-zinc-800 pb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircleIcon size={16} className="text-amber-500" />
              <span>3. AI Evaluation Disclaimer</span>
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-normal">
              Interview.AI provides AI-driven practice simulations and diagnostic recommendations for educational and interview preparation purposes only:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-zinc-400 font-normal">
              <li>AI diagnostic scores (correctness, confidence, communication) do not guarantee employment or interview offers from actual employers.</li>
              <li>Question difficulty and prompts are calibrated dynamically based on role input and resume data.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              4. Termination & Modifications
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 font-normal">
              We reserve the right to suspend or terminate accounts that violate our usage policies or attempt to exploit backend service APIs.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
