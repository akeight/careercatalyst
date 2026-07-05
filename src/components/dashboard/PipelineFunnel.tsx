"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

const STAGES = [
  { key: "SAVED", label: "Saved", color: "var(--status-saved)" },
  { key: "APPLIED", label: "Applied", color: "var(--status-applied)" },
  { key: "INTERVIEW", label: "Interview", color: "var(--status-interview)" },
  { key: "OFFER", label: "Offer", color: "var(--status-offer)" },
] as const;

export default function PipelineFunnel() {
  const { data } = trpc.application.getStats.useQuery();
  const counts = data?.counts;

  const values = STAGES.map((stage) => counts?.[stage.key] ?? 0);
  const max = Math.max(1, ...values);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Pipeline</CardTitle>
        <CardDescription>
          Your applications across each stage of the funnel.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {STAGES.map((stage, i) => {
          const value = values[i];
          const width = Math.round((value / max) * 100);
          return (
            <div key={stage.key} className="grid gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stage.label}</span>
                <span className="font-medium tabular-nums">{value}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(value > 0 ? 6 : 0, width)}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
