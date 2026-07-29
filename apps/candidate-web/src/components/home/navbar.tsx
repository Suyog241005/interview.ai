import { useNavigate, useLocation } from "react-router";
import { CircleDollarSignIcon, HistoryIcon, LogOutIcon } from "lucide-react";
import { Button } from "@interview.ai/ui/button";
import { Avatar, AvatarBadge, AvatarImage } from "@interview.ai/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@interview.ai/ui/dropdown-menu";
import { signOut } from "@interview.ai/better-auth/client";
import { useSession } from "@interview.ai/better-auth/client";
import { trpc } from "@interview.ai/api/client";
import { ThemeToggle } from "../theme-toggle";

export const Navbar = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const { data: candidate } = trpc.candidate.getCandidate.useQuery(undefined, {
    enabled: !!user,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors">
      {/* Vercel Mesh Gradient Top Hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="p-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 group-hover:border-slate-300 dark:group-hover:border-zinc-700 transition-colors">
            <img
              src="/icon.png"
              alt="Interview.AI Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <h2 className="font-semibold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white font-sans">
            Interview<span className="text-slate-400 dark:text-zinc-500 font-mono text-xs ml-0.5">.ai</span>
          </h2>
        </div>

        {/* Middle Navigation Links (MPA Router Links) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-zinc-900/60 p-1 rounded-full border border-slate-200/80 dark:border-zinc-800/80">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3 py-1 text-xs font-sans rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold shadow-xs"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Credits Badge */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 px-3 py-1.5 rounded-full text-xs font-mono tracking-tight hover:border-slate-300 dark:hover:border-zinc-700 cursor-pointer transition-all text-slate-800 dark:text-zinc-200">
                  <CircleDollarSignIcon size={14} className="text-amber-500 dark:text-amber-400" />
                  <span>Credits: {candidate?.credits ?? 0}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 mt-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-200 rounded-lg shadow-xl">
                <div className="flex flex-col items-center gap-3 p-4 text-center">
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Need additional practice credits to continue AI assessments?
                  </p>
                  <Button
                    className="w-full bg-[#171717] dark:bg-white text-white dark:text-black font-medium text-xs rounded-full hover:bg-black dark:hover:bg-zinc-200"
                    onClick={() => navigate("/pricing")}
                  >
                    Get More Credits
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Profile / Login Action */}
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 animate-pulse shrink-0" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 cursor-pointer w-8 h-8"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User Profile"}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarBadge className="bg-emerald-500" />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-200 rounded-lg shadow-xl">
                <div className="px-3 py-2.5 border-b border-slate-200 dark:border-zinc-800/80">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate font-mono">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem
                    onClick={() => navigate("/history")}
                    className="cursor-pointer text-xs font-medium text-slate-700 dark:text-zinc-300 focus:bg-slate-100 dark:focus:bg-zinc-900 focus:text-slate-900 dark:focus:text-white rounded-md flex items-center gap-2"
                  >
                    <HistoryIcon size={14} />
                    <span>Interview History</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-zinc-800" />
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-xs font-medium text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/40 focus:text-rose-700 dark:focus:text-rose-300 rounded-md flex items-center gap-2"
                  >
                    <LogOutIcon size={14} />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="px-4 py-1.5 rounded-full bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 text-xs font-medium tracking-tight cursor-pointer transition-all shadow-sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
