import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { redirect } from "next/navigation";

import { StatCardInfo } from "@/components/dashboard/StatCards/StatCardInfo";
import AppCalendar from "@/components/dashboard/AppCalendar";
import { Notifications } from "@/components/dashboard/Notifications";
import MotivationCard from "@/components/dashboard/MotivationCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SavedInternships from "@/components/dashboard/SavedInternships";
import PipelineFunnel from "@/components/dashboard/PipelineFunnel";
import InsightsCard from "@/components/dashboard/InsightsCard";
import WeeklyGoalCard from "@/components/dashboard/WeeklyGoalCard";
import { ChartPieInteractive } from "@/components/dashboard/PieChart";
import { trpc } from "@/lib/trpc/client";
import { createServerCaller } from "@/lib/trpc/server";
import { auth } from "@/server/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Prefetch on the server (session cookie is available here) and hydrate the
  // client, so the dashboard renders data without depending on the browser
  // re-sending the cookie on client-side tRPC fetches.
  const queryClient = new QueryClient();
  try {
    const caller = await createServerCaller();
    const [apps, stats, deadlines, profile] = await Promise.all([
      caller.application.getAll(),
      caller.application.getStats(),
      caller.application.getUpcomingDeadlines(),
      caller.profile.get(),
    ]);
    queryClient.setQueryData(
      getQueryKey(trpc.application.getAll, undefined, "query"),
      apps,
    );
    queryClient.setQueryData(
      getQueryKey(trpc.application.getStats, undefined, "query"),
      stats,
    );
    queryClient.setQueryData(
      getQueryKey(trpc.application.getUpcomingDeadlines, undefined, "query"),
      deadlines,
    );
    queryClient.setQueryData(
      getQueryKey(trpc.profile.get, undefined, "query"),
      profile,
    );
  } catch {
    // Fall back to client-side fetching if SSR prefetch fails.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-1">
        <DashboardHeader name={session.user.name} />

        {/* Stat cards */}
        <div
          data-tour="demo-stats"
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <StatCardInfo />
        </div>

        {/* Pipeline + saved quickview / insights + weekly goal */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <PipelineFunnel />
            <SavedInternships />
          </div>
          <div className="flex flex-col gap-4">
            <InsightsCard />
            <WeeklyGoalCard />
          </div>
        </div>

        {/* Status overview + upcoming deadlines */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartPieInteractive />
          <Notifications />
        </div>

        {/* Calendar */}
        <AppCalendar />

        {/* Motivation */}
        <MotivationCard />
      </div>
    </HydrationBoundary>
  );
}
