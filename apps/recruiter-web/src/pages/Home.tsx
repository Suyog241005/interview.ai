import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { StepsCards } from "@/components/home/steps-cards";
import { CapabilitiesCards } from "@/components/home/capabilities-cards";
import { InterviewModes } from "@/components/home/interview-modes";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />
      <div className="flex-1 px-6 py-20 max-w-6xl mx-auto">
        <Hero />
        <StepsCards />
        <CapabilitiesCards />
        <InterviewModes />
      </div>
      <Footer />
    </div>
  );
}
