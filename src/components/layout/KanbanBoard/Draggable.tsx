"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardTitle, CardContent } from "../../ui/card";

type DraggableProps = {
  id: string;
  columnId: string;
};

export default function DraggableCard({ id, columnId }: DraggableProps) {
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
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab select-none"
    >
      <CardTitle className="text-sm items-center mx-6">{id}</CardTitle>
      <CardContent className="text-xs text-muted-foreground">
        {/* card meta data */}
        Software Engineer Intern
      </CardContent>
    </Card>
  );
}
