"use client";

import { useActionState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui";

type AuthState = { error?: string; success?: string } | undefined;

export function AuthForm({
  mode,
  action
}: {
  mode: "login" | "signup";
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "signup" ? (
        <label className="block space-y-2 text-sm font-bold text-zinc-300">
          <span className="inline-flex items-center gap-2"><User className="h-4 w-4 text-ember" />Name</span>
          <input name="fullName" placeholder="Alex Carter" autoComplete="name" />
        </label>
      ) : null}
      <label className="block space-y-2 text-sm font-bold text-zinc-300">
        <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-ember" />Email</span>
        <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </label>
      <label className="block space-y-2 text-sm font-bold text-zinc-300">
        <span className="inline-flex items-center gap-2"><Lock className="h-4 w-4 text-ember" />Password</span>
        <input name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required />
      </label>
      {state?.error ? <p className="rounded-md border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{state.error}</p> : null}
      <Button disabled={pending} className="w-full">{pending ? "Working..." : mode === "login" ? "Log in" : "Create account"}</Button>
    </form>
  );
}
