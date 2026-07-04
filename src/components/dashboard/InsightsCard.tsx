"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

function pct(numerator: number, denominator: number): string {
  if (denominator <= 0) return "0%";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

export default function InsightsCard() {
  const { data } = trpc.application.getStats.useQuery();
  const counts = data?.counts;
  const total = data?.total ?? 0;

  const saved = counts?.SAVED ?? 0;
  const interview = counts?.INTERVIEW ?? 0;
  const offer = counts?.OFFER ?? 0;
  const rejected = counts?.REJECTED ?? 0;

  // Applications actually submitted (everything except still-saved drafts).
  const applied = Math.max(0, total - saved);
  const responded = interview + offer + rejected;

  const metrics = [
    { label: "Response rate", value: pct(responded, applied) },
    { label: "Interview rate", value: pct(interview, applied) },
    { label: "Offer rate", value: pct(offer, applied) },
  ];

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Insights</CardTitle>
        <CardDescription>How your applications are converting.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col items-center justify-center rounded-lg border p-3 text-center"
          >
            <span className="text-2xl font-semibold tabular-nums">
              {metric.value}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              {metric.label}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
