"use client";

import { Flame } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

const FALLBACK_GOAL = 5;

export default function WeeklyGoalCard() {
  const { data } = trpc.profile.get.useQuery();

  const weeklyGoal = data?.weeklyGoal ?? FALLBACK_GOAL;
  const thisWeek = data?.thisWeekCount ?? 0;
  const streak = data?.streak ?? 0;

  const ratio = weeklyGoal > 0 ? Math.min(1, thisWeek / weeklyGoal) : 0;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * ratio;
  const reached = thisWeek >= weeklyGoal;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Weekly Goal</CardTitle>
        <CardDescription>
          {reached
            ? "Goal reached. Nice work this week!"
            : `${weeklyGoal - thisWeek} more to hit your weekly target.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-4">
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
              of {weeklyGoal}
            </span>
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Flame className="size-4 text-primary" />
            <span>{streak}-week streak</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
