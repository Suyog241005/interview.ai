"use client";

import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { motion } from "motion/react";
import { MailIcon, MapPinIcon, MessageSquareIcon, SendIcon, CheckCircle2Icon } from "lucide-react";
import { Input } from "@interview.ai/ui/input";
import { Button } from "@interview.ai/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <Navbar />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-zinc-950 p-8 sm:p-12 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden text-center sm:text-left"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 mb-3 text-[11px] font-mono tracking-tight uppercase text-[#007cf0] rounded-full">
            <MailIcon className="h-3.5 w-3.5" />
            <span>contact // candidate-support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
            Get in touch with our engineering team.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-normal mt-2 max-w-xl font-sans">
            Have questions about AI interview scoring, speech recognition, custom enterprise loops, or practice credits? Send us a message.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs h-fit"
          >
            <div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-tight block">
                channels // direct
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
                Contact details.
              </h3>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shrink-0">
                  <MailIcon className="h-4 w-4 text-[#007cf0]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase block">EMAIL SUPPORT</span>
                  <a href="mailto:support@interview.ai" className="font-semibold text-slate-900 dark:text-white hover:underline font-mono">
                    support@interview.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shrink-0">
                  <MessageSquareIcon className="h-4 w-4 text-[#7928ca]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase block">LIVE CHAT & COMMUNITY</span>
                  <span className="font-normal text-slate-700 dark:text-zinc-300">
                    Discord Developer Hub
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shrink-0">
                  <MapPinIcon className="h-4 w-4 text-[#ff0080]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase block">HEADQUARTERS</span>
                  <span className="font-normal text-slate-700 dark:text-zinc-300">
                    San Francisco, California, USA
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-white dark:bg-zinc-950 p-8 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs"
          >
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight font-sans">
                  Message sent successfully!
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. An engineer from our support team will respond to your inquiry within 24 hours.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 rounded-full px-6 py-2.5 font-medium text-xs tracking-tight cursor-pointer"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono tracking-tight text-slate-600 dark:text-zinc-400 block uppercase">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-100/70 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs h-10 rounded-md"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono tracking-tight text-slate-600 dark:text-zinc-400 block uppercase">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-100/70 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs h-10 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-tight text-slate-600 dark:text-zinc-400 block uppercase">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="Feedback, Bug Report, or Enterprise Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-slate-100/70 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs h-10 rounded-md"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-tight text-slate-600 dark:text-zinc-400 block uppercase">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Write your message or inquiry here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-100/70 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs p-3 rounded-md focus:outline-none focus:border-slate-400 dark:focus:border-white transition-colors font-sans"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#171717] dark:bg-white text-white dark:text-black font-medium text-xs tracking-tight hover:bg-black dark:hover:bg-zinc-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <SendIcon size={14} />
                  <span>Send Message →</span>
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
