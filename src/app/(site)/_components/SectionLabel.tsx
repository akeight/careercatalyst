import { cn } from "@/lib/utils/utils";

type SectionLabelProps = {
  label: string;
  index?: string;
  align?: "left" | "center";
  tone?: "default" | "invert";
  className?: string;
};

/**
 * Editorial eyebrow: uppercase mono label, optional NN/NN index, hairline rule.
 */
export function SectionLabel({
  label,
  index,
  align = "left",
  tone = "default",
  className,
}: SectionLabelProps) {
  const muted = tone === "invert" ? "text-white/55" : "text-muted-foreground";
  const rule = tone === "invert" ? "bg-white/15" : "bg-border";

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center",
        className,
      )}
    >
      {align === "center" && <span className={cn("h-px w-8", rule)} />}
      <span
        className={cn(
          "font-mono text-[11px] font-medium uppercase tracking-[0.22em]",
          muted,
        )}
      >
        {label}
      </span>
      {index && (
        <span className={cn("font-mono text-[11px] tabular-nums", muted)}>
          {index}
        </span>
      )}
      <span className={cn("h-px flex-1", rule)} />
    </div>
  );
}
