import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardMockup } from "./DashboardMockup";

export function HeroSection() {
  return (
    <section
      className="hero-zone relative isolate"
      style={
        {
          "--hero-ink": "#292d34",
          "--hero-ink-muted": "#5b6172",
        } as React.CSSProperties
      }
    >
      {/* Stage: normal flow by default; JS promotes it to a pinned, sticky,
          full-height stage on desktop (see .hero-zone.is-pinned in globals). */}
      <div className="hero-stage relative flex flex-col overflow-hidden">
        {/* Faint light grid, reads on the light phase via the hero ink var. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.3] [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--hero-ink)_16%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--hero-ink)_16%,transparent)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_0%,transparent_72%)]"
        />

        <div className="hero-copy-block relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 pt-16 text-center sm:px-6 sm:pt-54 lg:px-8">
          <span
            className="hero-badge inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-medium"
            style={{
              color: "var(--hero-ink-muted)",
              borderColor:
                "color-mix(in srgb, var(--hero-ink) 22%, transparent)",
            }}
          >
            <span className="size-1 rounded-full bg-primary" />
            Built for internship season
          </span>

          <h1
            className="hero-title mx-auto mt-6 max-w-6xl text-balance font-serif text-3xl font-light leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: "var(--hero-ink)" }}
          >
            Track every application. <br />
            Follow up on time. <br />
            Walk into your interviews prepared.
          </h1>

          <p
            className="hero-copy mx-auto mt-5 max-w-xl text-pretty text-base leading-7 sm:text-lg"
            style={{ color: "var(--hero-ink-muted)" }}
          >
            Catalyst is built for tech majors and the extreme pipeline. <br />{" "}
            Keep your applications, deadlines, notes, documents, and interview
            prep in one focused workspace.
          </p>

          <div className="hero-cta mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Start tracking
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#demo"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border px-6 text-sm font-medium transition-colors sm:w-auto"
              style={{
                color: "var(--hero-ink)",
                borderColor:
                  "color-mix(in srgb, var(--hero-ink) 24%, transparent)",
              }}
            >
              View demo
            </a>
          </div>
        </div>

        {/* Light product visual. `.hero-scene` is the parallax target: while
            pinned it rises up and over the copy toward center screen. */}
        <div
          id="demo"
          className="hero-scene relative z-20 mx-auto mt-10 w-full max-w-5xl px-4 pb-64 sm:px-6 lg:px-8"
        >
          <div className="hero-visual relative">
            <DashboardMockup />
          </div>
        </div>

        {/* Dark stage: a full-stage dark surface + a dark dashboard aligned to
            the light one. JS reveals it bottom-to-top with a clip-path wipe once
            the dashboard reaches center screen. Hidden unless pinned. */}
        <div
          aria-hidden
          className="hero-dark-stage pointer-events-none absolute inset-0 z-30"
        >
          <div className="absolute inset-0 bg-[#191b20]" />
          <div className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_78%)]" />
          <div className="hero-scene-dark mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="site-theme-dark">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
