"use client";

import KanbanBoardApp from "@/components/layout/KanbanBoard/App";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function TrackerPage() {
  return (
    <div>
      <SidebarProvider>
        <div className="min-h-screen w-full">
          <div className="flex flex-col">
            {/* Sidebar */}
            <AppSidebar />
            <SidebarTrigger />

            <KanbanBoardApp />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
