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
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-1">
      <DashboardHeader name={session.user.name} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
  );
}
