import { cn } from "@/lib/utils/utils";

export function CatalystWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-lg border border-border bg-foreground text-background"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l1-8Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-foreground">
        Catalyst
      </span>
    </span>
  );
}
