"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Building2Icon, LogOutIcon } from "lucide-react";
import { Button } from "@interview.ai/ui/button";
import { Avatar, AvatarBadge, AvatarImage } from "@interview.ai/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@interview.ai/ui/dropdown-menu";
import { signOut, useSession } from "@interview.ai/better-auth/client";
import { trpc } from "@interview.ai/api/client";
import { ThemeToggle } from "./theme-toggle";

const CompanyChip = () => {
  const { data } = trpc.company.getCompany.useQuery(undefined, { retry: false });
  if (!data) return null;
  return (
    <span className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 px-3 py-1.5 rounded-full text-xs font-mono tracking-tight text-slate-800 dark:text-zinc-200">
      <Building2Icon size={14} className="text-[#007cf0]" />
      <span>{data.company.name}</span>
    </span>
  );
};

export const Navbar = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Interviews", path: "/interviews" },
    { label: "Team", path: "/team" },
    { label: "New Job", path: "/jobs/new" },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="h-[2px] w-full bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff0080]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
          <div className="p-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 group-hover:border-slate-300 dark:group-hover:border-zinc-700 transition-colors">
            <img src="/icon.png" alt="Interview.AI Logo" className="w-6 h-6 object-contain" />
          </div>
          <h2 className="font-semibold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white font-sans">
            Interview
            <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs ml-0.5">.ai</span>
            <span className="ml-2 text-[10px] font-mono text-[#007cf0] uppercase tracking-wider">recruiter</span>
          </h2>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-zinc-900/60 p-1 rounded-full border border-slate-200/80 dark:border-zinc-800/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-1 text-xs font-sans rounded-full transition-all cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          {user && <CompanyChip />}

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
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate font-mono">{user.email}</p>
                </div>
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
              onClick={() => router.push("/auth")}
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
