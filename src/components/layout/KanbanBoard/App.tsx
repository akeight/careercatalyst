"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DroppableColumn from "./Droppable";
import { useTrackerStore } from "../../../store/useTrackerStore";

export default function KanbanBoardApp() {
  const { columns, reorderCard, moveCard } = useTrackerStore();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const [activeColumnId, activeItemId] = active.id.toString().split(":");
    const [overColumnId, overItemId] = over.id.toString().split(":");

    if (activeColumnId === overColumnId) {
      const column = columns[activeColumnId];
      const oldIndex = column.items.findIndex(
        (item: string) => item === activeItemId,
      );
      const newIndex = column.items.findIndex(
        (item: string) => item === overItemId,
      );

      if (oldIndex !== newIndex) {
        reorderCard(activeColumnId, oldIndex, newIndex);
      }
    } else {
      //const fromItems = columns[activeColumnId].items;
      const newPosition = overItemId
        ? columns[overColumnId].items.findIndex(
            (item: string) => item === overItemId,
          )
        : columns[overColumnId].items.length;

      moveCard(activeItemId, activeColumnId, overColumnId, newPosition);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-6">
        {Object.values(columns).map((column) => (
          <SortableContext
            key={column.id}
            items={column.items.map((item: string) => `${column.id}:${item}`)}
            strategy={verticalListSortingStrategy}
          >
            <DroppableColumn column={column} />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}
