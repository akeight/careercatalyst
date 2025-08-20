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
    <Card
      ref={setNodeRef}
      className="bg-muted p-2.5 shadow-2xs w-55 flex-col items-center"
    >
      <CardTitle className="font-bold capitalize mb-0.25 font-serif text-lg p-1 w-55 border-b text-center border-border/20">
        {column.title}
      </CardTitle>
      <CardContent className="space-y-2 max-w-sm text-sm">
        {fullItems.map((app) => (
          <DraggableCard key={app.id} id={app.id} columnId={column.id}>
            <ApplicationCard app={app} />
          </DraggableCard>
        ))}
      </CardContent>
    </Card>
  );
}
