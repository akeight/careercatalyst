"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const notifications = [
  {
    title: "Follow up with Google recruiter.",
    description: "1 hour ago",
  },
  {
    title: "Follow up on Uber application.",
    description: "1 hour ago",
  },
  {
    title: "Meta application deadline soon!",
    description: "2 hours ago",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function Notifications({ className, ...props }: CardProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className={cn("w-[400px]", className)} {...props}>
        <CardHeader>
          <CardTitle className="text-center items-center font-serif text-2xl">
            Notifications
          </CardTitle>
          <CardDescription className="text-center items-center">
            These are your priority today.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Check /> Mark all as read
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
