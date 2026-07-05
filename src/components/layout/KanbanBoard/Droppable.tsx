import { useDroppable } from "@dnd-kit/core";
import { useTrackerStore } from "@/store/useTrackerStore";
import DraggableCard from "./Draggable";
import ApplicationCard from "@/components/layout/KanbanBoard/ApplicationCard";
import type { Application } from "@/store/useTrackerStore";
import { cssColorForStatus, type AppStatus } from "@/lib/colors";
import { cn } from "@/lib/utils/utils";

type DroppableProps = {
  columnId: string;
};

export default function DroppableColumn({ columnId }: DroppableProps) {
  const column = useTrackerStore((state) => state.columns[columnId]);
  const apps = useTrackerStore((state) => state.applications);
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  if (!column) return null;

  // Map column title to status for color coding
  const getColumnColor = (title: string): AppStatus => {
    const statusMap: Record<string, AppStatus> = {
      Saved: "SAVED",
      Applied: "APPLIED",
      Interview: "INTERVIEW",
      Pending: "PENDING",
      Offer: "OFFER",
      Rejected: "REJECTED",
    };
    return statusMap[title] || "SAVED";
  };

  const accent = cssColorForStatus(getColumnColor(column.title));

  const fullItems: Application[] = column.items
    .map((id) => apps.find((app) => app.id === id))
    .filter((app): app is Application => Boolean(app));

  return (
    <div className="flex w-60 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {column.title}
          </h2>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {fullItems.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[8rem] flex-1 flex-col gap-2 rounded-xl bg-muted/40 p-2 transition-colors max-h-[calc(100vh-13rem)] overflow-y-auto",
          isOver && "bg-muted ring-2 ring-inset ring-primary/40",
        )}
      >
        {fullItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
            No applications
          </div>
        ) : (
          fullItems.map((app) => (
            <DraggableCard key={app.id} id={app.id} columnId={column.id}>
              <ApplicationCard app={app} />
            </DraggableCard>
          ))
        )}
      </div>
    </div>
  );
}
