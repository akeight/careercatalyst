import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionLabel } from "./SectionLabel";
import { CatalystWordmark } from "./CatalystWordmark";

export function FinalCTA() {
  return (
    <>
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center shadow-sm sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_75%)]"
            />
            <div className="mx-auto max-w-md">
              <SectionLabel
                label="Get started"
                index="06 / 06"
                align="center"
              />
            </div>
            <h2 className="mx-auto mt-6 max-w-2xl text-balance text-center font-serif text-3xl font-light leading-[1.12] tracking-tight text-foreground sm:text-4xl">
              Your internship search deserves a system.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Stop rebuilding your tracker every season. Keep everything in one
              place.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Start tracking
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <CatalystWordmark />
          <p className="text-[13px] text-muted-foreground">
            © {new Date().getFullYear()} Catalyst · Built for internship season
          </p>
          <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#resources"
              className="transition-colors hover:text-foreground"
            >
              Resources
            </a>
            <Link
              href="/login"
              className="transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
