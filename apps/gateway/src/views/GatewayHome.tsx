"use client";

import { GatewayNavbar } from "@/components/gateway/navbar";
import { GatewayHero } from "@/components/gateway/hero";
import { PortalShowcase } from "@/components/gateway/portal-showcase";
import { PlatformMetrics } from "@/components/gateway/platform-metrics";
import { GatewayFaq } from "@/components/gateway/faq-section";
import { GatewayFooter } from "@/components/gateway/footer";

export default function GatewayHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans selection:bg-zinc-800 selection:text-white transition-colors">
      <GatewayNavbar />
      <main className="flex-1 w-full">
        <GatewayHero />
        <PortalShowcase />
        <PlatformMetrics />
        <GatewayFaq />
      </main>
      <GatewayFooter />
    </div>
  );
}
