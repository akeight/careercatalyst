export const dynamic = "force-dynamic";

import { ArrowRight, GalleryVerticalEnd, Sparkles } from "lucide-react";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/login-signup/LoginForm";

export default async function LoginPage() {
  try {
    const session = await auth();

    if (session?.user) {
      if (!session.user.onboarded) {
        redirect("/onboarding");
      }

      redirect("/dashboard");
    }
  } catch (error) {
    console.error("Failed to load session:", error);
    // optional: render a fallback or allow login
  }

  return (
    <div className="relative isolate flex min-h-[calc(100dvh-8rem)] w-full items-center overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,color-mix(in_srgb,#7b68ee_22%,transparent)_0%,transparent_34%),radial-gradient(circle_at_82%_78%,color-mix(in_srgb,#49ccf9_24%,transparent)_0%,transparent_32%),radial-gradient(circle_at_50%_100%,color-mix(in_srgb,#fd71af_18%,transparent)_0%,transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-border/60" />
      <div className="absolute inset-0 -z-10 opacity-[0.28] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)]" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Internship Tracker
          </Link>

          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="size-3.5 text-primary" />
              Built for students turning applications into momentum
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Your focused launchpad for every internship opportunity.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Track applications, manage recruiter relationships, set weekly
              goals, and build a profile that keeps your search moving.
            </p>
          </div>

          <div className="grid max-w-2xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {[
              "Personalized onboarding",
              "Weekly goal streaks",
              "Resume-ready profile",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border bg-background/60 p-3 shadow-sm backdrop-blur"
              >
                <ArrowRight className="size-3.5 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto w-full max-w-md lg:ml-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
