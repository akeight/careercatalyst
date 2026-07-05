"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusToVariant, type AppStatus } from "@/lib/colors";
import { SavedRowActions } from "./SavedRowActions";

export type SavedRow = {
  id: string;
  type: "INTERNSHIP" | "FELLOWSHIP" | "EARLY_CAREER";
  title: string;
  companyId: string;
  companyName: string;
  location: string | null;
  source: string | null;
  jobUrl: string | null;
  deadline: string | Date | null;
  status: AppStatus;
  favorite: boolean;
  contact: {
    name: string;
    email?: string | null;
    phone?: string | null;
    linkedIn?: string | null;
    role?: string | null;
  } | null;
};

const typeLabels: Record<SavedRow["type"], string> = {
  INTERNSHIP: "Internship",
  FELLOWSHIP: "Fellowship",
  EARLY_CAREER: "Early Career",
};

export const savedColumns: ColumnDef<SavedRow>[] = [
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
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-medium">
        <span>{row.getValue("title")}</span>
        {row.original.status && (
          <Badge
            variant={statusToVariant[row.original.status]}
            className="capitalize"
          >
            {row.original.status.toLowerCase()}
          </Badge>
        )}
      </div>
    ),
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
    cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
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
    id: "apply",
    header: "Apply",
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original.jobUrl;
      if (!url) return <span className="text-muted-foreground">—</span>;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          Apply
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
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
        <SavedRowActions row={row.original} />
      </div>
    ),
  },
];
