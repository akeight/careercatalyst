import { Status } from "@prisma/client";

export const STATUS_VALUES = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const satisfies readonly Status[];

export type StatusValue = (typeof STATUS_VALUES)[number];

// Ordered list of statuses used to render the Kanban columns.
export const KANBAN_STATUSES: Status[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

// Statuses that get their own board column. REJECTED remains a valid status
// everywhere else (dashboard, stats, edit form) but is hidden from the board.
export const KANBAN_COLUMN_STATUSES: Status[] = KANBAN_STATUSES.filter(
  (s) => s !== "REJECTED",
);

// Column id (lowercased status) -> Status enum value.
export const columnIdToStatus = (columnId: string): StatusValue | undefined =>
  KANBAN_STATUSES.find((s) => s.toLowerCase() === columnId.toLowerCase()) as
    | StatusValue
    | undefined;

// Human-friendly label, e.g. "SAVED" -> "Saved".
export const statusLabel = (status: string): string =>
  status[0] + status.slice(1).toLowerCase();
