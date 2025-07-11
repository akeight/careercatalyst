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
        <div className="min-h-screen max-w-full">
          <div className="min-h-screen max-w-full">
            <div className="flex">
              {/* Sidebar */}
              <AppSidebar />
              <SidebarTrigger />
              <div className="space-y-4 max-w-full mx-auto p-8">
                <KanbanBoardApp />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
