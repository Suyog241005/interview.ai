export const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-zinc-900 text-slate-600 dark:text-zinc-400 font-sans transition-colors">
      {/* Vercel Top Hairline Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5">
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

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-zinc-500 max-w-lg text-center md:text-left font-normal leading-relaxed font-sans">
            AI-powered mock interview assessment platform designed to elevate technical depth, voice delivery, and professional confidence.
          </p>

          {/* Copyright & System Version */}
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-600 block tracking-tight">
              © {new Date().getFullYear()} Interview.AI // Vercel Stack v2.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
