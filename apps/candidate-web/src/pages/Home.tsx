"use client";

import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { StepsCards } from "@/components/home/steps-cards";
import { CapabilitiesCards } from "@/components/home/capabilities-cards";
import { InterviewModes } from "@/components/home/interview-modes";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Hero />
        <StepsCards />
        <CapabilitiesCards />
        <InterviewModes />
      </main>
      <Footer />
    </div>
  );
}
