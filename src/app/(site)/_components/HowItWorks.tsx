import ScrollReveal from "./bits/ScrollReveal";
import { SectionLabel } from "./SectionLabel";

const STEPS = [
  {
    step: "01",
    title: "Add an opportunity",
    copy: "Paste a link or add a role in seconds. Company details and deadlines live with it from the start.",
  },
  {
    step: "02",
    title: "Track every stage",
    copy: "Move it through saved, applied, and interview. Attach notes, contacts, and the resume you sent.",
  },
  {
    step: "03",
    title: "Prepare, follow up, close the loop",
    copy: "Get reminders for follow-ups, prep with saved notes, and see each search through to a decision.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel label="How it works" index="04 / 06" />
          <ScrollReveal
            as="h2"
            containerClassName="mt-5"
            textClassName="text-balance font-serif text-3xl font-light leading-[1.12] tracking-tight text-foreground sm:text-4xl"
            baseOpacity={0.15}
          >
            A simple loop you can actually keep
          </ScrollReveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="reveal-card flex flex-col bg-card p-6 sm:p-8"
            >
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {item.step}
                <span className="text-muted-foreground/50"> / 03</span>
              </span>
              <p className="mt-6 text-lg font-semibold text-foreground">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
