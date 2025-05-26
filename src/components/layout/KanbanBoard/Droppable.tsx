import { useDroppable } from "@dnd-kit/core";
import DraggableCard from "./Draggable";
import { Card, CardTitle, CardContent } from "../../ui/card";

type DroppableProps = {
  column: {
    id: string;
    title: string;
    items: string[];
  };
};

export default function DroppableColumn({ column }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <Card ref={setNodeRef} className="bg-muted p-4 shadow">
      <CardTitle className="font-bold capitalize mb-4">
        {column.title}
      </CardTitle>
      <CardContent className="space-y-1">
        {column.items.map((item) => (
          <DraggableCard key={item} id={item} columnId={column.id} />
        ))}
      </CardContent>
    </Card>
  );
}
