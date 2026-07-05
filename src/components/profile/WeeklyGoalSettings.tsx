"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hoverTap } from "@/lib/motion";

const MIN = 1;
const MAX = 50;

export function WeeklyGoalSettings({ weeklyGoal }: { weeklyGoal: number }) {
  const utils = trpc.useUtils();
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(weeklyGoal);

  useEffect(() => setValue(weeklyGoal), [weeklyGoal]);

  const updateProfile = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      toast.success("Weekly goal updated!");
    },
    onError: () => toast.error("Failed to update weekly goal."),
  });

  const clamp = (n: number) => Math.max(MIN, Math.min(MAX, n));
  const dirty = value !== weeklyGoal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">
          Weekly application goal
        </CardTitle>
        <CardDescription>
          How many applications do you want to send each week?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-center gap-6">
          <motion.div {...(reduceMotion ? {} : hoverTap)}>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease goal"
              disabled={value <= MIN}
              onClick={() => setValue((v) => clamp(v - 1))}
            >
              <Minus className="size-4" />
            </Button>
          </motion.div>

          <motion.span
            key={value}
            initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 text-center text-5xl font-semibold tabular-nums"
          >
            {value}
          </motion.span>

          <motion.div {...(reduceMotion ? {} : hoverTap)}>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase goal"
              disabled={value >= MAX}
              onClick={() => setValue((v) => clamp(v + 1))}
            >
              <Plus className="size-4" />
            </Button>
          </motion.div>
        </div>

        <Button
          type="button"
          className="w-full"
          disabled={!dirty || updateProfile.isPending}
          onClick={() => updateProfile.mutate({ weeklyGoal: value })}
        >
          {updateProfile.isPending ? "Saving..." : "Save goal"}
        </Button>
      </CardContent>
    </Card>
  );
}
