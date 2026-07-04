"use client";

import React from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { cn } from "@/lib/utils/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

type CardProps = React.ComponentProps<typeof Card>;

function deadlineLabel(deadline: Date): string {
  const days = differenceInCalendarDays(deadline, new Date());
  if (days < 0) return "Past due";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export function Notifications({ className, ...props }: CardProps) {
  const { data, isLoading } = trpc.application.getUpcomingDeadlines.useQuery();

  const upcoming = (data ?? []).slice(0, 5);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className={cn("w-[400px]", className)} {...props}>
        <CardHeader>
          <CardTitle className="text-center items-center font-serif text-2xl">
            Upcoming Deadlines
          </CardTitle>
          <CardDescription className="text-center items-center">
            Stay ahead of your application deadlines.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center">
              Loading...
            </p>
          )}

          {!isLoading && upcoming.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No upcoming deadlines. You&apos;re all caught up!
            </p>
          )}

          <div>
            {upcoming.map((app) => {
              const deadline = app.deadline ? new Date(app.deadline) : null;
              if (!deadline) return null;

              return (
                <div
                  key={app.id}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {app.title}
                      {app.company?.name ? ` @ ${app.company.name}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {deadlineLabel(deadline)} &middot;{" "}
                      {format(deadline, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
