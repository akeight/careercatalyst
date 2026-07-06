"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";

//export const description = "An interactive pie chart"

const chartConfig = {
  amount: {
    label: "Amount",
  },
  saved: {
    label: "Saved",
    color: "var(--status-saved)",
  },
  applied: {
    label: "Applied",
    color: "var(--status-applied)",
  },
  interview: {
    label: "Interview",
    color: "var(--status-interview)",
  },
  offer: {
    label: "Offer",
    color: "var(--status-offer)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--status-rejected)",
  },
} satisfies ChartConfig;

export function ChartPieInteractive() {
  const id = "pie-interactive";

  const { data } = trpc.application.getStats.useQuery();
  const counts = data?.counts;

  const applicationData = React.useMemo(
    () => [
      {
        status: "saved",
        amount: counts?.SAVED ?? 0,
        fill: "var(--color-saved)",
      },
      {
        status: "applied",
        amount: counts?.APPLIED ?? 0,
        fill: "var(--color-applied)",
      },
      {
        status: "interview",
        amount: counts?.INTERVIEW ?? 0,
        fill: "var(--color-interview)",
      },
      {
        status: "offer",
        amount: counts?.OFFER ?? 0,
        fill: "var(--color-offer)",
      },
      {
        status: "rejected",
        amount: counts?.REJECTED ?? 0,
        fill: "var(--color-rejected)",
      },
    ],
    [counts],
  );

  const [activeStatus, setActiveStatus] = React.useState("saved");

  const activeIndex = React.useMemo(
    () => applicationData.findIndex((item) => item.status === activeStatus),
    [activeStatus, applicationData],
  );
  const currentStatus = React.useMemo(
    () => applicationData.map((item) => item.status),
    [applicationData],
  );

  return (
    <Card data-chart={id} className="flex w-full h-full">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="font-serif text-2xl text-center mb-2">
            Status Overview
          </CardTitle>
        </div>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {currentStatus.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={applicationData}
              dataKey="amount"
              nameKey="status"
              innerRadius={75}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 8} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 20}
                    innerRadius={outerRadius + 10}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {applicationData[activeIndex].amount.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
