import { ArrowUpRight } from "lucide-react";

import ScrollReveal from "./bits/ScrollReveal";
import { SectionLabel } from "./SectionLabel";

const RESOURCES = [
  {
    tag: "Playbook",
    title: "Internship search playbooks",
    copy: "Week-by-week plans to keep applications moving all season.",
  },
  {
    tag: "Checklist",
    title: "Interview prep checklists",
    copy: "What to review before behavioral and technical rounds.",
  },
  {
    tag: "Template",
    title: "Follow-up templates",
    copy: "Short, specific messages that get replies without the awkwardness.",
  },
  {
    tag: "Guide",
    title: "Company research guides",
    copy: "Know what to look for so you walk in with sharp questions.",
  },
];

export function ResourcesTeaser() {
  return (
    <section id="resources" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel label="Resources" index="05 / 06" />
          <ScrollReveal
            as="h2"
            containerClassName="mt-5"
            textClassName="text-balance font-serif text-3xl font-light leading-[1.12] tracking-tight text-foreground sm:text-4xl"
            baseOpacity={0.15}
          >
            Guides to run a sharper search
          </ScrollReveal>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Practical, no-fluff resources for every stage of internship
            recruiting.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RESOURCES.map((resource) => (
            <div
              key={resource.title}
              className="reveal-card group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {resource.tag}
                  </span>
                  <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    Coming soon
                  </span>
                </div>
                <p className="mt-3 text-[15px] font-semibold text-foreground">
                  {resource.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {resource.copy}
                </p>
              </div>
              <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
