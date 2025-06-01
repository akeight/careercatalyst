"use client";

import KanbanBoardApp from "@/components/layout/KanbanBoard/App";
import ApplicationForm from "@/components/applications/ApplicationForm";
import ApplicationList from "@/components/applications/ApplicationList";

export default function TrackerPage() {
  const userId = "demo@example.com";

  return (
    <div>
      <KanbanBoardApp />
      <ApplicationForm userId={userId} />
      <ApplicationList userId={userId} />
    </div>
  );
}
