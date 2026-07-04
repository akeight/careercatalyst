import AppCalendar from "@/components/dashboard/AppCalendar";
import { Notifications } from "@/components/dashboard/Notifications";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function CalendarPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full pt-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Deadline Calendar
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Track your application deadlines in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 justify-items-center">
          <AppCalendar />
          <Notifications />
        </div>
      </div>
    </div>
  );
}
