"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { CatalystWordmark } from "@/app/(site)/_components/CatalystWordmark";
import { SectionLabel } from "@/app/(site)/_components/SectionLabel";

export function OnboardingShell({
  title,
  subtitle,
  children,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "site-theme-light relative isolate min-h-dvh w-full overflow-x-clip bg-background text-foreground",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.28] [background-image:linear-gradient(to_right,color-mix(in_srgb,#292d34_14%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,#292d34_14%,transparent)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)]"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to site
        </Link>
        <Link href="/" className="inline-flex items-center gap-2">
          <CatalystWordmark className="h-5" />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-2xl">
          <SectionLabel label="Onboarding" index="01 / 01" />
          <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
