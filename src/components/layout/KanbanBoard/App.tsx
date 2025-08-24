"use client";

import { useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import DroppableColumn from "./Droppable";
import { trpc } from "@/lib/trpc/client";
import {
  useTrackerStore,
  Application,
  ColumnType,
} from "@/store/useTrackerStore";

// Helper to group fetched apps into columns by status
const generateColumnsFromApps = (
  applications: Application[],
): Record<string, ColumnType> => {
  const statuses = ["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
  return statuses.reduce(
    (cols, status) => {
      const id = status.toLowerCase();
      cols[id] = {
        id,
        title: status[0] + status.slice(1).toLowerCase(),
        items: applications.filter((a) => a.status === status).map((a) => a.id),
      };
      return cols;
    },
    {} as Record<string, ColumnType>,
  );
};

export default function KanbanBoardApp() {
  const { data: apps, isLoading } = trpc.application.getAll.useQuery();

  //  Zustand setters & state
  const setApplications = useTrackerStore((s) => s.setApplications);
  const setColumns = useTrackerStore((s) => s.setColumns);
  const columns = useTrackerStore((s) => s.columns);
  const moveCard = useTrackerStore((s) => s.moveCard);
  const reorderCard = useTrackerStore((s) => s.reorderCard);

  // When apps arrive, seed Zustand and build columns
  useEffect(() => {
    if (apps) {
      setApplications(apps);
      setColumns(generateColumnsFromApps(apps));
    }
  }, [apps, setApplications, setColumns]);

  // DnD setup
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event: DragEndEvent) => {
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
      moveCard(itemId, fromCol, toCol, pos === -1 ? toItems.length : pos);
    }
  };

  if (isLoading) return <p className="p-4">Loading…</p>;

  // Render Kanban board
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full bg-background py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-5 justify-items-center gap-6 *:data-[slot=card]:from-muted/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t">
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
      </div>
    </DndContext>
  );
}
