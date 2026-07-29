import { useNavigate } from "react-router";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-zinc-900 text-slate-600 dark:text-zinc-400 font-sans transition-colors">
      {/* Vercel Top Hairline Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-200 dark:border-zinc-900">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="p-1 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <img
                  src="/icon.png"
                  alt="Interview.AI Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white font-sans">
                Interview<span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">.ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-normal leading-relaxed font-sans">
              AI-powered mock interview assessment platform designed to elevate technical depth, voice delivery, and professional confidence.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3 font-mono">
            <span className="text-[11px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight block">
              PLATFORM
            </span>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-sans">
              <li>
                <button onClick={() => navigate("/")} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/interview")} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  AI Practice Cockpit
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/history")} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Assessment History
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3 font-mono">
            <span className="text-[11px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight block">
              COMPANY
            </span>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-sans">
              <li>
                <button onClick={() => navigate("/about")} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3 font-mono">
            <span className="text-[11px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight block">
              LEGAL & PRIVACY
            </span>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-sans">
              <li>
                <button onClick={() => navigate("/privacy")} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/terms")} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 dark:text-zinc-600">
          <span>© {new Date().getFullYear()} Interview.AI // Multi-Page App Architecture</span>
          <span>Engineered with React + Better-Auth + tRPC</span>
        </div>
      </div>
    </footer>
  );
};
