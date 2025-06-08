import StatCard from "@/components/dashboard/StatCard";
import { AppCalendar } from "@/components/dashboard/AppCalendar";
import FavoritesList from "@/components/dashboard/FavoritesChart/FavoritesList";
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
      {session?.user ? (
        <p>Welcome, {session.user.name}!</p>
      ) : (
        <p>You are not logged in.</p>
      )}
      <div className="min-h-screen w-full">
        <div className="flex">
          {/* Sidebar */}
          <AppSidebar />
          <SidebarTrigger />

          <div className="space-y-8 max-w-7xl mx-auto p-6">
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
            <div className="col-span-2 xl:col-span-2 mx-auto">
              <FavoritesList />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
