"use client";

import * as React from "react";
import { isSameDay, format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { statusBadgeStyle } from "@/lib/colors";
import {
  ApplicationDetailsDrawer,
  type ApplicationDetails,
} from "@/components/applications/ApplicationDetailsDrawer";

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
    <Card className="w-full gap-0 p-0">
      <CardContent className="relative p-0 md:pr-70">
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
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-3 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-80 md:border-t-0 md:border-l">
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
                <p className="text-sm font-medium leading-none">{app.title}</p>
                <p className="text-xs text-muted-foreground">
                  {app.company?.name ?? "Unknown company"}
                </p>
                <Badge
                  style={statusBadgeStyle(app.status)}
                  className="w-fit border-transparent text-[10px]"
                >
                  {app.status}
                </Badge>
                <ApplicationDetailsDrawer
                  application={{
                    id: app.id,
                    type: app.type,
                    title: app.title,
                    companyId: app.companyId,
                    companyName: app.company?.name ?? "Unknown company",
                    location: app.location,
                    status: app.status as ApplicationDetails["status"],
                    source: app.source,
                    appliedAt: app.appliedAt,
                    deadline: app.deadline,
                    favorite: app.favorite,
                    createdAt: app.createdAt,
                    updatedAt: app.updatedAt,
                    contact: app.contact
                      ? {
                          id: app.contact.id,
                          name: app.contact.name,
                          email: app.contact.email,
                          phone: app.contact.phone,
                          linkedIn: app.contact.linkedIn,
                          role: app.contact.role,
                          companyName: app.contact.company?.name,
                        }
                      : null,
                  }}
                  trigger={
                    <button className="w-fit text-xs font-medium text-primary hover:underline">
                      View details
                    </button>
                  }
                />
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
  );
}
