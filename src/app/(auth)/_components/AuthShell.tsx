"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { createScope, createTimeline, type Scope } from "animejs";

import { cn } from "@/lib/utils/utils";
import { CatalystWordmark } from "@/app/(site)/_components/CatalystWordmark";

export function AuthShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    scope.current = createScope({ root: rootRef }).add(() => {
      const tl = createTimeline({
        defaults: { ease: "outQuad", duration: 520 },
      });
      tl.add(".auth-eyebrow", { opacity: [0, 1], translateY: [10, 0] })
        .add(".auth-title", { opacity: [0, 1], translateY: [12, 0] }, "-=360")
        .add(
          ".auth-subtitle",
          { opacity: [0, 1], translateY: [10, 0] },
          "-=380",
        )
        .add(".auth-form", { opacity: [0, 1], translateY: [12, 0] }, "-=340");
    });

    return () => scope.current?.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "site-theme-light relative isolate flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground",
        className,
      )}
    >
      {/* Subtle editorial grid (matches marketing page language). */}
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

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
        {children}
      </main>
    </div>
  );
}
