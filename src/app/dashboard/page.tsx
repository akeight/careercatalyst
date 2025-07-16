import StatCard from "@/components/dashboard/StatCard";
import { AppCalendar } from "@/components/dashboard/AppCalendar";
import { Notifications } from "@/components/dashboard/Notifications";
import MotivationCard from "@/components/dashboard/MotivationCard";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { ChartPieInteractive } from "@/components/dashboard/PieChart";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen max-w-full">
        <div className="flex">
          {/* Sidebar */}
          <AppSidebar />
          <SidebarTrigger />
          <div className="flex items-center justify-center max-w-5xl p-5">
            <div className="justify-center grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 col-span-2 xl:col-span-2">
              {/* Stat Cards */}
              <StatCard title="Applications" value={12} />
              <StatCard title="Interviews" value={3} />
              <StatCard title="Offers" value={1} />
              <StatCard title="Rejections" value={2} />

              {/* Full width sections */}

              <div className="col-span-2 xl:col-span-2 mx-auto">
                <Notifications />
              </div>
              <div className="col-span-2 xl:col-span-2 mx-auto">
                <ChartPieInteractive />
              </div>
              <div className="col-span-2 xl:col-span-2 mx-auto">
                <MotivationCard />
              </div>
              <div className="col-span-2 xl:col-span-2 mx-auto">
                <AppCalendar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
