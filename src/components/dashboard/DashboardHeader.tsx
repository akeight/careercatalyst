"use client";

import { format } from "date-fns";
import { useSyncExternalStore } from "react";

function greeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function subscribe() {
  return () => {};
}

export default function DashboardHeader({ name }: { name?: string | null }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const now = mounted ? new Date() : null;
  const firstName = name?.split(" ")[0];
  const headline = `${now ? greeting(now) : "Good afternoon"}${
    firstName ? `, ${firstName}` : ""
  }.`;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">
        {now ? format(now, "EEEE, MMMM d") : "\u00a0"}
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl">
        <span className={now ? undefined : "invisible"}>{headline}</span>
      </h1>
      <p className="text-sm text-muted-foreground">
        Here&apos;s where your job search stands today.
      </p>
    </div>
  );
}
