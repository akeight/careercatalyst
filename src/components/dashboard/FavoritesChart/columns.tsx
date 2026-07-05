"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusBadgeStyle, type AppStatus } from "@/lib/colors";
import { ApplicationDetailsDrawer } from "@/components/applications/ApplicationDetailsDrawer";
import { FavoriteRowActions } from "./FavoriteRowActions";
import type { ContactType } from "@/lib/contactTypes";

export type FavoriteRow = {
  id: string;
  type: "INTERNSHIP" | "FELLOWSHIP" | "EARLY_CAREER";
  title: string;
  companyId: string;
  companyName: string;
  location: string | null;
  status: AppStatus;
  source: string | null;
  jobUrl: string | null;
  notes: string | null;
  appliedAt: string | Date | null;
  deadline: string | Date | null;
  favorite: boolean;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  contact: {
    id: string;
    name: string;
    type?: ContactType | null;
    title?: string | null;
    email?: string | null;
    phone?: string | null;
    linkedIn?: string | null;
    role?: string | null;
    notes?: string | null;
    companyName?: string | null;
  } | null;
};

const typeLabels: Record<FavoriteRow["type"], string> = {
  INTERNSHIP: "Internship",
  FELLOWSHIP: "Fellowship",
  EARLY_CAREER: "Early Career",
};

export const columns: ColumnDef<FavoriteRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Position
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.companyName}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        style={statusBadgeStyle(row.original.status)}
        className="border-transparent capitalize"
      >
        {row.original.status.toLowerCase()}
      </Badge>
    ),
    filterFn: (row, id, value) => value === "ALL" || row.getValue(id) === value,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {typeLabels[row.original.type] ?? row.original.type}
      </span>
    ),
    filterFn: (row, id, value) => value === "ALL" || row.getValue(id) === value,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.location || "—"}
      </span>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.source || "—"}
      </span>
    ),
  },
  {
    id: "details",
    header: "Details",
    enableSorting: false,
    cell: ({ row }) => (
      <ApplicationDetailsDrawer
        application={row.original}
        trigger={
          <button className="font-medium text-primary hover:underline">
            View details
          </button>
        }
      />
    ),
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Applied
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const appliedAt = row.original.appliedAt;
      return (
        <span className="text-muted-foreground">
          {appliedAt ? format(new Date(appliedAt), "MMM dd, yyyy") : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Deadline
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const deadline = row.original.deadline;
      return (
        <span className="text-muted-foreground">
          {deadline ? format(new Date(deadline), "MMM dd, yyyy") : "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <FavoriteRowActions row={row.original} />
      </div>
    ),
  },
];
