import { useDroppable } from "@dnd-kit/core";
import { useTrackerStore } from "@/store/useTrackerStore";
import DraggableCard from "./Draggable";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import ApplicationCard from "@/components/layout/KanbanBoard/ApplicationCard";
import type { Application } from "@/store/useTrackerStore";

type DroppableProps = {
  columnId: string;
};

export default function DroppableColumn({ columnId }: DroppableProps) {
  const column = useTrackerStore((state) => state.columns[columnId]);
  const apps = useTrackerStore((state) => state.applications);
  const { setNodeRef } = useDroppable({ id: columnId });

  if (!column) return null;

  const fullItems: Application[] = column.items
    .map((id) => apps.find((app) => app.id === id))
    .filter((app): app is Application => Boolean(app));

  return (
    <Card ref={setNodeRef} className="bg-muted p-4 shadow">
      <CardTitle className="font-bold capitalize mb-4">
        {column.title}
      </CardTitle>
      <CardContent className="space-y-1">
        {fullItems.map((app) => (
          <DraggableCard key={app.id} id={app.id} columnId={column.id}>
            <ApplicationCard app={app} />
          </DraggableCard>
        ))}
      </CardContent>
    </Card>
  );
}
