"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Linkedin, Mail, Phone } from "lucide-react";
import { ContactType } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BadgeVariant } from "@/lib/colors";
import { ContactRowActions } from "./ContactRowActions";

export type ContactRow = {
  id: string;
  name: string;
  type: ContactType | null;
  title: string | null;
  companyId: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  linkedIn: string | null;
  notes: string | null;
};

export const contactTypeLabels: Record<ContactType, string> = {
  RECRUITER: "Recruiter",
  REFERRAL: "Referral",
  CONNECTION: "Connection",
  MENTOR: "Mentor",
  HIRING_MANAGER: "Hiring Manager",
  OTHER: "Other",
};

const typeVariant: Record<ContactType, BadgeVariant> = {
  RECRUITER: "default",
  REFERRAL: "secondary",
  CONNECTION: "outline",
  MENTOR: "secondary",
  HIRING_MANAGER: "default",
  OTHER: "outline",
};

export const contactColumns: ColumnDef<ContactRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      if (!type) return <span className="text-muted-foreground">—</span>;
      return (
        <Badge variant={typeVariant[type]}>{contactTypeLabels[type]}</Badge>
      );
    },
    filterFn: (row, id, value) => value === "ALL" || row.getValue(id) === value,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.title || "—"}</span>
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
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.companyName || "—"}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email;
      if (!email) return <span className="text-muted-foreground">—</span>;
      return (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <Mail className="h-3.5 w-3.5" />
          {email}
        </a>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone;
      if (!phone) return <span className="text-muted-foreground">—</span>;
      return (
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <Phone className="h-3.5 w-3.5" />
          {phone}
        </a>
      );
    },
  },
  {
    id: "linkedIn",
    header: "LinkedIn",
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original.linkedIn;
      if (!url) return <span className="text-muted-foreground">—</span>;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          aria-label="Open LinkedIn profile"
        >
          <Linkedin className="h-4 w-4" />
          Profile
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
        <ContactRowActions row={row.original} />
      </div>
    ),
  },
];
