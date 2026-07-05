"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2, Plus, Target } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { easeCurve } from "@/lib/motion";

type Goal = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  targetDate: Date | string | null;
};

export function GoalsList({ goals }: { goals: Goal[] }) {
  const utils = trpc.useUtils();
  const reduceMotion = useReducedMotion();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const invalidate = () => utils.profile.get.invalidate();

  const createGoal = trpc.profile.goals.create.useMutation({
    onSuccess: () => {
      invalidate();
      setTitle("");
      setDescription("");
      setTargetDate("");
      toast.success("Goal added!");
    },
    onError: () => toast.error("Failed to add goal."),
  });

  const toggleGoal = trpc.profile.goals.toggle.useMutation({
    onSuccess: invalidate,
    onError: () => toast.error("Failed to update goal."),
  });

  const deleteGoal = trpc.profile.goals.delete.useMutation({
    onSuccess: () => {
      invalidate();
      toast.success("Goal removed.");
    },
    onError: () => toast.error("Failed to remove goal."),
  });

  const handleAdd = () => {
    if (!title.trim()) {
      toast.error("Give your goal a title.");
      return;
    }
    createGoal.mutate({
      title: title.trim(),
      description: description.trim(),
      targetDate,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Your goals</CardTitle>
        <CardDescription>
          Set personal targets to keep your search on track.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new goal */}
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <Input
            placeholder="e.g. Finish my portfolio site"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <Textarea
            placeholder="Optional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-0"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="sm:max-w-[200px]"
            />
            <Button
              type="button"
              onClick={handleAdd}
              disabled={createGoal.isPending}
              className="sm:ml-auto"
            >
              <Plus className="size-4" />
              {createGoal.isPending ? "Adding..." : "Add goal"}
            </Button>
          </div>
        </div>

        {/* Goal list */}
        {goals.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <Target className="size-8" />
            <p className="text-sm">No goals yet. Add your first one above.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {goals.map((goal) => (
                <motion.li
                  key={goal.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: -12, transition: { duration: 0.2 } }
                  }
                  transition={{ duration: 0.25, ease: easeCurve }}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    checked={goal.completed}
                    onCheckedChange={() => toggleGoal.mutate({ id: goal.id })}
                    className="mt-0.5"
                    aria-label="Toggle goal complete"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium break-words",
                        goal.completed && "text-muted-foreground line-through",
                      )}
                    >
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground break-words">
                        {goal.description}
                      </p>
                    )}
                    {goal.targetDate && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Target:{" "}
                        {format(new Date(goal.targetDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Delete goal"
                    onClick={() => deleteGoal.mutate({ id: goal.id })}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
