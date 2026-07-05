import { useDraggable } from "@dnd-kit/core";
import React from "react";
import { cn } from "@/lib/utils/utils";

type DraggableProps = {
  id: string;
  columnId: string;
  children: React.ReactNode;
};

export default function DraggableCard({
  id,
  columnId,
  children,
}: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${columnId}:${id}`,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab touch-none select-none rounded-lg outline-none transition-opacity active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-primary/50",
        isDragging && "opacity-40",
      )}
    >
      {children}
    </div>
  );
}
