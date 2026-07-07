"use client";

import * as React from "react";
import {
  addMonths,
  addYears,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";

type View = "month" | "year";

const chartConfig = {
  count: {
    label: "Applications",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export default function PipelineFunnel() {
  const { data: apps } = trpc.application.getAll.useQuery();
  const [view, setView] = React.useState<View>("month");
  const [anchor, setAnchor] = React.useState<Date>(() => new Date());

  const submittedDates = React.useMemo(
    () => (apps ?? []).map((a) => new Date(a.appliedAt as string | Date)),
    [apps],
  );

  const chartData = React.useMemo(() => {
    if (view === "month") {
      const weeks = eachWeekOfInterval(
        { start: startOfMonth(anchor), end: endOfMonth(anchor) },
        { weekStartsOn: 0 },
      );
      return weeks.map((weekStart, i) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
        const count = submittedDates.filter((d) =>
          isWithinInterval(d, { start: weekStart, end: weekEnd }),
        ).length;
        return {
          label: `Wk ${i + 1}`,
          range: format(weekStart, "MMM d"),
          count,
        };
      });
    }

    const months = eachMonthOfInterval({
      start: startOfYear(anchor),
      end: endOfYear(anchor),
    });
    return months.map((month) => {
      const count = submittedDates.filter((d) => isSameMonth(d, month)).length;
      return {
        label: format(month, "MMM"),
        range: format(month, "MMMM"),
        count,
      };
    });
  }, [view, anchor, submittedDates]);

  const periodTotal = chartData.reduce((sum, point) => sum + point.count, 0);
  const periodLabel =
    view === "month" ? format(anchor, "MMMM yyyy") : format(anchor, "yyyy");

  const shift = (direction: 1 | -1) => {
    setAnchor((current) =>
      view === "month"
        ? addMonths(current, direction)
        : addYears(current, direction),
    );
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="grid gap-1">
          <CardTitle className="font-serif text-2xl">
            Applications Submitted
          </CardTitle>
          <CardDescription>
            {periodTotal} submitted in {periodLabel}.
          </CardDescription>
        </div>
        <Select value={view} onValueChange={(v) => setView(v as View)}>
          <SelectTrigger
            className="h-7 w-[130px] rounded-lg"
            aria-label="Select time range"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            <SelectItem value="month" className="rounded-lg">
              Weekly
            </SelectItem>
            <SelectItem value="year" className="rounded-lg">
              Monthly
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => shift(-1)}
            aria-label={view === "month" ? "Previous month" : "Previous year"}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium tabular-nums">
            {periodLabel}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => shift(1)}
            aria-label={view === "month" ? "Next month" : "Next year"}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 4, right: 12, top: 8, bottom: 4 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.range ?? "")
                  }
                />
              }
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={{ fill: "var(--color-count)", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
