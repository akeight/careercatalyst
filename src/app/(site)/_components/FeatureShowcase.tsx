"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Bell,
  Building2,
  FileText,
  LayoutGrid,
  LineChart,
  NotebookPen,
} from "lucide-react";
import { onScroll } from "animejs";

import { cn } from "@/lib/utils/utils";
import ScrollReveal from "./bits/ScrollReveal";
import { SectionLabel } from "./SectionLabel";
import {
  DocumentsPanel,
  InsightsPanel,
  InterviewPanel,
  PipelinePanel,
  RemindersPanel,
  ResearchPanel,
} from "./panels/FeaturePanels";

type Step = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  copy: string;
  bullets: string[];
  Panel: ComponentType;
};

const STEPS: Step[] = [
  {
    icon: LayoutGrid,
    title: "Application pipeline",
    copy: "Move every role from saved to offer on one clear board.",
    bullets: [
      "Saved, applied, interview, offer",
      "Drag roles between stages",
      "See the whole search at a glance",
    ],
    Panel: PipelinePanel,
  },
  {
    icon: Bell,
    title: "Follow-up reminders",
    copy: "Set the next touchpoint and get nudged before it slips.",
    bullets: [
      "Schedule the next check-in",
      "Reminders before the window closes",
      "No thread ever goes cold",
    ],
    Panel: RemindersPanel,
  },
  {
    icon: Building2,
    title: "Company research hub",
    copy: "Keep notes, links, and contacts attached to each company.",
    bullets: [
      "Notes and links per company",
      "Referrals tied to the role",
      "Questions ready before you apply",
    ],
    Panel: ResearchPanel,
  },
  {
    icon: NotebookPen,
    title: "Interview prep workspace",
    copy: "Build question banks and round notes that carry forward.",
    bullets: [
      "Question banks per company",
      "Round-by-round notes",
      "Track what you've practiced",
    ],
    Panel: InterviewPanel,
  },
  {
    icon: FileText,
    title: "Resume & document storage",
    copy: "Store versions and see which resume went where.",
    bullets: [
      "Every resume version in one place",
      "See which file went where",
      "Drafts and finals together",
    ],
    Panel: DocumentsPanel,
  },
  {
    icon: LineChart,
    title: "Dashboard insights",
    copy: "See momentum, response rates, and what needs attention.",
    bullets: [
      "Response and interview rates",
      "Momentum over time",
      "What needs attention now",
    ],
    Panel: InsightsPanel,
  },
];

const total = STEPS.length;

export function FeatureShowcase() {
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnhanced(desktop.matches && !reduce.matches);
    update();
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enhanced) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = onScroll({
      target: wrapper,
      enter: "top top",
      leave: "bottom bottom",
      onUpdate: (self) => {
        const p = Math.min(1, Math.max(0, self.progress));
        const idx = Math.min(total - 1, Math.floor(p * total));
        setActive(idx);
        if (railRef.current) {
          railRef.current.style.transform = `scaleY(${Math.max(0.02, p)})`;
        }
      },
    });
    return () => {
      observer.revert();
    };
  }, [enhanced]);

  return (
    <section
      id="features"
      className="scroll-mt-20 border-t border-border bg-muted/30"
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel label="Features" index="03 / 06" />
          <ScrollReveal
            as="h2"
            containerClassName="mt-5"
            textClassName="text-balance font-serif text-3xl font-light leading-[1.12] tracking-tight text-foreground sm:text-4xl"
            baseOpacity={0.15}
          >
            One workspace for the whole search
          </ScrollReveal>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Everything you need to stay organized, from the first bookmark to
            the final offer.
          </p>
        </div>
      </div>

      {enhanced ? (
        /* Pinned scrollytelling (desktop, motion allowed) */
        <div ref={wrapperRef} className="relative" style={{ height: "360vh" }}>
          <div className="sticky top-0 flex h-screen items-center">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-12 px-4 sm:px-6 lg:px-8">
              {/* Left: steps */}
              <div className="flex gap-6">
                {/* progress rail */}
                <div className="relative mt-1 w-px shrink-0 bg-border">
                  <div
                    ref={railRef}
                    className="absolute inset-x-0 top-0 h-full origin-top bg-[color:var(--secondary)]"
                    style={{ transform: "scaleY(0.02)" }}
                  />
                </div>
                <div className="relative min-h-[280px] flex-1">
                  {STEPS.map((step, i) => {
                    const isActive = i === active;
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.title}
                        aria-hidden={!isActive}
                        className={cn(
                          "absolute inset-0 transition-all duration-500",
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "pointer-events-none translate-y-3 opacity-0",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                            <Icon className="size-4" />
                          </span>
                          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                            <span className="text-muted-foreground/50">
                              {" "}
                              / 0{total}
                            </span>
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                          {step.copy}
                        </p>
                        <ul className="mt-3 grid gap-1.5">
                          {step.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-center gap-2 text-[13px] text-muted-foreground"
                            >
                              <span
                                className="size-1 rounded-full"
                                style={{ backgroundColor: "var(--secondary)" }}
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: crossfading panels */}
              <div className="relative h-[460px]">
                {STEPS.map((step, i) => {
                  const Panel = step.Panel;
                  return (
                    <div
                      key={step.title}
                      aria-hidden={i !== active}
                      className={cn(
                        "absolute inset-0 ease-in-out transition-all duration-700",
                        i === active
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-3 opacity-0",
                      )}
                    >
                      <Panel />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Stacked fallback (mobile / reduced motion / pre-hydration) */
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10">
            {STEPS.map((step, i) => {
              const Panel = step.Panel;
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="grid items-center gap-6 md:grid-cols-2"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                        <span className="text-muted-foreground/50">
                          {" "}
                          / 0{total}
                        </span>
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.copy}
                    </p>
                    <ul className="mt-3 grid gap-1.5">
                      {step.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-2 text-[13px] text-muted-foreground"
                        >
                          <span
                            className="size-1 rounded-full"
                            style={{ backgroundColor: "var(--secondary)" }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="h-[340px]">
                    <Panel />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
