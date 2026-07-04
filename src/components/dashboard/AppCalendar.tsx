"use client";

import * as React from "react";
import { isSameDay, format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { statusToVariant } from "@/lib/colors";

export default function AppCalendar() {
  const { data: apps } = trpc.application.getAll.useQuery();

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const withDeadlines = React.useMemo(
    () => (apps ?? []).filter((a) => a.deadline),
    [apps],
  );

  const deadlineDates = React.useMemo(
    () => withDeadlines.map((a) => new Date(a.deadline as string | Date)),
    [withDeadlines],
  );

  const selectedApps = React.useMemo(() => {
    if (!date) return [];
    return withDeadlines.filter((a) =>
      isSameDay(new Date(a.deadline as string | Date), date),
    );
  }, [withDeadlines, date]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="gap-0 p-0">
        <CardContent className="relative p-0 md:pr-60">
          <div className="p-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
              showOutsideDays={false}
              modifiers={{
                deadline: deadlineDates,
              }}
              modifiersClassNames={{
                deadline:
                  "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary",
              }}
              className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
              formatters={{
                formatWeekdayName: (d) =>
                  d.toLocaleString("en-US", { weekday: "short" }),
              }}
            />
          </div>
          <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-3 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-60 md:border-t-0 md:border-l">
            <p className="text-sm font-medium">
              {date ? format(date, "EEEE, MMM d") : "Select a date"}
            </p>
            {selectedApps.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No deadlines on this day.
              </p>
            ) : (
              selectedApps.map((app) => (
                <div key={app.id} className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {app.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.company?.name ?? "Unknown company"}
                  </p>
                  <Badge
                    variant={statusToVariant[app.status]}
                    className="w-fit text-[10px]"
                  >
                    {app.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
          <div className="text-sm text-muted-foreground">
            {withDeadlines.length > 0
              ? `${withDeadlines.length} application${
                  withDeadlines.length === 1 ? "" : "s"
                } with deadlines. Dots mark deadline days.`
              : "Add deadlines to your applications to see them here."}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
