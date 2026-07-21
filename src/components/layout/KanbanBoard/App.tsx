"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { toast } from "sonner";

import DroppableColumn from "./Droppable";
import ApplicationCard from "./ApplicationCard";
import { trpc } from "@/lib/trpc/client";
import {
  useTrackerStore,
  Application,
  ColumnType,
} from "@/store/useTrackerStore";
import {
  KANBAN_COLUMN_STATUSES,
  columnIdToStatus,
  statusLabel,
} from "@/lib/status";

// Helper to group fetched apps into columns by status
const generateColumnsFromApps = (
  applications: Application[],
): Record<string, ColumnType> => {
  return KANBAN_COLUMN_STATUSES.reduce(
    (cols, status) => {
      const id = status.toLowerCase();
      cols[id] = {
        id,
        title: statusLabel(status),
        items: applications.filter((a) => a.status === status).map((a) => a.id),
      };
      return cols;
    },
    {} as Record<string, ColumnType>,
  );
};

export default function KanbanBoardApp() {
  const { data: apps, isLoading } = trpc.application.getAll.useQuery();
  const utils = trpc.useUtils();

  //  Zustand setters & state
  const setApplications = useTrackerStore((s) => s.setApplications);
  const setColumns = useTrackerStore((s) => s.setColumns);
  const columns = useTrackerStore((s) => s.columns);
  const applications = useTrackerStore((s) => s.applications);
  const moveCard = useTrackerStore((s) => s.moveCard);
  const reorderCard = useTrackerStore((s) => s.reorderCard);
  const updateApplicationStatus = useTrackerStore(
    (s) => s.updateApplicationStatus,
  );

  // Currently dragged card id (used to render the DragOverlay preview).
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeApp = activeId
    ? applications.find((a) => a.id === activeId.split(":")[1])
    : undefined;

  const updateStatus = trpc.application.updateStatus.useMutation({
    onSuccess: (_data, variables) => {
      utils.application.getAll.invalidate();
      utils.application.getStats.invalidate();
      if (variables.status === "APPLIED") {
        toast("Create a Company Snapshot while you wait?", {
          action: {
            label: "Create Snapshot",
            onClick: () => {
              window.location.href = `/applications/${variables.id}/interview-prep`;
            },
          },
        });
      }
      if (variables.status === "INTERVIEW") {
        toast(
          "You got an interview. Turn your company research into a complete Interview Brief.",
          {
            action: {
              label: "Build Interview Brief",
              onClick: () => {
                window.location.href = `/applications/${variables.id}/interview-prep`;
              },
            },
            cancel: { label: "Later", onClick: () => {} },
          },
        );
      }
    },
    onError: () => {
      toast.error("Couldn't save the status change. Reverting.");
      utils.application.getAll.invalidate();
    },
  });

  // When apps arrive, seed Zustand and build columns
  useEffect(() => {
    if (apps) {
      setApplications(apps);
      setColumns(generateColumnsFromApps(apps));
    }
  }, [apps, setApplications, setColumns]);

  // DnD setup
  // A small distance activation constraint means a plain click never starts a
  // drag. Without it, pointerdown events that bubble up (via the React tree)
  // from portaled Radix modals/drawers rendered inside the draggable card would
  // immediately begin a drag and swallow the click, breaking their buttons.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const [fromCol, itemId] = active.id.toString().split(":");
    const [toCol, overId] = over.id.toString().split(":");

    if (fromCol === toCol) {
      const col = columns[fromCol];
      const oldIndex = col.items.indexOf(itemId);
      const newIndex = col.items.indexOf(overId);
      if (oldIndex !== newIndex) {
        reorderCard(fromCol, oldIndex, newIndex);
      }
    } else {
      const toItems = columns[toCol].items;
      const pos = toItems.indexOf(overId);

      // Optimistically move the card locally and update its status label…
      moveCard(itemId, fromCol, toCol, pos === -1 ? toItems.length : pos);

      const newStatus = columnIdToStatus(toCol);
      if (newStatus) {
        updateApplicationStatus(itemId, newStatus);
        // …then persist to the database.
        updateStatus.mutate({ id: itemId, status: newStatus });
      }
    }
  };

  if (isLoading) return <p className="p-4">Loading…</p>;

  const totalCount = Object.values(columns).reduce(
    (sum, col) => sum + col.items.length,
    0,
  );

  // Render Kanban board
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="w-full">
        <div className="mb-10 flex items-baseline justify-center gap-3">
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            Manage Your Applications
          </h1>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium text-muted-foreground">
            {totalCount}
          </span>
        </div>

        <div
          data-tour="demo-kanban"
          className="mx-auto flex w-fit max-w-full gap-4 overflow-x-auto pb-4"
        >
          {Object.values(columns).map((col) => (
            <SortableContext
              key={col.id}
              items={col.items.map((id) => `${col.id}:${id}`)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableColumn columnId={col.id} />
            </SortableContext>
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeApp ? (
          <div className="w-60 rotate-2 cursor-grabbing">
            <ApplicationCard app={activeApp} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
