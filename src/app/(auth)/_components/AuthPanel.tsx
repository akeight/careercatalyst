"use client";

import { useState } from "react";

import { LoginForm } from "@/components/login-signup/LoginForm";

type AuthMode = "signin" | "signup";

const COPY: Record<
  AuthMode,
  { title: string; subtitle: string; toggle: string }
> = {
  signin: {
    title: "Welcome back",
    subtitle:
      "Sign in to keep your applications, follow-ups, and interview prep in one place.",
    toggle: "New here? Create an account",
  },
  signup: {
    title: "Create your account",
    subtitle:
      "Start tracking applications, deadlines, and interview prep in one focused workspace.",
    toggle: "Already have an account? Sign in",
  },
};

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const copy = COPY[mode];

  return (
    <div className="auth-panel w-full max-w-md">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-[13px] font-medium text-muted-foreground shadow-sm">
        <span className="size-1.5 rounded-full bg-primary" />
        Internship season, organized
      </div>
      <h1 className="mt-5 text-balance font-serif text-3xl font-light leading-[1.1] tracking-tight sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-pretty text-base leading-7 text-muted-foreground">
        {copy.subtitle}
      </p>
      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {copy.toggle}
      </button>
      <div className="mt-8">
        <LoginForm mode={mode} />
      </div>
    </div>
  );
}
