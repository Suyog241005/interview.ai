"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useSession } from "@interview.ai/better-auth/client";
import { trpc, type RouterOutputs } from "@interview.ai/api/client";
import { Navbar } from "./navbar";

export type Company = RouterOutputs["company"]["getCompany"]["company"];

export const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>
  </div>
);

export const Spinner = () => (
  <div className="flex items-center justify-center py-24 text-slate-400">
    <Loader2Icon className="animate-spin" size={20} />
  </div>
);

/** Redirects to /auth without a session, to /onboarding without a recruiter profile. */
export const RequireRecruiter = ({
  children,
}: {
  children: (company: Company) => React.ReactNode;
}) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const company = trpc.company.getCompany.useQuery(undefined, {
    enabled: !!session?.user,
    retry: false,
  });

  const noProfile = company.error?.data?.code === "FORBIDDEN";

  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/auth");
    else if (noProfile) router.replace("/onboarding");
  }, [isPending, session?.user, noProfile, router]);

  if (company.data) return <>{children(company.data.company)}</>;
  if (company.error && !noProfile) {
    return <p className="text-sm text-rose-500 py-10">{company.error.message}</p>;
  }
  return <Spinner />;
};
