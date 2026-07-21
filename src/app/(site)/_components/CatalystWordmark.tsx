import { cn } from "@/lib/utils/utils";
import Image from "next/image";

export function CatalystWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/wordmark-accent.png"
        alt="Catalyst"
        width={512}
        height={128}
        priority
        className="h-8 w-auto"
      />
    </span>
  );
}
