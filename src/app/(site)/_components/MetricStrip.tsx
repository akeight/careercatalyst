import CountUp from "./bits/CountUp";
import { SectionLabel } from "./SectionLabel";

const METRICS = [
  {
    to: 6,
    label: "Feature areas",
    sub: "Pipeline, follow-ups, research, prep, docs, insights",
  },
  {
    to: 5,
    label: "Pipeline stages",
    sub: "From saved to offer on one board",
  },
  {
    to: 12,
    label: "Details per role",
    sub: "Deadlines, contacts, notes, and links",
  },
  {
    to: 1,
    label: "Place for it all",
    sub: "No more scattered tabs and sheets",
  },
];

export function MetricStrip() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionLabel label="Why Catalyst" index="01 / 06" />
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-baseline gap-1">
                <CountUp
                  to={metric.to}
                  className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {metric.label}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                {metric.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
