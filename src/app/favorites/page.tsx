import FavoritesList from "@/components/dashboard/FavoritesChart/FavoritesList";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import React from "react";

export default async function FavoritesPage() {
  return (
    <div>
      <SidebarProvider>
        <div className="min-h-screen max-w-full">
          <div className="min-h-screen max-w-full">
            <div className="flex">
              {/* Sidebar */}
              <AppSidebar />
              <SidebarTrigger />
              <div className="size-svw mx-auto pt-10">
                <FavoritesList />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
