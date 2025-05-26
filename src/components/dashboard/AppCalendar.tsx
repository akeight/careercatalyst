"use client";
import { Calendar } from "@/components/ui/calendar";
import * as React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function AppCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardTitle className="text-center items-center">Calendar</CardTitle>
      <CardContent className="flex w-[400px] overflow-hidden justify-evenly">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </CardContent>
    </Card>
  );
}
