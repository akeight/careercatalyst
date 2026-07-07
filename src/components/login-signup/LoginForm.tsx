"use client";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, hoverTap, staggerContainer } from "@/lib/motion";
import { Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";

type ProviderId = "google" | "github" | "linkedin";

const isDevAuthEnabled = process.env.NODE_ENV !== "production";

type AuthMode = "signin" | "signup";

const providers: Array<{
  id: ProviderId;
  name: string;
  description: string;
  icon: React.ReactNode;
  variant: "default" | "outline";
}> = [
  {
    id: "google",
    name: "Google",
    description: "Best for school or personal accounts",
    icon: <GoogleIcon />,
    variant: "default",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Use your developer profile",
    icon: <GitHubIcon />,
    variant: "outline",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Connect with your professional identity",
    icon: <LinkedInIcon />,
    variant: "outline",
  },
];

export function LoginForm({
  className,
  mode = "signin",
  ...props
}: React.ComponentProps<"div"> & { mode?: AuthMode }) {
  const reduceMotion = useReducedMotion();
  const [pendingProvider, setPendingProvider] = useState<ProviderId | null>(
    null,
  );
  const [devPending, setDevPending] = useState(false);
  const [devEmail, setDevEmail] = useState("dev@example.com");
  const [devPassword, setDevPassword] = useState("password");
  const [resetOnboarding, setResetOnboarding] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configuredProviders, setConfiguredProviders] =
    useState<Set<string> | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/providers")
      .then((response) => response.json())
      .then((data: Record<string, unknown>) => {
        if (mounted) {
          setConfiguredProviders(new Set(Object.keys(data)));
        }
      })
      .catch(() => {
        if (mounted) {
          setConfiguredProviders(new Set());
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleProviderSignIn = async (provider: ProviderId) => {
    setError(null);
    setPendingProvider(provider);

    try {
      await signIn(provider, { redirectTo: "/dashboard" });
    } catch {
      setPendingProvider(null);
      setError(
        "That provider is not configured yet. Check your auth env vars.",
      );
    }
  };

  const handleDevSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setDevPending(true);
    const callbackUrl = resetOnboarding ? "/onboarding?force=1" : "/dashboard";

    const result = await signIn("dev-credentials", {
      email: devEmail,
      password: devPassword,
      resetOnboarding: resetOnboarding ? "true" : "false",
      redirect: false,
      redirectTo: callbackUrl,
    });

    setDevPending(false);

    if (result?.error) {
      setError("Dev sign-in failed. Check the email and password.");
      return;
    }

    window.location.assign(result?.url ?? callbackUrl);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <motion.div
        className="flex flex-col gap-6"
        variants={reduceMotion ? undefined : staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={reduceMotion ? undefined : fadeInUp}>
          <Card className="overflow-hidden border-border/70 text-left shadow-xl shadow-primary/5">
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {providers.map((provider) => (
                  <motion.div
                    key={provider.id}
                    {...(reduceMotion ? {} : hoverTap)}
                  >
                    <Button
                      onClick={() => handleProviderSignIn(provider.id)}
                      variant={provider.variant}
                      type="button"
                      disabled={
                        Boolean(pendingProvider) ||
                        devPending ||
                        configuredProviders?.has(provider.id) === false
                      }
                      className="h-auto w-full justify-start gap-3 px-4 py-3 text-left"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground">
                        {provider.icon}
                      </span>
                      <span className="grid gap-0.5">
                        <span className="font-medium">
                          {mode === "signup"
                            ? "Sign up with "
                            : "Continue with "}
                          {provider.name}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            provider.variant === "default"
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {configuredProviders?.has(provider.id) === false
                            ? "Add provider env vars to enable locally"
                            : provider.description}
                        </span>
                      </span>
                      {pendingProvider === provider.id && (
                        <Loader2 className="ml-auto size-4 animate-spin" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {isDevAuthEnabled && (
                <form
                  onSubmit={handleDevSignIn}
                  className="mt-6 rounded-2xl border border-dashed bg-muted/40 p-4"
                >
                  <div className="mb-4">
                    <p className="text-sm font-medium">Local dev account</p>
                    <p className="text-xs text-muted-foreground">
                      Use this to refine onboarding without OAuth setup.
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="dev-email">Email</Label>
                      <Input
                        id="dev-email"
                        type="email"
                        value={devEmail}
                        onChange={(event) => setDevEmail(event.target.value)}
                        autoComplete="email"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dev-password">Password</Label>
                      <Input
                        id="dev-password"
                        type="password"
                        value={devPassword}
                        onChange={(event) => setDevPassword(event.target.value)}
                        autoComplete="current-password"
                      />
                    </div>
                    <label className="flex items-start gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={resetOnboarding}
                        onChange={(event) =>
                          setResetOnboarding(event.target.checked)
                        }
                        className="mt-0.5"
                      />
                      Reset onboarding for this account after sign-in
                    </label>
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={devPending || Boolean(pendingProvider)}
                      className="w-full"
                    >
                      {devPending && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      Continue with dev account
                    </Button>
                  </div>
                </form>
              )}

              {error && (
                <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.93 10.93 0 0 1 12 6.09c.98 0 1.96.13 2.88.39 2.19-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.1 20.45H3.53V9H7.1v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.23 0z"
      />
    </svg>
  );
}
