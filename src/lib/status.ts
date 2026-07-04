import { Status } from "@prisma/client";

// Ordered list of statuses used to render the Kanban columns.
export const KANBAN_STATUSES: Status[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "PENDING",
  "OFFER",
  "REJECTED",
];

// Column id (lowercased status) -> Status enum value.
export const columnIdToStatus = (columnId: string): Status | undefined =>
  KANBAN_STATUSES.find((s) => s.toLowerCase() === columnId.toLowerCase());

// Human-friendly label, e.g. "SAVED" -> "Saved".
export const statusLabel = (status: string): string =>
  status[0] + status.slice(1).toLowerCase();
