"use client";

import { isAfter, startOfWeek } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

const WEEKLY_GOAL = 5;

export default function WeeklyGoalCard() {
  const { data } = trpc.application.getAll.useQuery();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeek = (data ?? []).filter(
    (app) => app.createdAt && isAfter(new Date(app.createdAt), weekStart),
  ).length;

  const ratio = Math.min(1, thisWeek / WEEKLY_GOAL);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * ratio;
  const reached = thisWeek >= WEEKLY_GOAL;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Weekly Goal</CardTitle>
        <CardDescription>
          {reached
            ? "Goal reached. Nice work this week!"
            : `${WEEKLY_GOAL - thisWeek} more to hit your weekly target.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="10"
              className="stroke-muted"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="var(--primary)"
              strokeDasharray={`${dash} ${circumference}`}
              transform="rotate(-90 60 60)"
              className="transition-all"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-semibold tabular-nums">
              {thisWeek}
            </span>
            <span className="text-xs text-muted-foreground">
              of {WEEKLY_GOAL}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
