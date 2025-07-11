import { useDraggable } from "@dnd-kit/core";
import React from "react";

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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${columnId}:${id}`,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: transform ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab select-none"
    >
      {children}
    </div>
  );
}
