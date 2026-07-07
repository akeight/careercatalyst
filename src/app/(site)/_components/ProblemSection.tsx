import ScrollReveal from "./bits/ScrollReveal";
import { SectionLabel } from "./SectionLabel";

const PROBLEMS = [
  {
    title: "Spreadsheets get messy",
    copy: "Rows pile up, columns drift, and you stop trusting your own tracker.",
  },
  {
    title: "Job links disappear",
    copy: "Postings expire and the tab you meant to save is long gone.",
  },
  {
    title: "Follow-ups get forgotten",
    copy: "The right time to check in passes before you remember to.",
  },
  {
    title: "Research lives everywhere",
    copy: "Notes are split across docs, DMs, and a dozen open tabs.",
  },
  {
    title: "Interview prep starts late",
    copy: "You scramble the night before instead of building on past rounds.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel label="The problem" index="02 / 06" />
          <ScrollReveal
            as="h2"
            containerClassName="mt-5"
            textClassName="text-balance font-serif text-3xl font-light leading-[1.12] tracking-tight text-foreground sm:text-4xl"
            baseOpacity={0.15}
          >
            The job search scatters faster than you can track it
          </ScrollReveal>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            A tab here, a note there, a deadline you meant to remember. The
            system you started in week one rarely survives the season.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((problem) => (
            <div
              key={problem.title}
              className="reveal-card rounded-2xl border border-border bg-card p-5 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"
                >
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-foreground">
                    {problem.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                    {problem.copy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
