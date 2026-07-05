"use client";

import { motion, useReducedMotion } from "motion/react";
import { Flame } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { easeCurve } from "@/lib/motion";

export function StreakCard({
  streak,
  thisWeekCount,
  weeklyGoal,
}: {
  streak: number;
  thisWeekCount: number;
  weeklyGoal: number;
}) {
  const reduceMotion = useReducedMotion();
  const ratio = weeklyGoal > 0 ? Math.min(1, thisWeekCount / weeklyGoal) : 0;
  const remaining = Math.max(0, weeklyGoal - thisWeekCount);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Your streak</CardTitle>
        <CardDescription>
          {streak > 0
            ? `You're on a ${streak}-week roll. Keep it going!`
            : "Hit your weekly goal to start a streak."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Flame className="size-8 text-primary" />
          </div>
          <div>
            <motion.div
              key={streak}
              initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: easeCurve }}
              className="text-4xl font-semibold tabular-nums"
            >
              {streak}
            </motion.div>
            <p className="text-sm text-muted-foreground">
              {streak === 1 ? "week" : "weeks"} in a row
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">This week</span>
            <span className="font-medium tabular-nums">
              {thisWeekCount} / {weeklyGoal}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${ratio * 100}%` }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.7, ease: easeCurve }
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {remaining > 0
              ? `${remaining} more to hit this week's goal.`
              : "Weekly goal reached. Nice work!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
