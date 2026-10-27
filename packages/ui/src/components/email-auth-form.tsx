"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { Button } from "@interview.ai/ui/components/ui/button";
import { Input } from "@interview.ai/ui/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@interview.ai/ui/components/ui/field";

type Mode = "sign-in" | "sign-up";
/** Shape returned by Better Auth client calls (`signIn.email`, `signUp.email`). */
type AuthResult = { error?: { message?: string } | null };

export const MIN_PASSWORD_LENGTH = 8; // matches Better Auth's default minPasswordLength

const labelClass = "text-[11px] font-mono font-normal uppercase tracking-tight text-slate-600 dark:text-zinc-400";
const inputClass =
  "h-10 rounded-md border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-900 text-sm md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600";

/**
 * Email + password sign-in / sign-up. Auth-library agnostic: the app passes the Better Auth calls in.
 */
export function EmailAuthForm({
  onSignIn,
  onSignUp,
  onSuccess,
  defaultMode = "sign-in",
}: {
  onSignIn: (v: { email: string; password: string }) => Promise<AuthResult>;
  onSignUp: (v: { name: string; email: string; password: string }) => Promise<AuthResult>;
  onSuccess?: () => void;
  defaultMode?: Mode;
}) {
  const id = useId();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSignUp = mode === "sign-up";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = isSignUp
        ? await onSignUp({ name: name.trim(), email: email.trim(), password })
        : await onSignIn({ email: email.trim(), password });
      if (res.error) {
        setError(res.error.message || "Something went wrong. Please try again.");
        return;
      }
      onSuccess?.();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const switchMode = () => {
    setMode(isSignUp ? "sign-in" : "sign-up");
    setError(null);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 text-left">
      <FieldGroup className="gap-4">
        {isSignUp && (
          <Field>
            <FieldLabel htmlFor={`${id}-name`} className={labelClass}>
              Full name
            </FieldLabel>
            <Input
              id={`${id}-name`}
              autoComplete="name"
              required
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor={`${id}-email`} className={labelClass}>
            Email
          </FieldLabel>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-password`} className={labelClass}>
            Password
          </FieldLabel>
          <div className="relative">
            <Input
              id={`${id}-password`}
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              minLength={isSignUp ? MIN_PASSWORD_LENGTH : undefined}
              placeholder={isSignUp ? `At least ${MIN_PASSWORD_LENGTH} characters` : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 outline-none focus-visible:ring-3 focus-visible:ring-slate-400/30 cursor-pointer"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
        </Field>
      </FieldGroup>

      {error && (
        <p role="alert" className="text-xs font-mono text-rose-500">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-11 w-full rounded-full bg-[#171717] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-zinc-200 text-sm font-medium cursor-pointer"
      >
        {pending && <Loader2Icon data-icon="inline-start" className="animate-spin" />}
        {isSignUp ? "Create account" : "Sign in"}
      </Button>

      <p className="text-center text-xs text-slate-600 dark:text-zinc-400">
        {isSignUp ? "Already have an account?" : "New to Interview.AI?"}{" "}
        <button
          type="button"
          onClick={switchMode}
          className="font-medium text-[#007cf0] hover:underline underline-offset-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#007cf0]/40 cursor-pointer"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </button>
      </p>
    </form>
  );
}

/** "or" separator between the email form and social buttons. */
export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-tight text-slate-400 dark:text-zinc-600">
      <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
      or
      <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
    </div>
  );
}

/**
 * Reads `?next=` and returns it only if it is a same-site path, otherwise `fallback`.
 * Blocks open redirects such as `?next=https://evil.example` or `?next=//evil.example`.
 */
export function safeNextPath(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
