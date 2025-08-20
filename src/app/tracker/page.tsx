"use client";

import KanbanBoardApp from "@/components/layout/KanbanBoard/App";

import React from "react";

export default function TrackerPage() {
  return (
    <div>
      <div className="min-h-screen max-w-full">
        <div className="min-h-screen max-w-full">
          <div className="flex">
            {/* Sidebar */}

            <div className="pt-8">
              <KanbanBoardApp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
